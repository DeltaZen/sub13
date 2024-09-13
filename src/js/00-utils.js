const randomOfArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomFloatBetween = (min, max) => ((Math.random() * (max - min)) + min);

const randomIntBetween = (min, max) => Math.floor(randomFloatBetween(min, max));

const randomBool = (chance = 0.5) => (Math.random() < chance);