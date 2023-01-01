import { createRoot } from 'react-dom/client';
import MazeContainer from './MazeContainer';

const root = createRoot(document.getElementById('maze-app'));
root.render(<MazeContainer />);
