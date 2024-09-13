function createTrack(game) {
  const track = {
    offset: { x: 0, y: 0 },
  };

  const duration = 10000;
  var tick = 5000;
  var previousOffset = { x: 0, y: 0 };
  var targetOffset = { x: 0, y: 0 };

  track.update = uDelta => {
    const progress = tick / duration;
    if (progress >= 1) {
      const extra = game.player.speed * 0.1;
      previousOffset = { ...track.offset };
      targetOffset = {
        x: randomFloatBetween(-0.1 - extra, 0.1 + extra),
        y: randomFloatBetween(extra, 0.2 + extra),
      };
      tick = 0;
    } else if (progress < 1) {
      track.offset.x = easePolate(previousOffset.x, targetOffset.x, progress);
      track.offset.y = easePolate(previousOffset.y, targetOffset.y, progress);
    }

    tick += (uDelta * game.player.speed);
  };

  return track;
}