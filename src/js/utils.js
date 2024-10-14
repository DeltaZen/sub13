export const randomOfArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const randomFloatBetween = (min, max) => ((Math.random() * (max - min)) + min);

export const randomIntBetween = (min, max) => Math.floor(randomFloatBetween(min, max));

export const randomBool = (chance = 0.5) => (Math.random() < chance);
