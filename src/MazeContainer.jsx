import { createBrowserHistory } from 'history';
import {
    useState,
    useEffect
} from 'react';
import { v4 as uuid } from 'uuid';
import Maze from './maze/Maze';
import Controls from './controls/Controls';
import Status from './status/Status';
import {
    generateMaze,
    cellsEqual,
    defaultMazeHeight,
    defaultMazeWidth
} from './generation/generator';
import './MazeContainer.scss';

const history = createBrowserHistory();
const queryStringToObj = qStr => {
    if (qStr.length < 1) return {};
    const qSplit = qStr.includes('&') ? qStr.split('&') : [qStr];
    return qSplit.reduce((acc, i) => ({ ...acc, [i.split('=')[0]]: i.split('=')[1] }), {});
};
const objToQueryString = props => Object.keys(props)
    .reduce(
        (acc, i) => `${acc.length < 1 ? '' : `${acc}&`}${i}=${props[i]}`,
        ''
    );
const updateParams = paramMap => {
    history.replace({
        pathname: history.location.pathname,
        search: objToQueryString(
            {
                ...queryStringToObj(history.location.search.replace('?', '')),
                ...paramMap,
            }
        ),
    });
};

const newMaze = (
    width,
    height,
    ranSE,
    seed
) => generateMaze(seed, width, height, ranSE);

/**
 * initialConfig shape
 * {
 *  s: seed,
 *  w: width,
 *  h: height,
 *  r: random start and finish points
 * }
 */
const initialConfig = queryStringToObj(history.location.search.replace('?', ''));
const initialSeed = initialConfig?.s || uuid();
const validatedWidth = [10, 15].includes(+initialConfig?.w) ? +initialConfig.w : defaultMazeWidth;
const validatedHeight = [10, 15].includes(+initialConfig?.h) ? +initialConfig.h : defaultMazeHeight;
const initalRandomSF = initialConfig?.r === 'true';
const initialMaze = newMaze(
    validatedHeight, // explicitly set to height - maze is roteated
    validatedWidth, // explicitly set to weight - maze is roteated
    initalRandomSF,
    initialSeed
);
updateParams(
    {
        s: initialSeed,
        r: initalRandomSF,
        w: validatedWidth,
        h: validatedHeight,
    }
);

const updateProgress = (
    current,
    visited,
    nextCellFunc,
    end,
    maze,
    seed,
    width,
    height
) => {
    const nextCell = nextCellFunc(current);
    return {
        current: nextCell,
        visited: [...visited, nextCell],
        win: cellsEqual(nextCell, end),
        end,
        maze,
        width,
        height,
        seed,
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
                        visited,
                        end,
                        win,
                        maze,
                        seed,
                        width,
                        height,
                    } = p;
                    return !win && !maze[current.x][current.y].wallNorth
                        ? updateProgress(
                            current,
                            visited,
                            c => ({x: c.x - 1, y: c.y}),
                            end,
                            maze,
                            seed,
                            width,
                            height
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
                        seed,
                        width,
                        height,
                    } = p;
                    return !win && !maze[current.x][current.y].wallEast
                        ? updateProgress(
                            current,
                            visited,
                            c => ({x: c.x, y: c.y + 1}),
                            end,
                            maze,
                            seed,
                            width,
                            height
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
                        seed,
                        width,
                        height,
                    } = p;
                    return !win && !maze[current.x][current.y].wallSouth
                        ? updateProgress(
                            current,
                            visited,
                            c => ({x: c.x + 1, y: c.y}),
                            end,
                            maze,
                            seed,
                            width,
                            height
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
                        seed,
                        width,
                        height,
                    } = p;
                    return !win && !maze[current.x][current.y].wallWest
                        ? updateProgress(
                            current,
                            visited,
                            c => ({x: c.x, y: c.y - 1}),
                            end,
                            maze,
                            seed,
                            width,
                            height
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
                    const maze = newMaze(width, height, ranSE, newSeed);
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
