const table = document.querySelector("table");

const [height, width] = [5, 10];
console.log(table, height, width);

generateMaze = () => {
  const board = generateArray(height, width);
  return board.map((row) => row.map((cell) => generateValue()));
};
const dec2bin = (dec) => {
  return (dec >>> 0).toString(2);
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max)) + 1;
};

const generateValue = () => {
  return dec2bin(getRandomInt(14)).padStart(4, "0");
};

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const goNext = () => {};

const UNVISITED = "1111";
const LEFT = "1110";
const RIGHT = "1011";
const TOP = "0111";
const BOTTOM = "1101";

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
class Maze {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.initMaze();
  }

  generateMaze = () => {
    const rows = new Array(this.height).fill("");
    this.maze = rows.map((row) => new Array(this.width).fill(UNVISITED));
  };

  initMaze = () => {
    this.generateMaze();
    console.log(this.maze);
    this.searchNextCell({ x: 0, y: 0 });
  };

  checkLeft = ({ x, y }) => {
    if (x < 1) return false;
    if (this.maze[y][x - 1] === UNVISITED) return true;
    return false;
  };

  checkRight = ({ x, y }) => {
    if (x >= this.maze.length - 1) return false;
    if (this.maze[y][x + 1] === UNVISITED) return true;
    return false;
  };

  checkTop = ({ x, y }) => {
    if (y < 1) return false;
    if (this.maze[y - 1][x] === UNVISITED) return true;
    return false;
  };

  checkBottom = ({ x, y }) => {
    if (y >= this.maze.length - 1) return false;
    if (this.maze[y + 1][x] === UNVISITED) return true;
    return false;
  };
  searchNextCell = async (pos) => {
    // console.log("searching next", pos);
    const { x, y } = pos;
    let nexts = [];

    if (this.checkLeft(pos))
      nexts.push({ x: x - 1, y, direction: LEFT, previous: RIGHT });
    if (this.checkRight(pos))
      nexts.push({ x: x + 1, y, direction: RIGHT, previous: LEFT });
    if (this.checkTop(pos))
      nexts.push({ x, y: y - 1, direction: TOP, previous: BOTTOM });
    if (this.checkBottom(pos))
      nexts.push({ x, y: y + 1, direction: BOTTOM, previous: TOP });
    // console.log(nexts);
    this.nexts = nexts;
    // while (nexts.length) {
    // console.log("in while", nexts);
    const next = sample(nexts);
    nexts = removeItemOnce(nexts, next);
    if (next) {
      this.moveCell(next, pos);
      this.searchNextCell({ x: next.x, y: next.y });
      console.log("b");
    } else return false;
    // console.log(nexts);
    // }
    // console.log("ok", this.nexts);
  };

  moveCell = (nextPos, { x, y }) => {
    nextPos.direction;
    console.log(x, y, nextPos.direction, this.maze[y][x]);

    let value = parseInt(this.maze[y][x], 2);
    let valueNext = parseInt(this.maze[nextPos.y][nextPos.x], 2);
    let prev = parseInt(nextPos.previous, 2);
    let next = parseInt(nextPos.direction, 2);
    // console.log("dec", value, prev, next, value & prev & next);
    // console.log(
    //   "binary",
    //   dec2bin(value),
    //   dec2bin(prev),
    //   dec2bin(next),
    //   dec2bin(value & prev & next).padStart(4, "0")
    // );
    this.maze[y][x] = dec2bin(value & next).padStart(4, "0");
    this.maze[nextPos.y][nextPos.x] = dec2bin(valueNext & prev).padStart(
      4,
      "0"
    );
    this.displayMaze();
  };

  createStyledCell = (value) => {
    const td = document.createElement("td");
    td.style.height = "50px";
    td.style.width = "50px";
    if (value !== UNVISITED) td.style.background = "red";
    if (value[0] === "1") td.style.borderTop = "5px solid black";
    if (value[1] === "1") td.style.borderRight = "5px solid black";
    if (value[2] === "1") td.style.borderBottom = "5px solid black";
    if (value[3] === "1") td.style.borderLeft = "5px solid black";
    return td;
  };

  displayMaze = async () => {
    await sleep(1000);

    document.querySelector("table").remove();
    const table = document.createElement("table");
    this.maze.forEach((row, y) => {
      const tr = document.createElement("tr");
      row.forEach((cell, x) => {
        const td = this.createStyledCell(this.maze[y][x]);
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
    document.querySelector("body").append(table);
  };
}

// const start = () => {
//   let board = initMaze();

//   const pos = { x: 2, y: 2 };
//   nexts = searchNext(board, pos);
//   goNext(board, nexts);
//   displayMaze(board);
// };

// start();
