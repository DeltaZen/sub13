import {cube} from "./primitives.js";
import {randomFloatBetween} from "./utils.js";
import {multiplyMatrices, perspectiveMatrix, lookAtMatrix} from "./math.js";

export function createBoxRenderer(game) {
  const boxRenderer = {
    timeMod: 0,
  };

  const boxDepth = 20;
  const boxMargin = 5;
  const gl = game.gl.ctx;

  const _aVertex = 'a';
  const _aTranslation = 'b';
  const _aScale = 'c';
  const _aColor = 'd';
  const _aTypeMask = 'e';
  const _aBeatMask = 'f';
  const _aPowerupMask = 'g';
  const _aOpponentMask = 'r';
  const _uSpeed = 'h';
  const _uOffset = 'i';
  const _uViewProjectionMatrix = 'j';
  const _uLevels = 'k';
  const _uPowerupDistances = 'l';
  const _uPowerupValues = 'm';
  const _uTs = 'n';
  const _uPlayer = 'o';
  const _uLogo = 'p';
  const _uOpponentDistances = 'q';

  const vertexShaderSource = `#version 300 es

  precision mediump float;

  in vec3 ${_aVertex};
  in vec3 ${_aTranslation};
  in vec3 ${_aScale};
  in vec3 ${_aColor};
  in vec4 ${_aTypeMask};
  in vec4 ${_aBeatMask};
  in vec4 ${_aPowerupMask};
  in vec4 ${_aOpponentMask};

  uniform float ${_uSpeed};
  uniform vec2 ${_uOffset};
  uniform mat4 ${_uViewProjectionMatrix};
  uniform vec4 ${_uLevels};
  uniform vec4 ${_uPowerupDistances};
  uniform vec4 ${_uOpponentDistances};
  uniform vec4 ${_uPowerupValues};
  uniform float ${_uTs};
  uniform vec3 ${_uPlayer};
  uniform vec3 ${_uLogo};

  out float vDepth;
  out vec3 vColor;

  void main() {
    float levelScale = length(${_aBeatMask} * ${_uLevels});
    float powerupScale = length(${_aPowerupMask} * ${_uPowerupDistances});
    float powerupValue = length(${_aPowerupMask} * ${_uPowerupValues});
    vec4 opponentVec = (${_aOpponentMask} * ${_uOpponentDistances});

    vec3 scaledVertex = ${_aVertex} * ${_aScale} * (.4 + (levelScale * 0.4));

    vec3 bgTrans = ${_aTranslation};
    bgTrans.z -= (${_uTs} / 100.);
    bgTrans.z = mod(bgTrans.z, ${boxDepth}.) - ${boxMargin}.;
    bgTrans *= ${_aTypeMask}.x;

    vec3 oTrans = ${_aTranslation};
    oTrans += vec3(0., 0., powerupScale);
    oTrans.x -= step((powerupValue * 0.12) - 0.3, ${_aTranslation}.y) * 9999.;
    oTrans *= ${_aTypeMask}.y;

    vec3 playerTrans = ${_aTranslation};
    playerTrans += ${_uPlayer};
    playerTrans *= ${_aTypeMask}.z;

    vec3 opponentTrans = ${_aTranslation};
    opponentTrans.z += opponentVec.x + opponentVec.y + opponentVec.z + opponentVec.w;

    opponentTrans.x = (
      smoothstep(.0, .4, cos((opponentTrans.z + (${_uTs} * 0.02)) * 0.01))
      - smoothstep(.7, 1.,sin((opponentTrans.z + (${_uTs} * 0.05)) * 0.01))
    ) * .3;

    opponentTrans *= ${_aTypeMask}.w;

    vec3 combined = bgTrans + oTrans + playerTrans + opponentTrans;
    float plainMod = 1. - step(0.01, abs(length(combined)));
    combined += (${_aTranslation} * plainMod);

    vec4 vertexPosition = ${_uViewProjectionMatrix} * vec4(scaledVertex + combined, 1.);
    float depth = max(vertexPosition.z * vertexPosition.z * 0.1, 0.);
    vDepth = (depth / vertexPosition.w);

    vec3 color = ${_aColor} + (vec3(${_aBeatMask}.rgb * levelScale));

    vColor = color * ((1. + (${_uSpeed} * .6)) * (0.2 + (vDepth * 0.6)));
    vColor += (plainMod * vec3(.3));

    gl_Position = vertexPosition + vec4(${_uOffset} * depth, 0, 0.);
  }`;

  const fragmentShaderSource = `#version 300 es

  precision mediump float;

  const float fn = 0.3;
  const float ff = 1.4;

  in float vDepth;
  in vec3 vColor;

  out vec4 oColor;

  void main() {
    float fog = smoothstep(fn, ff, vDepth);
    oColor = mix(vec4(vColor, 1.), vec4(0.), fog);
  }`;

  const boxProgram = game.gl.createProgram(vertexShaderSource, fragmentShaderSource);

  // Setup VAO
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // Setup buffers
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cube.indices, gl.STATIC_DRAW);

  const vertexBuffer = game.gl.createFloatBuffer(boxProgram, _aVertex, 3, false);
  vertexBuffer.addValues(cube.positions);

  const colorBuffer = game.gl.createFloatBuffer(boxProgram, _aColor, 3);
  const levelMaskBuffer = game.gl.createFloatBuffer(boxProgram, _aBeatMask, 4);
  const typeMaskBuffer = game.gl.createFloatBuffer(boxProgram, _aTypeMask, 4);
  const powerupMaskBuffer = game.gl.createFloatBuffer(boxProgram, _aPowerupMask, 4);
  const translationBuffer = game.gl.createFloatBuffer(boxProgram, _aTranslation, 3);
  const scaleBuffer = game.gl.createFloatBuffer(boxProgram, _aScale, 3);
  const opponentMaskBuffer = game.gl.createFloatBuffer(boxProgram, _aOpponentMask, 4);

  gl.bindVertexArray(null);

  const uOffset = gl.getUniformLocation(boxProgram, _uOffset);
  const uLevels = gl.getUniformLocation(boxProgram, _uLevels);
  const uViewProjectionMatrix = gl.getUniformLocation(boxProgram, _uViewProjectionMatrix);
  const uTs = gl.getUniformLocation(boxProgram, _uTs);
  const uSpeed = gl.getUniformLocation(boxProgram, _uSpeed);
  const uPlayer = gl.getUniformLocation(boxProgram, _uPlayer);
  const uLogo = gl.getUniformLocation(boxProgram, _uLogo);
  const uPowerupDistances = gl.getUniformLocation(boxProgram, _uPowerupDistances);
  const uPowerupValues = gl.getUniformLocation(boxProgram, _uPowerupValues);
  const uOpponentDistances = gl.getUniformLocation(boxProgram, _uOpponentDistances);

  boxRenderer.addPowerupBox = (lane, value) => {
    translationBuffer.addValues([lane * 0.3, -0.3 + (value * 0.1), 0]);
    colorBuffer.addValues([.5, .5, value / 5]);
    scaleBuffer.addValues([0.3, 0.05, 0.2]);
    typeMaskBuffer.addValues([0, 1, 0, 0]);
    powerupMaskBuffer.addValues([lane == -1 ? 1 : 0, lane == 0 ? 1 : 0, lane == 1 ? 1 : 0, 0]);
    levelMaskBuffer.addValues([0, 0, 0, 0]);
    opponentMaskBuffer.addValues([0, 0, 0, 0]);
  }

  boxRenderer.addTrackBox = (x, z) => {
    translationBuffer.addValues([x, -0.3, z]);
    colorBuffer.addValues([.8, .8, .8,]);
    scaleBuffer.addValues([0.2, 0.02, 0.37]);
    typeMaskBuffer.addValues([0, 0, 0, 0]);
    powerupMaskBuffer.addValues([0, 0, 0, 0]);
    levelMaskBuffer.addValues([0, 0, 0, 0]);
    opponentMaskBuffer.addValues([0, 0, 0, 0]);
  }

  boxRenderer.addPlayerBox = (x, y, z, xs, ys, zs, opponentIdx = -1) => {
    translationBuffer.addValues([x, y, z]);
    colorBuffer.addValues([Math.max(0.4, xs * 9), Math.max(0.4, xs * 10), Math.max(0.4, xs * 12)]);
    scaleBuffer.addValues([xs, ys, zs]);
    typeMaskBuffer.addValues([0, 0, opponentIdx === -1 ? 1 : 0, opponentIdx === -1 ? 0 : 1]);
    powerupMaskBuffer.addValues([0, 0, 0, 0]);
    levelMaskBuffer.addValues([0, 0, 0, 0]);

    opponentMaskBuffer.addValues([
      opponentIdx === 0 ? 1 : 0,
      opponentIdx === 1 ? 1 : 0,
      opponentIdx === 2 ? 1 : 0,
      opponentIdx === 3 ? 1 : 0,
    ]);
  }

  boxRenderer.addBackgroundBox = () => {
    const distance = 1.6;
    const position = randomFloatBetween(0, Math.PI * 2);

    translationBuffer.addValues([
      distance * Math.cos(position),
      distance * Math.sin(position),
      randomFloatBetween(-(boxDepth / 5), (boxDepth / 5) * 4),
    ]);

    const color = randomFloatBetween(0.9, 1.);
    colorBuffer.addValues([color, color, color]);

    const aScale = 0.4 + (Math.random() * 0.2);
    const zScale = 0.6 + (Math.random() * 0.4);
    scaleBuffer.addValues([aScale, aScale, zScale,]);
    typeMaskBuffer.addValues([1, 0, 0, 0]);
    powerupMaskBuffer.addValues([0, 0, 0, 0]);

    const randMask = Math.random();
    levelMaskBuffer.addValues([
      (randMask > 0 && randMask < 0.1) * 1,
      (randMask > 0.1 && randMask < 0.2) * 1,
      (randMask > 0.2 && randMask < 0.3) * 1,
      (randMask > 0.3 && randMask < 0.4) * 1,
    ]);

    opponentMaskBuffer.addValues([0, 0, 0, 0]);
  }

  // Render pass to be called every frame
  let uTick = randomFloatBetween(1304, 2314);
  boxRenderer.renderPass = (uDelta) => {
    uTick += (uDelta * game.player.speed * 1.6 * boxRenderer.timeMod);

    // Activate program and VAO
    gl.useProgram(boxProgram);
    gl.bindVertexArray(vao);

    // Calculate view projection matrix
    const viewProjectionMatrix = multiplyMatrices(
      perspectiveMatrix(
        Math.PI / 3 + (game.player.speed * 0.4),
        gl.canvas.width / gl.canvas.height,
        0.1,
        1000
      ),
      lookAtMatrix(
        [game.player.laneOffset * 1.2, 0, 0],
        [(1 - boxRenderer.timeMod) * 10, (1 - boxRenderer.timeMod) * 10, 10],
        [0, 1, 0]
      ),
    );

    // Update uniforms
    gl.uniformMatrix4fv(uViewProjectionMatrix, false, viewProjectionMatrix);
    gl.uniform1f(uTs, uTick);
    gl.uniform1f(uSpeed, game.player.speed);
    gl.uniform2f(uOffset, game.track.offset.x, game.track.offset.y);
    gl.uniform4f(
      uPowerupDistances,
      game.powerups.distances[0],
      game.powerups.distances[1],
      game.powerups.distances[2],
      0, // ?
    );

    gl.uniform4f(
      uPowerupValues,
      game.powerups.values[0],
      game.powerups.values[1],
      game.powerups.values[2],
      0, // ?
    );

    gl.uniform3f(
      uPlayer,
      game.player.position.x + game.player.sway.x,
      game.player.position.y + game.player.sway.y,
      game.player.position.z + game.player.sway.z
    );

    gl.uniform3f(uLogo, .2, -.1, .1);
    gl.uniform4f(
      uLevels,
      game.music.levels.snare,
      game.music.levels.kick,
      game.music.levels.bass,
      game.music.levels.synth
    );

    gl.uniform4f(
      uOpponentDistances,
      game.opponents.distances[0],
      game.opponents.distances[1],
      game.opponents.distances[2],
      game.opponents.distances[3],
    );

    // Draw
    vertexBuffer.activate();
    gl.drawElementsInstanced(
      gl.TRIANGLES,
      cube.indices.length,
      gl.UNSIGNED_SHORT,
      0,
      colorBuffer.getValues().length / 3
    );

    // Unbind VAO to avoid leakage
    gl.bindVertexArray(null);
  };

  return boxRenderer;
}
