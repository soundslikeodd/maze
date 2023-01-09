import {
    useState,
    useEffect
} from 'react';
import Maze from './maze/Maze';
import Controls from './controls/Controls';
import Status from './status/Status';
import {
    generateMaze,
    cellsEqual
} from './generation/generator';
import {
    updateParams
} from './urlUtils';
import './MazeContainer.scss';

const updateProgress = (
    progress,
    nextCellFunc
) => {
    const {
        current,
        visited,
        end,
    } = progress;
    const nextCell = nextCellFunc(current);
    return {
        ...progress,
        current: nextCell,
        visited: [...visited, nextCell],
        win: cellsEqual(nextCell, end),
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

const MazeContainer = (
    {
        initialMaze,
        initialSeed,
        initalRandomSF,
    }
) => {
    const [touchStart, setTouchStart] = useState();
    const [userSeed, setUserSeed] = useState('');
    const [game, setProgress] = useState(() => {
        const current = initialMaze.reduce((item, row) => {
            const found = row.find(c => c.start);
            return found || item;
        }, {});
        const end = initialMaze.reduce((item, row) => {
            const found = row.find(c => c.end);
            return found || item;
        }, {});
        const width = initialMaze.length;
        const height = initialMaze[0].length;
        return {
            current,
            width,
            height,
            visited: [current],
            win: false,
            end,
            maze: initialMaze,
            seed: initialSeed,
            touchStart: null
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
                        win,
                        maze,
                    } = p;
                    return !win && !maze[current.x][current.y].wallNorth
                        ? updateProgress(
                            p,
                            c => ({x: c.x - 1, y: c.y})
                        )
                        : p;
                });
            } else if (event.key === 'ArrowRight' || swipeDirection === 'right') {
                setProgress(p => {
                    const {
                        current,
                        win,
                        maze,
                    } = p;
                    return !win && !maze[current.x][current.y].wallEast
                        ? updateProgress(
                            p,
                            c => ({x: c.x, y: c.y + 1})
                        )
                        : p;
                });
            } else if (event.key === 'ArrowDown' || swipeDirection === 'down') {
                setProgress(p => {
                    const {
                        current,
                        win,
                        maze,
                    } = p;
                    return !win && !maze[current.x][current.y].wallSouth
                        ? updateProgress(
                            p,
                            c => ({x: c.x + 1, y: c.y})
                        )
                        : p;
                    });
            } else if (event.key === 'ArrowLeft' || swipeDirection === 'left') {
                setProgress(p => {
                    const {
                        current,
                        win,
                        maze,
                    } = p;
                    return !win && !maze[current.x][current.y].wallWest
                        ? updateProgress(
                            p,
                            c => ({x: c.x, y: c.y - 1})
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
                seed={game.seed}
                userSeed={userSeed}
                setUserSeed={setUserSeed}
                width={game.width}
                height={game.height}
                initialRandomSE={initalRandomSF}
                newMaze={(width, height, ranSE, newSeed) => {
                    const maze = generateMaze(newSeed, width, height, ranSE);
                    const current = maze.reduce((item, row) => {
                        const found = row.find(c => c.start);
                        return found || item;
                    }, {});
                    const end = maze.reduce((item, row) => {
                        const found = row.find(c => c.end);
                        return found || item;
                    }, {});
                    updateParams(
                        {
                            s: newSeed,
                            r: ranSE,
                            w: height, // explicitly not height - maze is rotated
                            h: width, // explicitly not width - maze is rotated
                        }
                    );
                    setProgress(
                        {
                            current,
                            visited: [current],
                            win: false,
                            end,
                            maze,
                            seed: newSeed,
                            touchStart: null,
                            width,
                            height,
                        }
                    );
                }}
                restartMaze={() => {
                    const {
                        maze,
                        seed,
                    } = game;
                    const current = maze.reduce((item, row) => {
                        const found = row.find(c => c.start);
                        return found || item;
                    }, {});
                    const end = maze.reduce((item, row) => {
                        const found = row.find(c => c.end);
                        return found || item;
                    }, {});
                    const width = maze.length;
                    const height = maze[0].length;
                    setProgress(
                        {
                            current,
                            visited: [current],
                            win: false,
                            end,
                            maze,
                            seed,
                            touchStart: null,
                            width,
                            height,
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
