
import Index from 'pages/Index'
import Sudoku from 'pages/Sudoku';
import Gomoku from "pages/Gomoku";
import Game2048 from "pages/game2048";


const router = [
  { path: "/", component: Index },
  { path: "/sudoku", component: Sudoku },
  { path: "/gomoku", component: Gomoku },
  { path: "/game2048", component: Game2048 }
];

export default router