import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import classNames from "classnames";
import gomokuLogo from 'assets/gomoku_logo.jpeg'
import sudokuLogo from "assets/sudoku_logo.jpeg";
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