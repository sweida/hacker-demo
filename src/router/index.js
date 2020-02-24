
import Index from 'pages/Index'
import Sudoku from 'pages/Sudoku';
import Gomoku from "pages/Gomoku";


const router = [
  { path: "/", component: Index },
  { path: "/sudoku", component: Sudoku },
  { path: "/gomoku", component: Gomoku }
];

export default router