export function createControls(game) {
  var interacted = false;

  const controls = {
    left: false,
    right: false,
  };

  function handleKeyEvent(event, down) {
    if (!interacted) {
      interacted = true;
      game.music.connectContext();
    }

    if (event.key === ' ' && game.boxRenderer.timeMod < 0.01 && !game.race.started) {
      game.race.start();
    }

    if (game.boxRenderer.timeMod < 0.9) {
      return;
    }

    switch (event.key.toLowerCase()) {
      case 'a':
      case 'h':
      case 'arrowleft':
        if (!controls.left && down) {
          game.player.lane = 1;
        } else if (!controls.right && !down) {
          game.player.lane = 0;
        }
        controls.left = down;
        break;
      case 'arrowright':
      case 'l':
      case 'd':
        if (!controls.right && down) {
          game.player.lane = -1;
        } else if (!controls.left && !down) {
          game.player.lane = 0;
        }
        break;
    }
  }

  function handleTouchEvent(event, down) {
    const left = event.changedTouches.item(0).clientX < (window.innerWidth / 2);
    const lower = event.changedTouches.item(0).clientY > (window.innerHeight / 2);
    handleKeyEvent({ key: left ? 'arrowleft' : 'arrowright' }, down);

    if (lower) {
      handleKeyEvent({ key: ' ' }, down);
    }

    event.preventDefault();
  }

  document.addEventListener('keydown', function (event) {
    handleKeyEvent(event, true);
  });

  document.addEventListener('keyup', function (event) {
    handleKeyEvent(event, false);
  });

  document.addEventListener('touchstart', function (e) {
    handleTouchEvent(e, true);
  });

  document.addEventListener('touchend', function (e) {
    handleTouchEvent(e, false);
  });

  document.addEventListener('touchcancel', function (e) {
    handleTouchEvent(e, false);
  });

  return controls;
}
