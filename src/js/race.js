export function createRace(game) {
  const raceDuration = 90;
  const race = {
    timeLeft: raceDuration,
    started: false,
    finished: false,
    placement: 5,
  };

  race.start = () => {
    game.opponents.reset();
    game.powerups.reset();
    game.player.level = 5;

    race.timeLeft = raceDuration;
    race.started = true;
    race.finished = false;
  }

  race.update = (delta) => {
    if (!race.started || race.finished) {
      if (game.boxRenderer.timeMod > 0) {
        game.boxRenderer.timeMod = Math.max(0, game.boxRenderer.timeMod - (delta * 0.0005));
        game.player.level *= 0.9;
      }
      return;
    }

    if (game.boxRenderer.timeMod < 1) {
      game.boxRenderer.timeMod = Math.min(1, game.boxRenderer.timeMod + (delta * 0.0005));
    }

    race.timeLeft -= (delta / 1000);
    if (race.timeLeft < 0) {
      race.timeLeft = 0;
      race.finished = true;
      race.started = false;
    }

    race.placement = 5;
    for (var distance of game.opponents.distances) {
      if (distance < 0) {
        race.placement -= 1;
      }
    }
  };

  return race;
}
