import {randomFloatBetween, randomIntBetween} from "./utils.js";

export function createPowerups(game) {
  const powerups = {
    distances: [
      randomFloatBetween(5, 30),
      randomFloatBetween(5, 30),
      randomFloatBetween(5, 30),
    ],
    values: [
      randomIntBetween(1, 6),
      randomIntBetween(1, 6),
      randomIntBetween(1, 6),
    ],
  };

  powerups.reset = () => {
    powerups.distances = [
      randomFloatBetween(5, 30),
      randomFloatBetween(5, 30),
      randomFloatBetween(5, 30),
    ];
    powerups.values = [
      randomIntBetween(1, 6),
      randomIntBetween(1, 6),
      randomIntBetween(1, 6),
    ];
  }

  powerups.update = uDelta => {
    for (var i = 0; i < 3; i++) {
      var wasBeforeLimit = powerups.distances[i] > 0.6;
      powerups.distances[i] -= (uDelta * game.player.speed * 0.012) * game.boxRenderer.timeMod;
      var nowAfterLimit = powerups.distances[i] <= 0.6;

      if (wasBeforeLimit && nowAfterLimit && (game.player.lane === (i - 1))) {
        game.player.onPowerup(powerups.values[i]);
      }

      if (powerups.distances[i] < 0) {
        powerups.distances[i] = randomFloatBetween(10, 30);
        powerups.values[i] = randomIntBetween(1, 6);
      }
    }
  };

  return powerups;
}
