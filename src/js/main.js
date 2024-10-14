import {createGl} from "./gl.js";
import {createMusic} from "./music.js";
import {createColors} from "./colors.js";
import {createPlayer} from "./player.js";
import {createTrack} from "./track.js";
import {createBoxRenderer} from "./box-renderer.js";
import {createPostProcess} from "./post-process.js";
import {createPowerups} from "./powerups.js";
import {createControls} from "./controls.js";
import {createOpponents} from "./opponents.js";
import {createUi} from "./ui.js";
import {createRace} from "./race.js";

function main() {
  const game = {
    canvas: document.getElementById('glcanvas'),
    playerSpeed: 0,
    levels: {
      bass: 0,
      synth: 0,
      snare: 0,
      kick: 0,
    },
  };

  game.gl = createGl(game);
  game.music = createMusic(game);
  game.colors = createColors(game);
  game.player = createPlayer(game);
  game.track = createTrack(game);
  game.boxRenderer = createBoxRenderer(game);
  game.postProcess = createPostProcess(game);
  game.powerups = createPowerups(game);
  game.controls = createControls(game);
  game.opponents = createOpponents(game);
  game.ui = createUi(game);
  game.race = createRace(game);

  for (var i = 0; i < 200; i++) {
    game.boxRenderer.addBackgroundBox();
  }

  for (var x of [-0.3, 0, 0.3]) {
    for (var z = -4; z < 20; z += 0.27) {
      game.boxRenderer.addTrackBox(x, z);
    }
  }

  const addPlayerBoxes = (opponentIdx = -1) => {
    game.boxRenderer.addPlayerBox(
      0, -0.2, 0.55,
      0.12, 0.02, 0.03,
      opponentIdx
    );
    game.boxRenderer.addPlayerBox(
      0, -0.2, 0.6,
      0.01, 0.1, 0.2,
      opponentIdx
    );
    game.boxRenderer.addPlayerBox(
      0, -0.2, 0.52,
      0.04, 0.03, 0.08,
      opponentIdx
    );

    game.boxRenderer.addPlayerBox(
      -0.04, -0.2, .6,
      0.04, 0.01, 0.23,
      opponentIdx
    );
    game.boxRenderer.addPlayerBox(
      0.04, -0.2, .6,
      0.04, 0.01, 0.23,
      opponentIdx
    );
  }

  addPlayerBoxes();
  for (var i = 0; i < 4; i++) {
    addPlayerBoxes(i);
  }

  for (let lane of [-1, 0, 1]) {
    for (let level of [1, 2, 3, 4, 5]) {
      game.boxRenderer.addPowerupBox(lane, level);
    }
  }

  game.gl.addRenderPass(game.boxRenderer.renderPass);
  game.gl.addPostProcessPass(game.postProcess.glow);
  game.gl.addPostProcessPass(game.postProcess.bg);
  game.gl.addPostProcessPass(game.postProcess.grade);

  var lastU = performance.now();
  function loop() {
    const uDelta = Math.min(performance.now() - lastU, 20);
    lastU = performance.now();

    game.player.update(uDelta);
    game.gl.render(uDelta);

    game.opponents.update(uDelta);
    game.colors.update(uDelta);
    game.track.update(uDelta);
    game.ui.update(uDelta);
    game.powerups.update(uDelta);
    game.music.pumpNotes(uDelta);
    game.race.update(uDelta);

    requestAnimationFrame(loop);
  }

  loop();

  document.getElementById('glcanvas').addEventListener('click', game.music.connectContext);
}


document.getElementById('body').classList.remove("hidden");
main();
