import classNames from 'classnames';
import './Cell.scss';

const debug = false;

const Cell = ({
  wallNorth,
  wallEast,
  wallSouth,
  wallWest,
  start,
  end,
  x,
  y,
  current,
  visited = false,
}) => (
  <div
    className={
      classNames(
        'cell',
        {
          'wall-north': wallNorth,
          'wall-east': wallEast,
          'wall-south': wallSouth,
          'wall-west': wallWest,
          start,
          end,
        },
        visited && 'visited',
        current && 'current',
      )
    }
  >
    {debug && `${x}-${y}`}
  </div>
);

export default Cell;
