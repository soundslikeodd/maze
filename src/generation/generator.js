import seedrandom from 'seedrandom';

const getRandom = (max, random) => Math.floor(random() * max);
const defaultMazeHeight = 10;
const defaultMazeWidth = 10;

const wallKeys = [
  'wallNorth',
  'wallEast',
  'wallSouth',
  'wallWest',
];

const generateEdges = (width, height) => Array(width).fill(Array(height).fill())
  .map((c1, i) => c1.map((_, j) => (
    {
      x: i,
      y: j,
      wallNorth: true,
      wallEast: true,
      wallSouth: true,
      wallWest: true,
    }
  )));

const determinePoint = (
  d1,
  d2,
  random,
) => {
  const x = getRandom(d1, random);
  const y = x === 0 || x === d1
    ? getRandom(d2, random)
    : getRandom(d1, random) % 2 === 0 ? 0 : d2; // keeps points are edge of maze
  return {
    x,
    y,
  };
};

const determinePointNotSame = (
  d1,
  d2,
  otherX,
  otherY,
  random,
) => {
  const {
    x,
    y,
  } = determinePoint(d1, d2, random);
  return otherX === x && otherY === y
    ? determinePointNotSame(d1, d2, otherX, otherY, random)
    : { x, y };
};

const determineStartFinish = (maze, ranSE, random) => {
  const mazeIndexWidth = maze[0].length - 1;
  const mazeIndexHeight = maze.length - 1;
  const [
    {
      x: startX,
      y: startY,
    }, {
      x: endX,
      y: endY,
    },
  ] = ranSE
    ? (() => {
      const d1 = maze.length - 1;
      const d2 = maze[0].length - 1;
      const start = determinePoint(d1, d2, random);
      const end = determinePointNotSame(d1, d2, start.x, start.y, random);
      return [start, end];
    })()
    : [{ x: 0, y: 0 }, { x: mazeIndexHeight, y: mazeIndexWidth }];
  return maze.map(
    (c1, i) => c1.map(
      (c2, j) => (
        i === startX && j === startY
          ? { ...c2, start: true }
          : i === endX && j === endY
            ? { ...c2, end: true }
            : c2
      ),
    ),
  );
};

const directionalChecks = (wall, mazeIndexWidth, mazeIndexHeight) => ({
  wallNorth: (cell, visited) => (cell.x === 0
    ? false
    : !visited.filter((c) => c.y === cell.y && c.x === cell.x - 1).length),
  wallEast: (cell, visited) => (cell.y === mazeIndexWidth
    ? false
    : !visited.filter((c) => c.y === cell.y + 1 && c.x === cell.x).length),
  wallSouth: (cell, visited) => (cell.x === mazeIndexHeight
    ? false
    : !visited.filter((c) => c.y === cell.y && c.x === cell.x + 1).length),
  wallWest: (cell, visited) => (cell.y === 0
    ? false
    : !visited.filter((c) => c.y === cell.y - 1 && c.x === cell.x).length),
})[wall];

const pickDirection = (cell, visited, mazeIndexWidth, mazeIndexHeight, random) => {
  const cellWalls = wallKeys.reduce((acc, k) => [...acc, ...(cell[k] ? [k] : [])], []);
  const possibleDirections = cellWalls
    .filter((w) => directionalChecks(w, mazeIndexWidth, mazeIndexHeight)(cell, visited));
  return possibleDirections[Math.floor(random() * possibleDirections.length)];
};

const relativeCell = (cell, direction) => ({
  wallNorth: ({ x, y }) => ({ x: x - 1, y }),
  wallEast: ({ x, y }) => ({ x, y: y + 1 }),
  wallSouth: ({ x, y }) => ({ x: x + 1, y }),
  wallWest: ({ x, y }) => ({ x, y: y - 1 }),
})[direction](cell);

const cellsEqual = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => x1 === x2 && y1 === y2;
const oppositeWall = (direction) => ({
  wallNorth: 'wallSouth',
  wallEast: 'wallWest',
  wallSouth: 'wallNorth',
  wallWest: 'wallEast',
}[direction]);

const walkMaze = (
  maze,
  current,
  end,
  visited,
  random,
) => {
  const atEnd = cellsEqual(current, end);
  const mazeIndexWidth = maze[0].length - 1;
  const mazeIndexHeight = maze.length - 1;
  const direction = pickDirection(
    maze[current.x][current.y],
    visited,
    mazeIndexWidth,
    mazeIndexHeight,
    random,
  );
  if (!direction || atEnd) {
    const indexOfCurrent = visited.findIndex((v) => cellsEqual(v, current)) || 0;
    if (indexOfCurrent) {
      const last = visited[indexOfCurrent - 1];
      return walkMaze(maze, maze[last.x][last.y], end, visited, random);
    }
    return maze;
  }
  const nextXY = relativeCell(current, direction);
  const next = maze[nextXY.x][nextXY.y];
  const adjustedMaze = maze.map((r) => r.map((c) => (
    cellsEqual(c, current)
      ? { ...c, [direction]: false }
      : cellsEqual(c, next)
        ? { ...c, [oppositeWall(direction)]: false }
        : c
  )));
  const updatedVisited = [...visited, next];
  if (updatedVisited.length < maze.length * maze[0].length) {
    return walkMaze(adjustedMaze, next, end, updatedVisited, random);
  }
  return adjustedMaze;
};

const generateMaze = (seed, width, height, ranSE) => {
  const random = seedrandom(seed);
  const maze = determineStartFinish(generateEdges(width, height), ranSE, random);
  const startX = maze.findIndex((row) => row.findIndex((cell) => cell.start) >= 0);
  const startY = maze[startX].findIndex((cell) => cell.start);
  const endX = maze.findIndex((row) => row.findIndex((cell) => cell.end) >= 0);
  const endY = maze[endX].findIndex((cell) => cell.end);
  const mazifiedMaze = walkMaze(
    maze,
    { x: startX, y: startY },
    { x: endX, y: endY },
    [{ x: startX, y: startY }],
    random,
  );
  return mazifiedMaze;
};

export {
  generateEdges,
  determineStartFinish,
  generateMaze,
  cellsEqual,
  defaultMazeHeight,
  defaultMazeWidth,
};
