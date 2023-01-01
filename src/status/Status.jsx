import './Status.scss';

const Status = ({
    moves,
    win,
}) => (
    <div
        id="game-status"
    >
        <div 
            id="winning"
        >
            {win && 'You Won!'}
        </div>
        <div>
            {win && 'in'}
        </div>
        <div>
            {moves} Moves
        </div>
    </div>
);

export default Status;
