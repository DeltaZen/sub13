export function createColors(game) {
  const bodyEl = document.getElementById('body');

  var target;

  const themes = [
    {
      bg: [0.7, 0.7, 0.9],
      track: [1, 1, 1],
      cubes: [0.3, 0.2, 0.4],
      player: [0.8, 0.8, 0.8],
    },
    {
      bg: [0.7, 0.6, 0.4],
      track: [1, 0.8, 0.4],
      cubes: [0.8, 0.5, 0.5],
      player: [0.9, 0.9, 0.7],
    },
    {
      bg: [0.2, 0.1, 0.4],
      track: [0.4, 0.9, 0.1],
      cubes: [0.5, 0.9, 0.5],
      player: [0.2, 0.8, 0.2],
    },
    {
      bg: [0.1, 0.1, 0.1],
      track: [0.8, 0.9, 1],
      cubes: [0.8, 0.8, 0.9],
      player: [1, 1, 1],
    },
  ];

  const current = {
    bg: [...themes[0].bg],
    track: [...themes[0].track],
    cubes: [...themes[0].cubes],
    player: [...themes[0].player],
  };

  function approachColor(color1, color2, uDelta) {
    color1[0] += (color2[0] - color1[0]) * uDelta * 0.001;
    color1[1] += (color2[1] - color1[1]) * uDelta * 0.001;
    color1[2] += (color2[2] - color1[2]) * uDelta * 0.001;
  }

  function update(uDelta) {
    const newTarget = themes[Math.abs(Math.floor(game.player.speed / 0.3))];
    if (newTarget !== target) {
      bodyEl.style.backgroundColor = `rgb(${newTarget.bg.map((c) => Math.floor(c * 255)).join(',')})`;
      target = newTarget;
    }

    approachColor(current.bg, target.bg, uDelta);
    approachColor(current.track, target.track, uDelta);
    approachColor(current.cubes, target.cubes, uDelta);
    approachColor(current.player, target.player, uDelta);
  }

  return {
    update,
    current,
    keys: Object.keys(current),
  };
}
