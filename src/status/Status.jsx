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
            {moves} Move{moves !== 1 && 's'},
        </div>
        <div
            key={wallHits}
            className={wallHits > 0 ? 'hit' : ''}
        >
            {wallHits} Wall Hit{wallHits !== 1 && 's'}
        </div>
    </div>
);

export default Status;
