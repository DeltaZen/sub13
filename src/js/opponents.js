export function createOpponents(game) {
  const startDistances = [
    1.,
    3.,
    5.,
    7.,
  ];

  const startSpeeds = [
    0.67,
    0.75,
    0.82,
    0.88,
  ];

  const opponents = {
    distances: [...startDistances],
    speeds: [...startSpeeds],
  };

  opponents.reset = () => {
    opponents.distances = [...startDistances];
    opponents.speeds = [...startSpeeds];
  };

  opponents.update = uDelta => {
    opponents.playerPosition = 5;
    for (var i = 0; i < 4; i++) {
      opponents.distances[i] += ((
        (opponents.speeds[i] * (uDelta / 100))
        - (game.player.speed * (uDelta / 100))
      ) * game.boxRenderer.timeMod);

      if (opponents.distances[i] < 0.2) {
        opponents.playerPosition -= 1;
      }
    }
  };

  return opponents;
}
