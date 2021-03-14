const table = document.querySelector("table");

const [height, width] = [5, 10];
console.log(table, height, width);

const createStyledCell = (value) => {
  const td = document.createElement("td");
  td.style.height = "50px";
  td.style.width = "50px";
  if (value !== "1111") td.style.background = "red";
  if (value[0] === "1") td.style.borderTop = "5px solid black";
  if (value[1] === "1") td.style.borderRight = "5px solid black";
  if (value[2] === "1") td.style.borderBottom = "5px solid black";
  if (value[3] === "1") td.style.borderLeft = "5px solid black";
  return td;
};
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

const displayMaze = (board) => {
  for (let y = 0; y < board.length; y++) {
    const tr = document.createElement("tr");
    for (let x = 0; x < board[y].length; x++) {
      const td = createStyledCell(board[y][x]);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
};

const checkLeft = (board, { x, y }) => {
  if (x < 1) return false;
  if (board[y][x - 1] === "1111") return true;
  return false;
};

const checkRight = (board, { x, y }) => {
  if (x >= board.length - 1) return false;
  if (board[y][x + 1] === "1111") return true;
  return false;
};

const checkTop = (board, { x, y }) => {
  if (y < 1) return false;
  if (board[y - 1][x] === "1111") return true;
  return false;
};

const checkBottom = (board, { x, y }) => {
  if (y >= board.length - 1) return false;
  if (board[y + 1][x] === "1111") return true;
  return false;
};

const searchNext = (board, pos) => {
  console.log("searching next", pos);
  const { x, y } = pos;
  const nexts = [];

  if (checkLeft(board, pos)) nexts.push({ x: x - 1, y });
  if (checkRight(board, pos)) nexts.push({ x: x + 1, y });
  if (checkTop(board, pos)) nexts.push({ x, y: y - 1 });
  if (checkBottom(board, pos)) nexts.push({ x, y: y + 1 });
  console.log(nexts);
  return nexts;
};

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const goNext = () => {};

const UNVISITED = "1111";

class Maze {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.initMaze();
  }

  generateArray = (height, width) => {
    let board = new Array(height);
    return board.fill(new Array(width).fill(0));
  };

  initMaze = () => {
    let board = generateArray(height, width);
    board = board.map((row) => row.map((cell) => 0));
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        value = UNVISITED;
        board[y][x] = value;
      }
    }
    console.log(board);
    return board;
  };
}

const start = () => {
  let board = initMaze();

  const pos = { x: 2, y: 2 };
  nexts = searchNext(board, pos);
  goNext(board, nexts);
  displayMaze(board);
};
start();

const removeTable = () => {
  document.querySelector("table").remove();
};

solveMaze = (pos) => {
  let nexts = this.searchNextCell(pos);
  do {
    const next = sample(nexts);
    if (next) {
      this.moveCell(next, pos);
      this.solveMaze(pos);
      nexts = this.searchNextCell({ x: next.x, y: next.y });
    } else return false;
  } while (nexts.length);
};
