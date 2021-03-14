const dec2bin = (dec) => {
  return (dec >>> 0).toString(2);
};

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};
