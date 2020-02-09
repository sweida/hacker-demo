// import Home from '../views/home'
// import Login from 'pages/sign/login'
import Sudoku from '../pages/Sudoku';
import Gomoku from "../pages/Gomoku";


const router = [
  { path: "/", component: Sudoku },
  { path: "/gomoku", component: Gomoku }
];

export default router