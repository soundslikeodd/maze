import Cell from './Cell';
import {
  cellsEqual,
} from '../generation/generator';
import './Maze.scss';

const Maze = (
  {
    maze = [[]],
    visited = [],
  },
) => {
  const lastVisited = visited[visited.length - 1];
  return (
    <div
      id="maze"
      style={{ width: `${maze[0].length * 24}px` }}
    >
      {
        maze.map((c1, i) => c1.map((c2, j) => (
          <Cell
            key={`${c2.x}-${c2.y}`}
            visited={
              visited.findIndex((v) => cellsEqual(v, { x: i, y: j })) !== -1
            }
            current={cellsEqual(lastVisited, { x: i, y: j })}
            wallEast={c2.wallEast}
            wallNorth={c2.wallNorth}
            wallSouth={c2.wallSouth}
            wallWest={c2.wallWest}
            x={c2.x}
            y={c2.y}
            start={c2.start}
            end={c2.end}
          />
        )))
      }
    </div>
  );
};

export default Maze;
