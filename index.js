const table = document.querySelector("table");

const dec2bin = (dec) => {
  return (dec >>> 0).toString(2);
};

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const UNVISITED = "1111";
const LEFT = "1110";
const RIGHT = "1011";
const TOP = "0111";
const BOTTOM = "1101";

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

    const startingPos = this.initPos();

    this.openMaze(startingPos);
    this.solveMaze(startingPos);
    this.finishMaze();
    this.displayMaze();
  };

  initPos = () => {
    const pos = { x: getRandomInt(this.height), y: 0 };
    return pos;
  };

  finishMaze = () => {
    this.openMaze(this.last);
  };

  openMaze = ({ x, y }) => {
    let value = parseInt(this.maze[y][x], 2);

    if (x === 0)
      return (this.maze[y][x] = dec2bin(value & parseInt(LEFT, 2)).padStart(
        4,
        "0"
      ));
    if (y === 0)
      return (this.maze[y][x] = dec2bin(value & parseInt(TOP, 2)).padStart(
        4,
        "0"
      ));
    if (x === this.width - 1) {
      console.log("right", x, y);
      return (this.maze[y][x] = dec2bin(value & parseInt(RIGHT, 2)).padStart(
        4,
        "0"
      ));
    }
    if (y === this.height - 1) {
      console.log("bottom", x, y);
      return (this.maze[y][x] = dec2bin(value & parseInt(BOTTOM, 2)).padStart(
        4,
        "0"
      ));
    }
  };

  openCell = ({ x, y }, direction) => {
    let value = parseInt(this.maze[y][x], 2);
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

  searchNextCell = (currentPos) => {
    const { x, y } = currentPos;
    const nextCells = [];

    if (this.checkLeft(currentPos))
      nextCells.push({ x: x - 1, y, direction: LEFT, previous: RIGHT });
    if (this.checkRight(currentPos))
      nextCells.push({ x: x + 1, y, direction: RIGHT, previous: LEFT });
    if (this.checkTop(currentPos))
      nextCells.push({ x, y: y - 1, direction: TOP, previous: BOTTOM });
    if (this.checkBottom(currentPos))
      nextCells.push({ x, y: y + 1, direction: BOTTOM, previous: TOP });
    return nextCells;
  };

  solveMaze = (currentPos) => {
    let nextCells = this.searchNextCell(currentPos);
    while (nextCells.length) {
      const next = sample(nextCells);
      this.moveNextCell(next, currentPos);
      this.last = next;
      this.solveMaze({ x: next.x, y: next.y });
      nextCells = this.searchNextCell({ x: currentPos.x, y: currentPos.y });
    }
    return [currentPos, nextCells];
  };

  moveNextCell = (nextCell, { x, y }) => {
    const currentValue = parseInt(this.maze[y][x], 2);
    const nextValue = parseInt(this.maze[nextCell.y][nextCell.x], 2);
    const previousDirection = parseInt(nextCell.previous, 2);
    const nextDirection = parseInt(nextCell.direction, 2);

    this.maze[y][x] = dec2bin(currentValue & nextDirection).padStart(4, "0");
    this.maze[nextCell.y][nextCell.x] = dec2bin(
      nextValue & previousDirection
    ).padStart(4, "0");
  };

  displayMaze = () => {
    document.querySelector("table")?.remove();
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

  createStyledCell = (value) => {
    const td = document.createElement("td");
    const size = `${500 / Math.max(this.height, this.width)}px`;
    td.style.height = size;
    td.style.width = size;
    if (value !== UNVISITED) td.style.background = "red";
    if (value[0] === "1") td.style.borderTop = "5px solid black";
    if (value[1] === "1") td.style.borderRight = "5px solid black";
    if (value[2] === "1") td.style.borderBottom = "5px solid black";
    if (value[3] === "1") td.style.borderLeft = "5px solid black";
    return td;
  };
}
