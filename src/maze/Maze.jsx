import Cell from './Cell';
import {
    cellsEqual
} from '../generation/generator';
import './Maze.scss';

const Maze = (
    {
        maze = [[]],
        visited = [],
    }
) => {
    const lastVisited = visited[visited.length - 1];
    return (
        <div
            id="maze"
            style={{width: `${maze[0].length * 24}px`}}
        >
            {
                maze.map((c1, i) => 
                    c1.map((c2, j) => (
                        <Cell
                            key={`${i}-${j}`}
                            visited={
                                visited.findIndex(v => cellsEqual(v, {x: i, y: j})) !== -1
                            }
                            current={cellsEqual(lastVisited, {x: i, y: j})}
                            {...c2}
                        />
                    )
                ))
            }
        </div>
    )
};

export default Maze;
