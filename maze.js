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

  initMaze = () => {
    this.generateMaze();

    const startingPos = this.initPos();

    this.openCell(startingPos, TOP);
    this.solveMaze(startingPos);
    this.finishMaze(this.last);
    this.displayMaze();
  };

  generateMaze = () => {
    const rows = new Array(this.height).fill("");
    this.maze = rows.map((row) => new Array(this.width).fill(UNVISITED));
  };

  initPos = () => {
    const pos = { x: getRandomInt(this.width), y: 0 };
    return pos;
  };

  getNumberOfWalls = ({ x, y }) => {
    return (this.maze[y][x].match(/1/g) || []).length;
  };

  finishMaze = (pos) => {
    this.openLastCell(pos);
  };

  chooseLastCell = (pos) => {
    const exitCells = [];
    this.maze.forEach((line, y) => {
      let pos = { x: 0, y };
      if (this.getNumberOfWalls(pos) === 3) exitCells.push({ ...pos });
      pos.x = this.width - 1;
      if (this.getNumberOfWalls(pos) === 3) exitCells.push({ ...pos });
    });
    this.maze[0].forEach((col, x) => {
      if (x !== 0 && x !== this.width - 1) {
        let pos = { x, y: 0 };
        if (this.getNumberOfWalls(pos) === 3) exitCells.push({ ...pos });
        pos.y = this.height - 1;
        if (this.getNumberOfWalls(pos) === 3) exitCells.push({ ...pos });
      }
    });
    const exitCell = sample(exitCells);
    if (exitCell) return this.openLastCell(exitCell);
    return this.openLastCell({
      x: getRandomInt(this.width),
      y: this.height - 1,
    });
  };

  openLastCell = (pos) => {
    if (pos.x === 0) return this.openCell(pos, LEFT);
    if (pos.y === 0) return this.openCell(pos, TOP);
    if (pos.x === this.width - 1) return this.openCell(pos, RIGHT);
    if (pos.y === this.height - 1) return this.openCell(pos, BOTTOM);
    this.chooseLastCell(pos);
  };

  openCell = ({ x, y }, direction) => {
    const value = parseInt(this.maze[y][x], 2);
    const directionInt = parseInt(direction, 2);

    this.maze[y][x] = dec2bin(value & directionInt).padStart(4, "0");
  };

  checkLeft = ({ x, y }) => {
    if (x < 1) return false;
    if (this.maze[y][x - 1] === UNVISITED) return true;
    return false;
  };

  checkRight = ({ x, y }) => {
    if (x >= this.maze[0].length - 1) return false;
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

  solveMaze = (currentPos) => {
    let nextCells = this.searchNextCell(currentPos);
    while (nextCells.length) {
      const next = sample(nextCells);
      this.moveNextCell(next, currentPos);
      this.last = next;
      this.solveMaze({ x: next.x, y: next.y });
      nextCells = this.searchNextCell({ x: currentPos.x, y: currentPos.y });
    }
  };

  searchNextCell = (currentPos) => {
    const { x, y } = currentPos;
    const nextCells = [];

    if (this.checkLeft(currentPos))
      nextCells.push({
        x: x - 1,
        y,
        direction: LEFT,
        previousDirection: RIGHT,
      });
    if (this.checkRight(currentPos))
      nextCells.push({
        x: x + 1,
        y,
        direction: RIGHT,
        previousDirection: LEFT,
      });
    if (this.checkTop(currentPos))
      nextCells.push({
        x,
        y: y - 1,
        direction: TOP,
        previousDirection: BOTTOM,
      });
    if (this.checkBottom(currentPos))
      nextCells.push({
        x,
        y: y + 1,
        direction: BOTTOM,
        previousDirection: TOP,
      });
    return nextCells;
  };

  moveNextCell = (nextCell, currentPos) => {
    this.openCell(nextCell, nextCell.previousDirection);
    this.openCell(currentPos, nextCell.direction);
  };

  displayMaze = () => {
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
    const size = `${700 / Math.max(this.height, this.width)}px`;
    td.style.height = size;
    td.style.width = size;
    if (value[0] === "1") td.style.borderTop = "5px solid black";
    if (value[1] === "1") td.style.borderRight = "5px solid black";
    if (value[2] === "1") td.style.borderBottom = "5px solid black";
    if (value[3] === "1") td.style.borderLeft = "5px solid black";
    return td;
  };
}
