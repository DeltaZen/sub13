function createMusic(game) {
  const levels = {
    bass: 0,
    synth: 0,
    snare: 0,
    kick: 0,
  };
  function isFirefox() {
    return typeof InstallTrigger !== 'undefined';
  }

  let hasPlayedIntro = false;
  let chunkCounter = 0;
  let chunkCounterDrums = 0;
  let bpm = 120;
  let quarterNoteTime = 60 / bpm;
  let eighthNoteTime = quarterNoteTime / 2;
  let sixteenthTime = quarterNoteTime / 4;
  let sixteenthTripletTime = quarterNoteTime / 6;
  let eighthTripletTime = quarterNoteTime / 3;
  let halfNoteTime = quarterNoteTime * 2;
  let wholeNoteTime = quarterNoteTime * 4;
  let twoBarNoteTime = wholeNoteTime * 2;
  let lead1Gain = 0.14;
  let marimbaGain = 0.07;
  const noteFrequencies = {
    "C0": 16.35, "C#0": 17.32, "D0": 18.35, "D#0": 19.45, "E0": 20.60, "F0": 21.83, "F#0": 23.12, "G0": 24.50, "G#0": 25.96, "A0": 27.50, "A#0": 29.14, "B0": 30.87,
    "C1": 32.70, "C#1": 34.65, "D1": 36.71, "D#1": 38.89, "E1": 41.20, "F1": 43.65, "F#1": 46.25, "G1": 49.00, "G#1": 51.91, "A1": 55.00, "A#1": 58.27, "B1": 61.74,
    "C2": 65.41, "C#2": 69.30, "D2": 73.42, "D#2": 77.78, "E2": 82.41, "F2": 87.31, "F#2": 92.50, "G2": 98.00, "G#2": 103.83, "A2": 110.00, "A#2": 116.54, "B2": 123.47,
    "C3": 130.81, "C#3": 138.59, "D3": 146.83, "D#3": 155.56, "E3": 164.81, "F3": 174.61, "F#3": 185.00, "G3": 196.00, "G#3": 207.65, "A3": 220.00, "A#3": 233.08, "B3": 246.94,
    "C4": 261.63, "C#4": 277.18, "D4": 293.66, "D#4": 311.13, "E4": 329.63, "F4": 349.23, "F#4": 369.99, "G4": 392.00, "G#4": 415.30, "A4": 440.00, "A#4": 466.16, "B4": 493.88,
    "C5": 523.25, "C#5": 554.37, "D5": 587.33, "D#5": 622.25, "E5": 659.26, "F5": 698.46, "F#5": 739.99, "G5": 783.99, "G#5": 830.61, "A5": 880.00, "A#5": 932.33, "B5": 987.77,
    "C6": 1046.50, "C#6": 1108.73, "D6": 1174.66, "D#6": 1244.51, "E6": 1318.51, "F6": 1396.91, "F#6": 1479.98, "G6": 1567.98, "G#6": 1661.22, "A6": 1760.00, "A#6": 1864.66, "B6": 1975.53,
    "C7": 2093.00, "C#7": 2217.46, "D7": 2349.32, "D#7": 2489.02, "E7": 2637.02, "F7": 2793.83, "F#7": 2959.96, "G7": 3135.96, "G#7": 3322.44, "A7": 3520.00, "A#7": 3729.31, "B7": 3951.07,
    "C8": 4186.01, "C#8": 4434.92, "D8": 4698.63, "D#8": 4978.03, "E8": 5274.04, "F8": 5587.65, "F#8": 5919.91, "G8": 6271.93, "G#8": 6644.88, "A8": 7040.00, "A#8": 7458.62, "B8": 7902.13
  };

  const lead2Pattern = [

    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],

    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],

    [["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["B4", sixteenthTime],
    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],
    [0, quarterNoteTime],
    ["E4", sixteenthTime],
    ["B4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#5", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["B4", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],
    [0, quarterNoteTime]],

    [["E4", sixteenthTime],
    ["B4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#5", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],

    [0, quarterNoteTime],
    ["E4", sixteenthTime],
    ["B4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#5", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["B4", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],
    [0, quarterNoteTime]],

    [["E4", sixteenthTime],
    ["B4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#5", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],
    [0, quarterNoteTime],
    ["E4", sixteenthTime],
    ["B4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#5", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],
    [0, quarterNoteTime],
    ["E4", sixteenthTime],
    ["B4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#5", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime]],

    [["E4", sixteenthTime],
    ["B4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#5", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],
    [0, quarterNoteTime],
    ["E4", sixteenthTime],
    ["B4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#5", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["B4", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],
    [0, quarterNoteTime]],
  ];

  const lead2PatternFireFox = [

    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],

    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],

    [[0, sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],
    [0, sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],
    [0, quarterNoteTime],
    ["E4", sixteenthTime],
    ["B4", sixteenthTime],
    ["A4", sixteenthTime],
    [0, sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    [0, sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["B4", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],
    [0, quarterNoteTime]],

    [[0, sixteenthTime],
    ["B4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#5", sixteenthTime],

    [0, sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],

    [0, quarterNoteTime],
    ["E4", sixteenthTime],
    ["B4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#5", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],

    ["E4", sixteenthTime],
    [0, sixteenthTime],
    ["F#4", sixteenthTime],
    ["B4", sixteenthTime],

    ["E4", sixteenthTime],
    [0, sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],
    [0, quarterNoteTime]],

    [[0, sixteenthTime],
    ["B4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#5", sixteenthTime],

    ["E4", sixteenthTime],
    [0, sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],
    [0, quarterNoteTime],
    ["E4", sixteenthTime],
    ["B4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#5", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],
    [0, quarterNoteTime],
    ["E4", sixteenthTime],
    ["B4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#5", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime]],

    [[0, sixteenthTime],
    ["B4", sixteenthTime],
    [0, sixteenthTime],
    ["F#5", sixteenthTime],

    ["E4", sixteenthTime],
    [0, sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],
    [0, quarterNoteTime],
    ["E4", sixteenthTime],
    ["B4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#5", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["B4", sixteenthTime],

    ["E4", sixteenthTime],
    ["A4", sixteenthTime],
    ["F#4", sixteenthTime],
    ["C#5", sixteenthTime],
    [0, quarterNoteTime]],
  ];

  const selectedLead2Pattern = isFirefox() ? lead2PatternFireFox : lead2Pattern;


  const lead1Pattern = [

    [["B3", quarterNoteTime],
    ["E4", quarterNoteTime],
    ["G4", quarterNoteTime],
    ["F#4", quarterNoteTime],
    [0, eighthNoteTime],
    ["D4", eighthNoteTime],
    ["B3", quarterNoteTime],
    ["E4", halfNoteTime]],

    [["B3", quarterNoteTime],
    ["E4", quarterNoteTime],
    ["G4", quarterNoteTime],
    ["F#4", quarterNoteTime],

    [0, eighthNoteTime],
    ["D4", eighthNoteTime],
    ["B3", quarterNoteTime],
    ["E4", halfNoteTime]],

    [["D4", quarterNoteTime],
    ["G4", quarterNoteTime],
    ["A#4", quarterNoteTime],
    ["A4", quarterNoteTime],
    ["G4", quarterNoteTime],
    ["A#4", quarterNoteTime],
    ["C5", quarterNoteTime],
    ["F5", quarterNoteTime]],

    [["D4", quarterNoteTime],
    ["G4", quarterNoteTime],
    ["A#4", quarterNoteTime],
    ["A4", quarterNoteTime],
    ["G4", quarterNoteTime],
    ["A#4", quarterNoteTime],
    ["C5", quarterNoteTime],
    ["D5", quarterNoteTime]],

    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],

  ];

  const arpThemeA1 = [
    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],

    [["D3", eighthTripletTime],
    ["G3", eighthTripletTime],
    ["A3", eighthTripletTime],

    ["A#3", eighthTripletTime],
    ["D4", eighthTripletTime],
    ["G4", eighthTripletTime],

    ["A4", eighthTripletTime],
    ["A#4", eighthTripletTime],
    ["D5", eighthTripletTime],

    ["G5", eighthTripletTime],
    ["A5", eighthTripletTime],
    ["A#5", eighthTripletTime],

    ["G3", eighthTripletTime],
    ["A#3", eighthTripletTime],
    ["C4", eighthTripletTime],

    ["F4", eighthTripletTime],
    ["G4", eighthTripletTime],
    ["A#4", eighthTripletTime],

    ["C5", eighthTripletTime],
    ["F5", eighthTripletTime],
    ["G5", eighthTripletTime],

    ["A#5", eighthTripletTime],
    ["C6", eighthTripletTime],
    ["F6", eighthTripletTime]],

    [["G3", eighthTripletTime],
    ["A3", eighthTripletTime],
    ["A#3", eighthTripletTime],

    ["D4", eighthTripletTime],
    ["G4", eighthTripletTime],
    ["A4", eighthTripletTime],

    ["A#4", eighthTripletTime],
    ["D5", eighthTripletTime],
    ["G5", eighthTripletTime],

    ["A5", eighthTripletTime],
    ["A#5", eighthTripletTime],
    ["D6", eighthTripletTime],

    ["A#3", eighthTripletTime],
    ["C4", eighthTripletTime],
    ["D4", eighthTripletTime],

    ["G4", eighthTripletTime],
    ["A#4", eighthTripletTime],
    ["C5", eighthTripletTime],

    ["D5", eighthTripletTime],
    ["G5", eighthTripletTime],
    ["A#5", eighthTripletTime],

    ["C6", eighthTripletTime],
    ["D6", eighthTripletTime],
    ["G6", eighthTripletTime]],

    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],
  ];
  const arpThemeA2 = [
    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],

    [["D3", sixteenthTripletTime],
    ["G3", sixteenthTripletTime],
    ["A3", sixteenthTripletTime],

    ["A#3", sixteenthTripletTime],
    ["D4", sixteenthTripletTime],
    ["G4", sixteenthTripletTime],

    ["A4", sixteenthTripletTime],
    ["A#4", sixteenthTripletTime],
    ["D5", sixteenthTripletTime],

    ["G5", sixteenthTripletTime],
    ["A5", sixteenthTripletTime],
    ["A#5", sixteenthTripletTime],

    ["A#5", sixteenthTripletTime],
    ["A5", sixteenthTripletTime],
    ["G5", sixteenthTripletTime],

    ["D5", sixteenthTripletTime],
    ["A#4", sixteenthTripletTime],
    ["A4", sixteenthTripletTime],

    ["G4", sixteenthTripletTime],
    ["D4", sixteenthTripletTime],
    ["A#3", sixteenthTripletTime],

    ["A3", sixteenthTripletTime],
    ["G3", sixteenthTripletTime],
    ["D3", sixteenthTripletTime],


    ["G3", sixteenthTripletTime],
    ["A#3", sixteenthTripletTime],
    ["C4", sixteenthTripletTime],

    ["F4", sixteenthTripletTime],
    ["G4", sixteenthTripletTime],
    ["A#4", sixteenthTripletTime],

    ["C5", sixteenthTripletTime],
    ["F5", sixteenthTripletTime],
    ["G5", sixteenthTripletTime],

    ["A#5", sixteenthTripletTime],
    ["C6", sixteenthTripletTime],
    ["F6", sixteenthTripletTime],

    ["F6", sixteenthTripletTime],
    ["C6", sixteenthTripletTime],
    ["A#5", sixteenthTripletTime],

    ["G5", sixteenthTripletTime],
    ["F5", sixteenthTripletTime],
    ["C5", sixteenthTripletTime],

    ["A#4", sixteenthTripletTime],
    ["G4", sixteenthTripletTime],
    ["F4", sixteenthTripletTime],

    ["C4", sixteenthTripletTime],
    ["A#3", sixteenthTripletTime],
    ["G3", sixteenthTripletTime],],

    [["G3", sixteenthTripletTime],
    ["A3", sixteenthTripletTime],
    ["A#3", sixteenthTripletTime],

    ["D4", sixteenthTripletTime],
    ["G4", sixteenthTripletTime],
    ["A4", sixteenthTripletTime],

    ["A#4", sixteenthTripletTime],
    ["D5", sixteenthTripletTime],
    ["G5", sixteenthTripletTime],

    ["A5", sixteenthTripletTime],
    ["A#5", sixteenthTripletTime],
    ["D6", sixteenthTripletTime],

    ["D6", sixteenthTripletTime],
    ["A#5", sixteenthTripletTime],
    ["A5", sixteenthTripletTime],

    ["G5", sixteenthTripletTime],
    ["D5", sixteenthTripletTime],
    ["A#4", sixteenthTripletTime],

    ["A4", sixteenthTripletTime],
    ["G4", sixteenthTripletTime],
    ["D4", sixteenthTripletTime],

    ["A#3", sixteenthTripletTime],
    ["A3", sixteenthTripletTime],
    ["G3", sixteenthTripletTime],


    ["A#3", sixteenthTripletTime],
    ["C4", sixteenthTripletTime],
    ["D4", sixteenthTripletTime],

    ["G4", sixteenthTripletTime],
    ["A#4", sixteenthTripletTime],
    ["C5", sixteenthTripletTime],

    ["D5", sixteenthTripletTime],
    ["G5", sixteenthTripletTime],
    ["A#5", sixteenthTripletTime],

    ["C6", sixteenthTripletTime],
    ["D6", sixteenthTripletTime],
    ["G6", sixteenthTripletTime],
    ["G6", sixteenthTripletTime],
    ["D6", sixteenthTripletTime],
    ["C6", sixteenthTripletTime],

    ["A#5", sixteenthTripletTime],
    ["G5", sixteenthTripletTime],
    ["D5", sixteenthTripletTime],

    ["C5", sixteenthTripletTime],
    ["A#4", sixteenthTripletTime],
    ["G4", sixteenthTripletTime],

    ["D4", sixteenthTripletTime],
    ["C4", sixteenthTripletTime],
    ["A#3", sixteenthTripletTime],],

    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],
  ];

  const marimbaPattern = [
    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],

    [["G4", eighthNoteTime],
    ["A#4", eighthNoteTime],
    ["A4", eighthNoteTime],
    ["G4", eighthNoteTime],
    ["G4", eighthNoteTime],
    ["A#4", eighthNoteTime],
    ["A4", eighthNoteTime],
    ["G4", eighthNoteTime],

    ["G4", eighthNoteTime],
    ["A#4", eighthNoteTime],
    ["A4", eighthNoteTime],
    ["G4", eighthNoteTime],
    ["G4", eighthNoteTime],
    ["A#4", eighthNoteTime],
    ["A4", eighthNoteTime],
    ["G4", eighthNoteTime]],

    [["G4", eighthNoteTime],
    ["A#4", eighthNoteTime],
    ["A4", eighthNoteTime],
    ["G4", eighthNoteTime],
    ["G4", eighthNoteTime],
    ["A#4", eighthNoteTime],
    ["A4", eighthNoteTime],
    ["G4", eighthNoteTime],

    ["D4", eighthNoteTime],
    ["A4", eighthNoteTime],
    ["F#4", eighthNoteTime],
    ["D4", eighthNoteTime],
    ["D4", eighthNoteTime],
    ["A4", eighthNoteTime],
    ["F#4", eighthNoteTime],
    ["D4", eighthNoteTime]],

    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],

  ];


  const chordPattern = [
    [[["B2", "E3"], wholeNoteTime],
    [["C3", "F#3"], wholeNoteTime]],
    [[["D3", "G3"], wholeNoteTime],
    [["E3", "A3"], wholeNoteTime]],

    [[["G3", "D4"], wholeNoteTime],
    [["A3", "D#4"], wholeNoteTime]],
    [[["A#3", "F4"], wholeNoteTime],
    [["C4", "G4"], wholeNoteTime]],

    [[["F#4", "A4"], wholeNoteTime],
    [["B3", "E4"], wholeNoteTime]],
    [[["A3", "D4"], wholeNoteTime],
    [["E3", "B3"], wholeNoteTime]],
    [[["F#4", "A4"], wholeNoteTime],
    [["B3", "E4"], wholeNoteTime]],
    [[["A3", "D4"], wholeNoteTime],
    [["E3", "B3"], wholeNoteTime]],
  ];

  const kick = [
    [[0, twoBarNoteTime]],
    [[1, quarterNoteTime],
    [0, eighthNoteTime],
    [1, eighthNoteTime],
    [0, eighthNoteTime],
    [1, eighthNoteTime],
    [0, quarterNoteTime],
    [0, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],
    [0, quarterNoteTime],
    [1, quarterNoteTime],
    [0, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime]],

    [[1, quarterNoteTime],
    [0, eighthNoteTime],
    [1, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime],
    [0, eighthNoteTime],
    [1, quarterNoteTime],
    [1, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],
    [0, eighthNoteTime],
    [1, eighthNoteTime],
    [1, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime],
    [0, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime]],
    [[0, twoBarNoteTime]],

    [[1, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime],
    [0, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],
    [0, eighthNoteTime],
    [1, sixteenthTime],
    [1, sixteenthTime],
    [0, sixteenthTime],
    [1, sixteenthTime],
    [0, eighthNoteTime],
    [1, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime],
    [0, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],
    [0, eighthNoteTime],
    [1, sixteenthTime],
    [1, sixteenthTime],
    [0, sixteenthTime],
    [1, sixteenthTime],
    [0, eighthNoteTime]],
    [[1, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime],
    [0, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],
    [0, eighthNoteTime],
    [1, sixteenthTime],
    [1, sixteenthTime],
    [0, sixteenthTime],
    [1, sixteenthTime],
    [0, eighthNoteTime],
    [1, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime],
    [0, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],
    [0, eighthNoteTime],
    [1, sixteenthTime],
    [1, sixteenthTime],
    [0, sixteenthTime],
    [1, sixteenthTime],
    [0, eighthNoteTime]],
    [[1, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime],
    [0, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],
    [0, eighthNoteTime],
    [1, sixteenthTime],
    [1, sixteenthTime],
    [0, sixteenthTime],
    [1, sixteenthTime],
    [0, eighthNoteTime],
    [1, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime],
    [0, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],
    [0, eighthNoteTime],
    [1, sixteenthTime],
    [1, sixteenthTime],
    [0, sixteenthTime],
    [1, sixteenthTime],
    [0, eighthNoteTime]],
    [[1, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime],
    [0, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],
    [0, eighthNoteTime],
    [1, sixteenthTime],
    [1, sixteenthTime],
    [0, sixteenthTime],
    [1, sixteenthTime],
    [0, eighthNoteTime],
    [1, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime],
    [0, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],
    [0, eighthNoteTime],
    [1, sixteenthTime],
    [1, sixteenthTime],
    [0, sixteenthTime],
    [1, sixteenthTime],
    [0, eighthNoteTime]],
  ];

  const snare = [
    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],

    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],

    [[0, quarterNoteTime],
    [0, quarterNoteTime],
    [1, quarterNoteTime],
    [0, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime],

    [0, quarterNoteTime],
    [0, quarterNoteTime],
    [1, quarterNoteTime],
    [0, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime]],

    [[0, quarterNoteTime],
    [0, quarterNoteTime],
    [1, quarterNoteTime],
    [0, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime],

    [0, quarterNoteTime],
    [0, quarterNoteTime],
    [1, quarterNoteTime],
    [0, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime]],

    [[0, quarterNoteTime],
    [0, quarterNoteTime],
    [1, quarterNoteTime],
    [0, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime],

    [0, quarterNoteTime],
    [0, quarterNoteTime],
    [1, quarterNoteTime],
    [0, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime]],

    [[0, quarterNoteTime],
    [0, quarterNoteTime],
    [1, quarterNoteTime],
    [0, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime],

    [0, quarterNoteTime],
    [0, quarterNoteTime],
    [1, quarterNoteTime],
    [0, eighthNoteTime],
    [0, sixteenthTime],
    [1, sixteenthTime]],

  ];

  const bassPattern = [

    [["E1", twoBarNoteTime]],
    [["E1", twoBarNoteTime]],

    [["G1", twoBarNoteTime]],
    [["G1", twoBarNoteTime]],

    [["E2", twoBarNoteTime]],
    [["G1", twoBarNoteTime]],
    [["E2", twoBarNoteTime]],
    [["G1", twoBarNoteTime]],

  ];

  const hiHat = [

    [[0, twoBarNoteTime]],
    [[0, twoBarNoteTime]],

    [[0, twoBarNoteTime]],

    [[0, eighthNoteTime],
    [1, eighthNoteTime],
    [1, quarterNoteTime],
    [1, sixteenthTime],
    [1, sixteenthTime],
    [1, eighthNoteTime],
    [0, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],
    [0, sixteenthTime],
    [1, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],
    [1, sixteenthTime],
    [1, eighthNoteTime],
    [1, eighthNoteTime],
    [1, eighthNoteTime],
    [1, quarterNoteTime]],

    [[0, eighthNoteTime],
    [1, eighthNoteTime],
    [1, quarterNoteTime],
    [1, sixteenthTime],
    [1, sixteenthTime],
    [1, eighthNoteTime],
    [0, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],

    [0, sixteenthTime],
    [1, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],
    [1, sixteenthTime],
    [1, eighthNoteTime],
    [1, eighthNoteTime],
    [1, eighthNoteTime],
    [1, quarterNoteTime]],

    [[0, eighthNoteTime],
    [1, eighthNoteTime],
    [1, quarterNoteTime],
    [1, sixteenthTime],
    [1, sixteenthTime],
    [1, eighthNoteTime],
    [0, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],

    [0, sixteenthTime],
    [1, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],
    [1, sixteenthTime],
    [1, eighthNoteTime],
    [1, eighthNoteTime],
    [1, eighthNoteTime],
    [1, quarterNoteTime]],

    [[0, eighthNoteTime],
    [1, eighthNoteTime],
    [1, quarterNoteTime],
    [1, sixteenthTime],
    [1, sixteenthTime],
    [1, eighthNoteTime],
    [0, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],

    [0, sixteenthTime],
    [1, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],
    [1, sixteenthTime],
    [1, eighthNoteTime],
    [1, eighthNoteTime],
    [1, eighthNoteTime],
    [1, quarterNoteTime]],

    [[0, eighthNoteTime],
    [1, eighthNoteTime],
    [1, quarterNoteTime],
    [1, sixteenthTime],
    [1, sixteenthTime],
    [1, eighthNoteTime],
    [0, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],

    [0, sixteenthTime],
    [1, sixteenthTime],
    [1, eighthNoteTime],
    [1, sixteenthTime],
    [1, sixteenthTime],
    [1, eighthNoteTime],
    [1, eighthNoteTime],
    [1, eighthNoteTime],
    [1, quarterNoteTime]],

  ];

  function applyEQFilter(audioCtx, node, filterType, frequency, qValue = 1) {
    const filter = audioCtx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = frequency;
    filter.Q.value = qValue;
    node.connect(filter);
    return filter;
  }


  function connectContext() {

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const masterGainNode = audioCtx.createGain();
    masterGainNode.gain.value = 0.5;
    masterGainNode.connect(audioCtx.destination);

    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-20, audioCtx.currentTime);
    compressor.knee.setValueAtTime(30, audioCtx.currentTime);
    compressor.ratio.setValueAtTime(4, audioCtx.currentTime);
    compressor.attack.setValueAtTime(0.005, audioCtx.currentTime);
    compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
    compressor.connect(masterGainNode);


    const bassGainNode = audioCtx.createGain();
    bassGainNode.gain.value = 0.9;
    const bassEQ = applyEQFilter(audioCtx, bassGainNode, 'lowpass', 150);
    bassEQ.connect(compressor);

    const melodyGainNode = audioCtx.createGain();
    melodyGainNode.gain.value = 0.6;
    const melodyEQ = applyEQFilter(audioCtx, melodyGainNode, 'highpass', 500);
    melodyEQ.connect(compressor);

    const chordGainNode = audioCtx.createGain();
    chordGainNode.gain.value = 0.12;
    const chordEQ = applyEQFilter(audioCtx, chordGainNode, 'bandpass', 300, 1);
    chordEQ.connect(compressor);

    const kickGainNode = audioCtx.createGain();
    kickGainNode.gain.value = 0.4;
    const snareGainNode = audioCtx.createGain();
    snareGainNode.gain.value = 0.25;
    const hiHatGainNode = audioCtx.createGain();
    hiHatGainNode.gain.value = 0.3;
    kickGainNode.connect(compressor);
    snareGainNode.connect(compressor);
    hiHatGainNode.connect(compressor);


    let nextLoopTime;
    function playKick(startTime) {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, startTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, startTime + 0.5);

      gainNode.gain.setValueAtTime(1, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

      const kickEQ = audioCtx.createBiquadFilter();
      kickEQ.type = 'peaking';
      kickEQ.frequency.value = 120;
      kickEQ.gain.value = 3;

      osc.connect(gainNode);
      gainNode.connect(kickEQ);
      kickEQ.connect(kickGainNode);
      setTimeout(function () {
        return levels.kick = 1;
      }, (startTime - audioCtx.currentTime) * 1000);
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    }

    function playSnare(startTime) {

      const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.2, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = noiseBuffer;

      const noiseFilter = audioCtx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(1500, startTime);

      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(1, startTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(snareGainNode);


      const rimShotBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.05, audioCtx.sampleRate);
      const rimShotOutput = rimShotBuffer.getChannelData(0);

      for (let i = 0; i < rimShotBuffer.length; i++) {
        rimShotOutput[i] = Math.random() * 2 - 1;
      }

      const rimShot = audioCtx.createBufferSource();
      rimShot.buffer = rimShotBuffer;

      const rimShotFilter = audioCtx.createBiquadFilter();
      rimShotFilter.type = 'highpass';
      rimShotFilter.frequency.setValueAtTime(1000, startTime);

      const rimShotGain = audioCtx.createGain();
      rimShotGain.gain.setValueAtTime(1, startTime);
      rimShotGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);

      rimShot.connect(rimShotFilter);
      rimShotFilter.connect(rimShotGain);
      rimShotGain.connect(snareGainNode);


      const burst = audioCtx.createOscillator();
      burst.type = 'square';
      burst.frequency.setValueAtTime(400, startTime);
      burst.connect(snareGainNode);


      noise.start(startTime);
      rimShot.start(startTime);
      burst.start(startTime);

      noise.stop(startTime + 0.2);
      rimShot.stop(startTime + 0.05);
      burst.stop(startTime + 0.01);

      setTimeout(function () {
        return levels.snare = 1;
      }, (startTime - audioCtx.currentTime) * 1000);
    }

    function playHiHat(startTime) {
      const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.05, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = noiseBuffer;

      const noiseFilter = audioCtx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(8000, startTime);

      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.5, startTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(hiHatGainNode);

      noise.start(startTime);
      noise.stop(startTime + 0.05);
    }

    function playLead1Note(frequency, startTime, duration) {
      const glideTime = 0.1;

      const gainNode = audioCtx.createGain();
      gainNode.gain.value = lead1Gain;

      const oscillator = audioCtx.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, startTime);

      const lowPassFilter = audioCtx.createBiquadFilter();
      lowPassFilter.type = 'lowpass';
      lowPassFilter.frequency.setValueAtTime(800, startTime);

      if (isFirefox()) {
        oscillator.connect(lowPassFilter);
        lowPassFilter.connect(gainNode);
        gainNode.connect(masterGainNode);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      }
      else {
        const vibratoFrequency = 5;
        const vibratoAmount = 7;

        const vibratoOsc = audioCtx.createOscillator();
        vibratoOsc.frequency.value = vibratoFrequency;
        const vibratoGain = audioCtx.createGain();
        vibratoGain.gain.value = vibratoAmount;
        vibratoOsc.connect(vibratoGain);
        vibratoGain.connect(oscillator.frequency);

        oscillator.frequency.setTargetAtTime(frequency, startTime, glideTime);

        oscillator.connect(lowPassFilter);
        lowPassFilter.connect(gainNode);
        gainNode.connect(masterGainNode);

        oscillator.start(startTime);
        vibratoOsc.start(startTime);

        oscillator.stop(startTime + duration);
        vibratoOsc.stop(startTime + duration);
      }
    }


    function playChordNote(frequency, startTime, duration) {
      const unisonVoices = 4;
      const detuneAmount = 10;

      const gainNode = audioCtx.createGain();
      gainNode.gain.value = 0.5;
      const oscillators = [];
      for (let i = 0; i < unisonVoices; i++) {
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        const detuneValue = (i - Math.floor(unisonVoices / 2)) * detuneAmount;
        oscillator.frequency.setValueAtTime(frequency * 2, startTime);
        oscillator.detune.setValueAtTime(detuneValue, startTime);
        oscillator.connect(gainNode);
        oscillators.push(oscillator);
      }

      const convolver = audioCtx.createConvolver();

      function createReverbBuffer() {
        const length = audioCtx.sampleRate * 0.8; const impulse = audioCtx.createBuffer(2, length, audioCtx.sampleRate);
        for (let i = 0; i < impulse.numberOfChannels; i++) {
          const channelData = impulse.getChannelData(i);
          for (let j = 0; j < length; j++) {
            channelData[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, 2);
          }
        }
        return impulse;
      }

      convolver.buffer = createReverbBuffer();

      gainNode.connect(convolver);
      convolver.connect(chordGainNode);
      chordGainNode.connect(masterGainNode);
      masterGainNode.connect(audioCtx.destination);

      oscillators.forEach(osc => {
        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    }


    function playSynthLead2(frequency, startTime, duration) {
      const osc1 = audioCtx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.value = frequency;
      osc1.detune.value = 0;

      const gain1 = audioCtx.createGain();
      gain1.gain.value = 0.3;
      osc1.connect(gain1);

      const filter1 = audioCtx.createBiquadFilter();
      filter1.type = 'notch';
      filter1.frequency.value = 0.3 * audioCtx.sampleRate;
      filter1.Q.value = 0.3;

      const filter2 = audioCtx.createBiquadFilter();
      filter2.type = 'lowpass';
      filter2.frequency.setTargetAtTime(500, audioCtx.currentTime, 0);
      filter2.Q.value = 0.04;
      filter2.gain.value = 1;

      const highPassFilter = audioCtx.createBiquadFilter();
      highPassFilter.type = 'highpass';
      highPassFilter.frequency.setTargetAtTime(200, audioCtx.currentTime, 0);
      highPassFilter.Q.value = 1;

      gain1.connect(filter1);
      filter1.connect(filter2);
      filter2.connect(highPassFilter);

      const outputGain = audioCtx.createGain();
      outputGain.gain.value = 0.9;
      highPassFilter.connect(outputGain);
      outputGain.connect(masterGainNode);
      masterGainNode.connect(audioCtx.destination);

      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.type = 'sine';
      lfo.frequency.value = 3;
      lfoGain.gain.value = 100;

      lfo.connect(lfoGain);
      lfoGain.connect(filter2.frequency);
      setTimeout(function () {
        return levels.synth = 1;
      }, (startTime - audioCtx.currentTime) * 1000);
      osc1.start(startTime);
      lfo.start(startTime);
      osc1.stop(startTime + duration);
      lfo.stop(startTime + duration);
    }

    function playSynthArpA(frequency, startTime, duration) {
      const osc1 = audioCtx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.value = frequency;
      osc1.detune.value = 0;

      const gain1 = audioCtx.createGain();
      gain1.gain.value = 0.5;
      osc1.connect(gain1);

      const filter1 = audioCtx.createBiquadFilter();
      filter1.type = 'notch';
      filter1.frequency.value = 0.3 * audioCtx.sampleRate;
      filter1.Q.value = 0.3;

      const filter2 = audioCtx.createBiquadFilter();
      filter2.type = 'lowpass';
      filter2.frequency.setTargetAtTime(500, audioCtx.currentTime, 0);
      filter2.Q.value = 0.04;
      filter2.gain.value = 1;

      const highPassFilter = audioCtx.createBiquadFilter();
      highPassFilter.type = 'highpass';
      highPassFilter.frequency.setTargetAtTime(200, audioCtx.currentTime, 0);
      highPassFilter.Q.value = 1;

      gain1.connect(filter1);
      filter1.connect(filter2);
      filter2.connect(highPassFilter);

      const outputGain = audioCtx.createGain();
      outputGain.gain.value = 0.5;
      highPassFilter.connect(outputGain);
      outputGain.connect(masterGainNode);
      masterGainNode.connect(audioCtx.destination);

      osc1.start(startTime);
      osc1.stop(startTime + duration);
    }




    function playMarimba(frequency, startTime, duration) {
      const gainNode = audioCtx.createGain();
      const oscillator1 = audioCtx.createOscillator();
      const oscillator2 = audioCtx.createOscillator();

      oscillator1.type = 'sine';
      oscillator1.frequency.setValueAtTime(frequency * 2, startTime);

      oscillator2.type = 'sine';
      oscillator2.frequency.setValueAtTime(frequency * 4, startTime);
      oscillator2.detune.value = 3
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);

      gainNode.gain.setValueAtTime(marimbaGain, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      oscillator1.start(startTime);
      oscillator2.start(startTime);

      oscillator1.stop(startTime + duration);
      oscillator2.stop(startTime + duration);

      gainNode.connect(masterGainNode);
      masterGainNode.connect(audioCtx.destination);
    }

    function playbass(frequency, startTime, duration) {
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const osc3 = audioCtx.createOscillator();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc3.type = 'sawtooth';

      osc1.frequency.value = frequency;
      osc2.frequency.value = frequency * 4;
      osc3.frequency.value = frequency * 2;
      osc1.detune.value = 0;
      osc2.detune.value = 2;
      osc3.detune.value = -3;

      const gain1 = audioCtx.createGain();
      const gain2 = audioCtx.createGain();
      const gain3 = audioCtx.createGain();

      gain1.gain.value = 0.8;
      gain2.gain.value = 0.6;
      gain3.gain.value = 0.6;

      osc1.connect(gain1);
      osc2.connect(gain2);
      osc3.connect(gain3);

      const filter1 = audioCtx.createBiquadFilter();
      filter1.type = 'notch';
      filter1.frequency.value = 120;
      filter1.Q.value = 1.0;

      const filter2 = audioCtx.createBiquadFilter();
      filter2.type = 'lowpass';
      filter2.frequency.setTargetAtTime(400, audioCtx.currentTime, 0);

      gain1.connect(filter1);
      gain2.connect(filter1);
      gain3.connect(filter1);
      filter1.connect(filter2);
      filter2.connect(bassGainNode);

      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();

      lfo.type = 'sine';
      lfo.frequency.value = 3;
      lfoGain.gain.value = 100;

      lfo.connect(lfoGain);
      lfoGain.connect(filter2.frequency);

      osc1.start(startTime);
      osc2.start(startTime);
      osc3.start(startTime);
      lfo.start(startTime);

      osc1.stop(startTime + duration);
      osc2.stop(startTime + duration);
      osc3.stop(startTime + duration);
      lfo.stop(startTime + duration);
    }

    function playDrumPart(part, startTime, playFunction) {
      let currentTime = startTime;
      part[chunkCounterDrums].forEach(([hit, duration]) => {
        if (hit === 1) {
          playFunction(currentTime);
        }
        currentTime += duration;
      });
    }


    function playNoteChunk(notePattern, synthFunction, startTime) {
      let currentTime = startTime;
      notePattern[chunkCounter].forEach(([noteValue, duration]) => {
        const frequency = noteFrequencies[noteValue];
        if (noteValue !== 0) {
          synthFunction(frequency, currentTime, duration);
        }
        currentTime += duration;
      });
      return currentTime;
    }

    function playChordChunk(notePattern, synthFunction, startTime) {
      let currentTime = startTime;
      notePattern[chunkCounter].forEach(([chord, duration]) => {
        chord.forEach(noteValue => {
          const frequency = noteFrequencies[noteValue];
          synthFunction(frequency, currentTime, duration);
        });
        currentTime += duration;
      });
      return currentTime;
    }

    function playDrumPatterns(startTime) {
      let currentTime = startTime;
      playDrumPart(kick, currentTime, playKick);
      playDrumPart(snare, currentTime, playSnare);
      playDrumPart(hiHat, currentTime, playHiHat);
    }

    const startTime = audioCtx.currentTime + 0.5;
    function loop() {
      const loopEndTime = playNoteChunk(bassPattern, playbass, nextLoopTime || startTime);
      playNoteChunk(lead1Pattern, playLead1Note, nextLoopTime || startTime);
      playNoteChunk(selectedLead2Pattern, playSynthLead2, nextLoopTime || startTime);
      playNoteChunk(marimbaPattern, playMarimba, nextLoopTime || startTime);
      playDrumPatterns(nextLoopTime || startTime);
      if (!isFirefox())
        playChordChunk(chordPattern, playChordNote, nextLoopTime || startTime);

      if (hasPlayedIntro) {
        if (game.player.speed > 0.9) {
          playNoteChunk(arpThemeA2, playSynthArpA, nextLoopTime || startTime);
        } else if (game.player.speed > 0.4) {
          playNoteChunk(arpThemeA1, playSynthArpA, nextLoopTime || startTime);
        }
      }

      if (chunkCounter < 7) {
        chunkCounter++;
      } else {
        chunkCounter = 2;
        marimbaGain = 0.02;
        lead1Gain = 0.1;
        hasPlayedIntro = true;
      }


      if (chunkCounterDrums > 6) {
        chunkCounterDrums = 4;
      } else {
        chunkCounterDrums++;
      }
      nextLoopTime = loopEndTime;
      setTimeout(loop, (nextLoopTime - audioCtx.currentTime) * 1000);
    }
    loop();
  }

  function pumpNotes(uDelta) {
    levels.bass = Math.max(0, levels.bass - (uDelta / 1000));
    levels.snare = Math.max(0, levels.snare - (uDelta / 500));
    levels.synth = Math.max(0, levels.synth - (uDelta / 500));
    levels.kick = Math.max(0, levels.kick - (uDelta / 500));
  }

  return {
    keys: Object.keys(levels),
    levels,
    pumpNotes,
    connectContext,
  };
}