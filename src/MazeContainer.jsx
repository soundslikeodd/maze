import {
    useState,
    useEffect
} from 'react';
import Maze from './maze/Maze';
import Controls from './controls/Controls';
import Status from './status/Status';
import {
    generateEdges,
    determineStartFinish,
    generateMaze,
    cellsEqual,
    defaultMazeHeight,
    defaultMazeWidth
} from './generation/generator';
import './MazeContainer.scss';

const newMaze = (
    width,
    height,
    ranSE
) => generateMaze(determineStartFinish(generateEdges(width, height), ranSE));
const initialMaze = newMaze(defaultMazeWidth, defaultMazeHeight);

const updateProgress = (current, visited, nextCellFunc, end, maze) => {
    const nextCell = nextCellFunc(current);
    return {
        current: nextCell,
        visited: [...visited, nextCell],
        win: cellsEqual(nextCell, end),
        end,
        maze,
        touchStart: null,
    };
};

const determineTouchDirection = (
    {
        x: startX,
        y: startY,
    },
    {
        x: endX,
        y: endY,
    }
) => {
    const deltaX = startX - endX;
    const deltaY = startY - endY;
    const isHorizantol = Math.abs(deltaX) > Math.abs(deltaY);
    return isHorizantol 
        ? deltaX < 0
            ? 'right'
            : 'left'
        : deltaY < 0
            ? 'down'
            : 'up';
}

const MazeContainer = ({}) => {
    const [touchStart, setTouchStart] = useState();
    const [game, setProgress] = useState(() => {
        const current = initialMaze.reduce((item, row) => {
            const found = row.find(c => c.start);
            return found || item;
        }, {});
        const end = initialMaze.reduce((item, row) => {
            const found = row.find(c => c.end);
            return found || item;
        }, {});
        return {
            current,
            visited: [current],
            win: false,
            end,
            maze: initialMaze,
            touchStart: null,
        };
    });
    useEffect(() => {
        const keyPress = (event) => {
            if (event.type === 'touchstart') {
                setTouchStart({
                    x: event.changedTouches[0].screenX,
                    y: event.changedTouches[0].screenY,
                });
            }
            const swipeDirection = event.type === 'touchend'
                ? determineTouchDirection(
                    touchStart, {
                        x: event.changedTouches[0].screenX,
                        y: event.changedTouches[0].screenY,
                    })
                : null;
            if (event.key === 'ArrowUp' || swipeDirection === 'up') {
                setProgress(p => {
                    const {
                        current,
                        visited,
                        end,
                        win,
                        maze,
                    } = p;
                    return !win && !maze[current.x][current.y].wallNorth
                        ? updateProgress(
                            current,
                            visited,
                            c => ({x: c.x - 1, y: c.y}),
                            end,
                            maze
                        )
                        : p;
                });
            } else if (event.key === 'ArrowRight' || swipeDirection === 'right') {
                setProgress(p => {
                    const {
                        current,
                        visited,
                        end,
                        win,
                        maze,
                    } = p;
                    return !win && !maze[current.x][current.y].wallEast
                        ? updateProgress(
                            current,
                            visited,
                            c => ({x: c.x, y: c.y + 1}),
                            end,
                            maze
                        )
                        : p;
                });
            } else if (event.key === 'ArrowDown' || swipeDirection === 'down') {
                setProgress(p => {
                    const {
                        current,
                        visited,
                        end,
                        win,
                        maze,
                    } = p;
                    return !win && !maze[current.x][current.y].wallSouth
                        ? updateProgress(
                            current,
                            visited,
                            c => ({x: c.x + 1, y: c.y}),
                            end,
                            maze
                        )
                        : p;
                    });
            } else if (event.key === 'ArrowLeft' || swipeDirection === 'left') {
                setProgress(p => {
                    const {
                        current,
                        visited,
                        end,
                        win,
                        maze,
                    } = p;
                    return !win && !maze[current.x][current.y].wallWest
                        ? updateProgress(
                            current,
                            visited,
                            c => ({x: c.x, y: c.y - 1}),
                            end,
                            maze,
                        )
                        : p;
                    });
            }
        };
        document.addEventListener("keydown", keyPress);
        document.addEventListener("touchstart", keyPress);
        document.addEventListener("touchend", keyPress);
        return () => {
            document.removeEventListener("keydown", keyPress);
            document.removeEventListener("touchstart", keyPress);
            document.removeEventListener("touchend", keyPress);
        };
    }, [touchStart]);
    return (
        <main
            id="maze-container"
        >
            <Controls
                newMaze={(width, height, ranSE) => {
                    const maze = newMaze(width, height, ranSE);
                    const current = maze.reduce((item, row) => {
                        const found = row.find(c => c.start);
                        return found || item;
                    }, {})
                    const end = maze.reduce((item, row) => {
                        const found = row.find(c => c.end);
                        return found || item;
                    }, {})
                    setProgress(
                        {
                            current,
                            visited: [current],
                            win: false,
                            end,
                            maze,
                        }
                    );
                }}
            />
            <Status
                moves={game.visited.length - 1}
                win={game.win}
            />
            <Maze
                maze={game.maze}
                visited={game.visited}
            />
        </main>
    );
};

export default MazeContainer;
