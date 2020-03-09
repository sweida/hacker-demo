import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import classNames from "classnames";
import gomokuLogo from "assets/gomoku_logo.jpg";
import sudokuLogo from "assets/sudoku_logo.jpg";
import game2048Logo from "assets/2048_logo.jpg";
import Reversi from "assets/gomoku_logo.jpg";
import 'style/style.less'

const gameData = [
    {
        name: '五子棋',
        img: gomokuLogo,
        url: 'gomoku'
    }, {
        name: '数独',
        img: sudokuLogo,
        url: 'sudoku'
    }, {
        name: '2048',
        img: game2048Logo,
        url: 'game2048'
    }, {
        name: '黑白棋',
        img: Reversi,
        url: 'reversi'
    }
]

class Index extends Component {
    render() {
        const gameList = gameData.map((item, index) => (
            <Link to={item.url} key={index} className="gameList">
                <img src={item.img} alt=""/>
                <p>{item.name}</p>
            </Link>
        ))
        return (
            <div>
                <h3>小游戏</h3>
                { gameList }
            </div>
        )
    }
}

export default Index