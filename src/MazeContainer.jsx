import {
  useState,
  useEffect,
  useRef,
} from 'react';
import Maze from './maze/Maze';
import Controls from './controls/Controls';
import Status from './status/Status';
import {
  generateMaze,
  cellsEqual,
} from './generation/generator';
import {
  updateParams,
} from './urlUtils';
import './MazeContainer.scss';

const updateProgress = (
  progress,
  nextCellFunc,
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
  },
) => {
  const deltaX = startX - endX;
  const deltaY = startY - endY;
  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);
  return (absDeltaX < 1 && absDeltaY < 1)
    ? null
    : absDeltaX > absDeltaY
      ? deltaX < 0
        ? 'right'
        : 'left'
      : deltaY < 0
        ? 'down'
        : 'up';
};

const takeTurn = (wall, moveFunc, updateFunc) => updateFunc((p) => {
  const {
    current,
    win,
    maze,
    interactions,
  } = p;
  return !win && !maze[current.x][current.y][wall]
    ? updateProgress(
      { ...p, interactions: interactions + 1 },
      moveFunc,
    )
    : win
      ? p
      : { ...p, interactions: interactions + 1 };
});

const MazeContainer = (
  {
    initialMaze,
    initialSeed,
    initalRandomSF,
  },
) => {
  const controlsRef = useRef(null);
  const [touchStart, setTouchStart] = useState();
  const [userSeed, setUserSeed] = useState('');
  const [game, setProgress] = useState(() => {
    const current = initialMaze.reduce((item, row) => {
      const found = row.find((c) => c.start);
      return found || item;
    }, {});
    const end = initialMaze.reduce((item, row) => {
      const found = row.find((c) => c.end);
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
      interactions: 0,
      touchStart: null,
    };
  });
  useEffect(() => {
    const keyPress = (event) => {
      const swipeDirection = event.type === 'touchstart' && !controlsRef.current.contains(event.target)
        ? setTouchStart({ // set state return undefined as direction
          x: event.changedTouches[0].screenX,
          y: event.changedTouches[0].screenY,
        })
        : touchStart && event.type === 'touchend'
          ? determineTouchDirection( // return direction of swipe
            touchStart,
            {
              x: event.changedTouches[0].screenX,
              y: event.changedTouches[0].screenY,
            },
          )
          : setTouchStart(null); // set tcouh start to null and return undefined as direction
      if (event.key === 'ArrowUp' || event.key === 'w' || swipeDirection === 'up') {
        takeTurn('wallNorth', (c) => ({ x: c.x - 1, y: c.y }), setProgress);
      } else if (event.key === 'ArrowRight' || event.key === 'd' || swipeDirection === 'right') {
        takeTurn('wallEast', (c) => ({ x: c.x, y: c.y + 1 }), setProgress);
      } else if (event.key === 'ArrowDown' || event.key === 's' || swipeDirection === 'down') {
        takeTurn('wallSouth', (c) => ({ x: c.x + 1, y: c.y }), setProgress);
      } else if (event.key === 'ArrowLeft' || event.key === 'a' || swipeDirection === 'left') {
        takeTurn('wallWest', (c) => ({ x: c.x, y: c.y - 1 }), setProgress);
      }
    };
    document.addEventListener('keydown', keyPress);
    document.addEventListener('touchstart', keyPress);
    document.addEventListener('touchend', keyPress);
    return () => {
      document.removeEventListener('keydown', keyPress);
      document.removeEventListener('touchstart', keyPress);
      document.removeEventListener('touchend', keyPress);
    };
  }, [touchStart]);
  return (
    <main
      id="maze-container"
    >
      <Controls
        elementRef={controlsRef}
        seed={game.seed}
        userSeed={userSeed}
        setUserSeed={setUserSeed}
        width={game.width}
        height={game.height}
        initialRandomSE={initalRandomSF}
        newMaze={(width, height, ranSE, newSeed) => {
          const maze = generateMaze(newSeed, width, height, ranSE);
          const current = maze.reduce((item, row) => {
            const found = row.find((c) => c.start);
            return found || item;
          }, {});
          const end = maze.reduce((item, row) => {
            const found = row.find((c) => c.end);
            return found || item;
          }, {});
          updateParams(
            {
              s: newSeed,
              r: ranSE,
              w: height, // explicitly not height - maze is rotated
              h: width, // explicitly not width - maze is rotated
            },
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
              interactions: 0,
            },
          );
        }}
        restartMaze={() => {
          const {
            maze,
            seed,
          } = game;
          const current = maze.reduce((item, row) => {
            const found = row.find((c) => c.start);
            return found || item;
          }, {});
          const end = maze.reduce((item, row) => {
            const found = row.find((c) => c.end);
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
              interactions: 0,
            },
          );
        }}
      />
      <Status
        moves={game.visited.length - 1}
        wallHits={game.interactions - (game.visited.length - 1)}
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
