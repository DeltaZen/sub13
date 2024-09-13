function createGl(game) {
  const gl = game.canvas.getContext('webgl2');
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);

  // Shaders for full screen quad render
  const quadVertexSource = `#version 300 es

  precision mediump float;

  const vec2 positions[3] = vec2[3](
      vec2(-1.0, -1.0),
      vec2(3.0, -1.0),
      vec2(-1.0, 3.0)
  );

  void main() {
      gl_Position = vec4(positions[gl_VertexID], -1.0, 1.0);
  }
  `;

  const quadFragmentSource = `#version 300 es

  precision mediump float;

  uniform vec2 uResolution;
  uniform sampler2D uTexture;

  out vec4 outColor;

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    outColor = texture(uTexture, uv);
  }
  `;

  // Render passes that can be added elsewhere
  const renderPasses = [];
  const postProcessPasses = [];

  // Set up framebuffers and their textures
  const depthRenderbuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderbuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.canvas.width, gl.canvas.height);

  function createFrameBuffer(texture) {
    const framebuffer = gl.createFramebuffer();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.canvas.width, gl.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderbuffer);
    return framebuffer;
  }
  const texture1 = gl.createTexture();
  const framebuffer1 = createFrameBuffer(texture1);

  const texture2 = gl.createTexture();
  const framebuffer2 = createFrameBuffer(texture2);

  // Public utility methods
  function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createProgram(vertexShaderSource, fragmentShaderSource) {
    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  }

  function createFloatBuffer(program, attrib, size, useDivisor = true) {
    var values = new Float32Array([]);

    gl.useProgram(program);
    const location = gl.getAttribLocation(program, attrib);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(location);

    if (useDivisor) {
      gl.vertexAttribDivisor(location, 1);
    }

    const applyValues = () => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, values, gl.DYNAMIC_DRAW);
    };

    return {
      activate: () => gl.bindBuffer(gl.ARRAY_BUFFER, buffer),
      addValues: (newValues) => {
        values = new Float32Array([...values, ...newValues]);
        applyValues();
      },
      getValues: () => values,
      setValues: (newValues) => {
        values = newValues;
        applyValues();
      }
    }
  };

  // Setup of final quad render program
  const finalProgram = createProgram(quadVertexSource, quadFragmentSource);
  gl.useProgram(finalProgram);
  const uTexture = gl.getUniformLocation(finalProgram, 'uTexture');
  const uResolution = gl.getUniformLocation(finalProgram, 'uResolution');

  // Render function to be called every frame
  const render = (uDelta) => {
    // Update viewport
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.canvas.width = window.innerWidth;
    gl.canvas.height = window.innerHeight;

    // Update textures
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.canvas.width, gl.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.canvas.width, gl.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    // Run render passes
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer1);
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (var pass of renderPasses) {
      pass(uDelta);
    }

    // Run post process passes using ping-pong buffers
    var framebuffer = framebuffer2;
    var texture = texture1;

    for (var pass of postProcessPasses) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      pass(uDelta);

      framebuffer = (framebuffer == framebuffer1) ? framebuffer2 : framebuffer1;
      texture = (texture == texture1) ? texture2 : texture1;
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(finalProgram);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.uniform2f(uResolution, gl.canvas.width, gl.canvas.height);
    gl.uniform1i(uTexture, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  return {
    ctx: gl,
    createProgram,
    createFloatBuffer,
    createFrameBuffer,
    render,
    addRenderPass: pass => renderPasses.push(pass),
    addPostProcessPass: pass => postProcessPasses.push(pass),
  };
}