function createPlayer(game) {
  const player = {
    lane: 0,
    level: 2,
    laneOffset: 0,
    speed: 0.2,
    position: { x: 0, y: 0, z: 0 },
    sway: { x: 0, y: 0, z: 0 },
  };
  var decayTick = 0;
  var swayTick = 0;
  player.update = uDelta => {
    swayTick += (uDelta * 0.02) * player.speed;
    player.laneOffset += ((player.lane * 0.3) - player.laneOffset) * (uDelta / 50);
    player.position.x += ((player.laneOffset - (player.position.x)) * (uDelta / 100))

    player.sway.x = Math.cos(swayTick * 0.1) * 0.01;
    player.sway.y = -Math.sin(swayTick * 0.05) * 0.02;

    const speedTarget = (player.level / 12)
    player.speed += (speedTarget - player.speed) * 0.1 * (uDelta / 50);

    decayTick += uDelta * game.boxRenderer.timeMod;
    if (decayTick > 2000) {
      decayTick = 0;
      player.level = Math.max(2, player.level - 1);
    }
  };

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playFlamSound(playerLevel, value) {
    const flamInterval = 0.04;
    const volumeReduction = 0.1;

    const levelFrequencies = [
      261.63,
      293.66,
      329.63,
      349.23,
      392.00,
      440.00,
      493.88,
      554.37,
      659.26,
      739.99,
      830.61,
      987.77
    ];

    const totalLevel = playerLevel + value;
    const isLosingPoints = totalLevel > 12;

    const notePattern = isLosingPoints ? levelFrequencies : levelFrequencies;

    if (!isLosingPoints) {
      for (let i = playerLevel; i < totalLevel; i++) {
        const levelIndex = i % notePattern.length;
        const baseFrequency = notePattern[levelIndex];

        const oscillator1 = audioCtx.createOscillator();
        const oscillator2 = audioCtx.createOscillator();

        oscillator1.type = 'triangle';
        oscillator2.type = 'triangle';

        oscillator1.frequency.setValueAtTime(baseFrequency, audioCtx.currentTime + ((i - playerLevel) * flamInterval));
        oscillator2.frequency.setValueAtTime(baseFrequency * 0.99, audioCtx.currentTime + ((i - playerLevel) * flamInterval));

        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime((1 - ((i - playerLevel) * 0.15)) * volumeReduction, audioCtx.currentTime + ((i - playerLevel) * flamInterval));
        gainNode.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + ((i - playerLevel) * flamInterval) + 0.2);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1500, audioCtx.currentTime);

        const convolver = audioCtx.createConvolver();
        convolver.buffer = createReverbBuffer();

        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(filter);
        filter.connect(convolver);
        convolver.connect(audioCtx.destination);

        oscillator1.start(audioCtx.currentTime + ((i - playerLevel) * flamInterval));
        oscillator2.start(audioCtx.currentTime + ((i - playerLevel) * flamInterval));

        oscillator1.stop(audioCtx.currentTime + ((i - playerLevel) * flamInterval) + 0.2);
        oscillator2.stop(audioCtx.currentTime + ((i - playerLevel) * flamInterval) + 0.2);
      }
    } else {
      for (let i = 0; i < value; i++) {
        const levelIndex = Math.max(11 - i, 0);
        const baseFrequency = notePattern[levelIndex];

        const oscillator1 = audioCtx.createOscillator();
        const oscillator2 = audioCtx.createOscillator();
        oscillator1.type = 'triangle';
        oscillator2.type = 'triangle';
        oscillator1.frequency.setValueAtTime(baseFrequency, audioCtx.currentTime + (i * flamInterval));
        oscillator2.frequency.setValueAtTime(baseFrequency * 0.99, audioCtx.currentTime + (i * flamInterval));

        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime((1 - (i * 0.15)) * volumeReduction, audioCtx.currentTime + (i * flamInterval));
        gainNode.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + (i * flamInterval) + 0.2);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1500, audioCtx.currentTime);

        const convolver = audioCtx.createConvolver();
        convolver.buffer = createReverbBuffer();

        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(filter);
        filter.connect(convolver);
        convolver.connect(audioCtx.destination);

        oscillator1.start(audioCtx.currentTime + (i * flamInterval));
        oscillator2.start(audioCtx.currentTime + (i * flamInterval));
        oscillator1.stop(audioCtx.currentTime + (i * flamInterval) + 0.2);
        oscillator2.stop(audioCtx.currentTime + (i * flamInterval) + 0.2);
      }
    }

    function createReverbBuffer() {
      const length = audioCtx.sampleRate * 0.5;
      const impulse = audioCtx.createBuffer(2, length, audioCtx.sampleRate);
      for (let i = 0; i < impulse.numberOfChannels; i++) {
        const channelData = impulse.getChannelData(i);
        for (let j = 0; j < length; j++) {
          channelData[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, 3);
        }
      }
      return impulse;
    }
  }


  player.onPowerup = (value) => {
    const newLevel = player.level + value;
    playFlamSound(player.level, value);
    if (newLevel > 12) {
      player.level = player.level - value;
    } else {
      player.level = newLevel;
    }

    decayTick = 0;

  };

  return player;
}