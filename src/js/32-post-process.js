function createPostProcess(game) {
  const _uTexture = 'a';
  const _uResolution = 'b';
  const _uTs = 'c';
  const _uLevels = 'd';
  const _uTrackOffset = 'e';
  const _uSpeed = 'f';

  // Shaders for full screen quad render
  const vertexSource = `#version 300 es\n
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

  function wrapFragmentSource(header, body) {
    return `#version 300 es\n
    precision mediump float;

    const float tau = 3.1415 * 2.;

    uniform float ${_uTs};
    uniform float ${_uSpeed};
    uniform vec2 ${_uResolution};
    uniform sampler2D ${_uTexture};
    uniform vec4 ${_uLevels};
    uniform vec2 ${_uTrackOffset};

    out vec4 outColor;

    ${header}

    void main() {
      vec2 uv = gl_FragCoord.xy / ${_uResolution};

      ${body}
    }
    `;
  };

  const createPass = (fragmentBody, fragmentHeader = '') => {
    const fragmentSource = wrapFragmentSource(fragmentBody, fragmentHeader)
    const program = game.gl.createProgram(vertexSource, fragmentSource);
    const uTexture = game.gl.ctx.getUniformLocation(program, _uTexture);
    const uResolution = game.gl.ctx.getUniformLocation(program, _uResolution);
    const uTs = game.gl.ctx.getUniformLocation(program, _uTs);
    const uLevels = game.gl.ctx.getUniformLocation(program, _uLevels);
    const uTrackOffset = game.gl.ctx.getUniformLocation(program, _uTrackOffset);
    const uSpeed = game.gl.ctx.getUniformLocation(program, _uSpeed);

    var ticker = 0;
    return (uDelta) => {
      ticker += uDelta;
      game.gl.ctx.useProgram(program);
      game.gl.ctx.uniform1f(uTs, ticker);
      game.gl.ctx.uniform2f(uResolution, game.gl.ctx.canvas.width, game.gl.ctx.canvas.height);
      game.gl.ctx.uniform4f(
        uLevels,
        game.music.levels.snare,
        game.music.levels.kick,
        game.music.levels.bass,
        game.music.levels.synth
      );
      game.gl.ctx.uniform1i(uTexture, 0);
      game.gl.ctx.uniform1f(uSpeed, game.player.speed);
      game.gl.ctx.uniform2f(uTrackOffset, game.track.offset.x, game.track.offset.y);
      game.gl.ctx.drawArrays(game.gl.ctx.TRIANGLES, 0, 3);
    }
  }

  const glow = createPass(`
  vec4 avgS(vec2 uv, float xd, float yd) {
    const float samples = 6.;
    vec4 r = vec4(0.);

    for (float i = 0.; i < (samples * 2.); i++) {
      float baseOffset = mod(i, samples) - (samples / 2.);
      float xOffset = (baseOffset / (samples / 2.)) * (1. - step(samples, i));
      float yOffset = (baseOffset / (samples / 2.)) * step(samples, i);
      vec2 sampleUv = uv + vec2(xOffset * xd, yOffset * yd);

      r += texture(${_uTexture}, sampleUv);
    }

    return r / (samples * 2.);
  }
`, `
  const float size = 6.;
  float sDistX = 1. / ${_uResolution}.x;
  float sDistY = 1. / ${_uResolution}.y;

  vec4 baseSample = texture(${_uTexture}, uv);
  vec4 glowSample = avgS(uv, sDistX * 10., sDistY * 10.);
  glowSample += avgS(uv, sDistX * 6., sDistY * 6.);
  glowSample += avgS(uv, sDistX * 4., sDistY * 4.);
  glowSample += avgS(uv, sDistX * 2., sDistY * 2.);
  glowSample /= (4. - (${_uLevels}.b * 1.5));
  glowSample = clamp(glowSample - smoothstep(.2, 0.4, baseSample), 0., 1.);
  outColor = baseSample += glowSample;
`
  );

  const bg = createPass(``, `
  vec4 baseSample = texture(${_uTexture}, uv);
  vec2 offset = (${_uTrackOffset} * .5);
  vec2 c = vec2(.5, .5) + offset;
  float sizeMod = ${_uSpeed} * 0.4 + (${_uLevels}.g * 0.2);
  float cDist = 1. - smoothstep(0., 1. + sizeMod, distance(uv, c));
  vec4 xSample = texture(${_uTexture}, uv - ((uv - c) * (cDist * .01)));
  xSample += texture(${_uTexture}, uv - ((uv - c) * (cDist * .02)));
  xSample += texture(${_uTexture}, uv - ((uv - c) * (cDist * .03)));
  xSample += texture(${_uTexture}, uv - ((uv - c) * (cDist * .05)));
  xSample += texture(${_uTexture}, uv - ((uv - c) * (cDist * .06)));
  xSample += texture(${_uTexture}, uv - ((uv - c) * (cDist * .07)));
  xSample += texture(${_uTexture}, uv - ((uv - c) * (cDist * .08)));
  xSample += texture(${_uTexture}, uv - ((uv - c) * (cDist * .10)));
  xSample += texture(${_uTexture}, uv - ((uv - c) * (cDist * .12)));
  xSample *= 0.25;

  vec3 shadowSample = ((xSample.rgb * cDist) * .7);
  vec4 color = vec4(cDist + .2, cDist + .2, cDist + .7, 1.) * 0.6;
  color.rgb -= (shadowSample * 0.6);
  color.rgb *= vec3(1., .8, .7);
  color.rgb *= (cDist * cDist * 1.2) + 0.4;
  outColor = mix(color, baseSample, baseSample.a);
  outColor += vec4(vec3(pow(cDist, 40.) * 0.2), 0.);
`
  );

  const grade = createPass(``, `
  vec4 baseSample = texture(${_uTexture}, uv);
  vec2 offset = (${_uTrackOffset} * .5);
  vec2 c = vec2(.5, .5) + offset;
  float cDist = 1. - smoothstep(0., 1., distance(uv, c));

  vec3 solarColor = vec3(
    smoothstep(.1, .7, baseSample.r),
    smoothstep(.1, .5, baseSample.g),
    smoothstep(.2, .9, baseSample.b)
  );

  outColor = vec4(mix(vec3(
      smoothstep(cos(${_uSpeed} * 5.) * 0.1, 1. - (${_uSpeed} * .1), baseSample.r),
      smoothstep(sin(${_uSpeed} * 14.) * 0.2, .7 + (${_uSpeed} * .4), baseSample.g),
      smoothstep(sin(${_uSpeed} * 28.) * 0.3, 1. - (${_uSpeed} * .3), baseSample.b)
    ), solarColor, 0.1),
    1.
  );
`
  );

  return {
    glow,
    bg,
    grade,
  }
}