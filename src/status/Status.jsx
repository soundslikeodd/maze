import Timer from './Timer';
import './Status.scss';

const Status = ({
  moves,
  wallHits,
  win,
}) => (
  <div
    id="game-status"
  >
    <div
      id="winning"
    >
      {win && 'You Won'}
    </div>
    <div>
      {win && 'in'}
    </div>
    <div>
      {moves}
      {' '}
      Move
      {moves !== 1 && 's'}
      ,
    </div>
    <div
      key={wallHits}
      className={wallHits > 0 ? 'hit' : ''}
    >
      {wallHits}
      {' '}
      Wall Hit
      {wallHits !== 1 && 's'}
    </div>
    <div>
      {win && 'in'}
    </div>
    <Timer
      started={!!((moves > 0 || wallHits > 0) && !win)}
      reset={!!(moves === 0 && wallHits === 0)}
    />
  </div>
);

export default Status;
