function createUi(game) {
  const introElement = document.querySelector('#intro');
  const uiElement = document.querySelector('#ui');
  const speedElement = document.querySelector('#speed');
  const posElement = document.querySelector('#place .h');
  const secElement = document.querySelector('#time .h');
  const outroElement = document.querySelector('#outro');
  const placementElement = document.querySelector('#op');
  const outroTextElement = document.querySelector('#ot');
  const minimapElement = document.querySelector('#minimap');
  const createElement = (parent, id, ...clss) => {
    const element = document.createElement('div');
    element.id = id;
    parent.appendChild(element);
    for (var cls of clss) {
      element.classList.add(cls);
    }
    return element;
  };

  const removeAndAddCls = (el, remove, add) => {
    el.classList.remove(remove);
    el.classList.add(add);
  };

  const speedLevels = Array.from(
    { length: 13, },
    (_, i) => createElement(speedElement, `l${i}`, 'l'),
  );

  speedLevels[12].textContent = '13';

  const playerMarkers = Array.from(
    { length: 4, },
    (_, i) => createElement(minimapElement, `p${i}`, 'p'),
  );

  var lastLevel = 0;
  const update = delta => {
    if (game.player.level !== lastLevel) {
      lastLevel = game.player.level;
      for (let i = 0; i < 13; i++) {
        const inRange = (i < game.player.level);
        removeAndAddCls(speedLevels[i], inRange ? 'o' : 'x', inRange ? 'x' : 'o');
      }
    }

    if (!game.race.started && game.race.finished) {
      outroElement.style.opacity = 1;
      const txts = [];
      switch (game.race.placement) {
        case 1:
          txts.push('1st')
          txts.push('You did it! Absolute legend! But can you do it again?');
          break;
        case 2:
          txts.push('2nd')
          txts.push('Awesome, almost there! Next time, surely.');
          break;
        case 3:
          txts.push('3rd')
          txts.push('Nice work! It\'s a placement. By a hair.');
          break;
        case 4:
        case 5:
        case 6:
          txts.push(game.race.placement + 'th')
          txts.push('Could be worse, but not by a lot. Go again!');
          break;
      }
      placementElement.textContent = txts[0];
      outroTextElement.textContent = txts[1];
    } else {
      outroElement.style.opacity = 0;
    }

    playerMarkers.forEach((el, i) => {
      el.style.top = (Math.max(-18, Math.min(18, (game.opponents.distances[i] * -0.2))) - 1) + 'vh';
    });

    posElement.textContent = game.race.placement;
    secElement.textContent = Math.floor(game.race.timeLeft);

    uiElement.style.opacity = game.boxRenderer.timeMod >= 1 ? 1 : 0;
    introElement.style.opacity = (!game.race.started && !game.race.finished) ? 1 : 0;
  };

  return {
    update,
  };
}