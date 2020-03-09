import React, {Fragment} from "react";
import { Button, message } from "antd";
// import { filpArray, removeEmpty, mergeTile, fillingTile } from 'utils/generate2048'
import { touchTile, removeEmpty, fillingTile } from "utils/generate2048";
import { getTouchDirection } from "utils/scrollDirection";
import classNames from "classnames";
import "style/game2048.less";

const createArray = (data=false) => {
  let array = new Array(4);
  for (let i = 0; i < 4; i++) {
    array[i] = new Array(4);
    array[i].fill(data);
  }
  return array;
};
const getLineData = array => {
  return [].concat(...array);
};

let startX, startY, endX, endY, direction

const arr = [
  [4, 8, 0, 32],
  [512, 256, 16, 2],
  [2048, 8, 128, 64],
  [2, 64, 1024, 4]
];

class Game2048 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameData: createArray(),
            tileData: createArray(0),
            tileStatus: createArray(),
            gameOver: false,
            scores: 3324,
            addScores: 0,
            newTile: [0, 0]
        };
    }
    componentWillMount() {
        this.initGame();
    }


    NavonTouchStart = (e) => {
        startX = e.targetTouches[0].clientX
        startY = e.targetTouches[0].clientY
    }

    NavonTouchEnd = (e) => {
        let {tileData} = this.state
        endX = e.changedTouches[0].clientX
        endY = e.changedTouches[0].clientY

        direction = getTouchDirection(startX, startY, endX, endY)
        console.log(direction, "22222");

        let b = removeEmpty(tileData);
        let c = fillingTile(b, direction);
        let newA = this.newTile(c);
        this.setState({
            tileData: newA,
        })
        // setTimeout(() => {
        //     this.setState({
        //       tileData: newA,
        //     });
        // }, 200)
            
        // });
    }

    // isChange = (oldArray, newArray) => {
    //     return !(String(oldArray) == String(newArray))
    // }
    


    // touchEnd = (e) => {
    //     endx = e.changedTouches[0].pageX;
    //     endy = e.changedTouches[0].pageY;
    //     let direction = getTouchDirection(startx, starty, endx, endy);

    //     let oldTile = []
    //     let newTile = [1]
    //     // console.log(direction, tileData);
    //     let b = removeEmpty(tileData);
    //     console.log(b, 'b');
        
    //     let c = fillingTile(b)
        
    //     // let a = touchTile(c, 'c');   
    //     this.setState({
    //         tileData: c,
    //         lineData: getLineData(c)
    //     }, () => {})    
    //     this.newTile(this.state.tileData)
    //     // if (!String(oldTile) == String(newTile)) {
    //     // }  
    //     console.log(String(c), 'c');
    // }
    
    initGame = () => {
        // let scores = this.state.scores + this.state.addScores;
        // this.setState({
        //     gameOver: false,
        //     scores: scores,
        //     tileData: createArray(0),
        //     lineData: getLineData(createArray(0))
        // })
        let tileData = this.newTile(createArray(0));
        tileData = this.newTile(tileData);
        this.setState({
            gameOver: false,
            tileData: tileData,
        }, () =>{})
        return tileData;
    }
    newGame = () => {
        this.initGame()
        // let tileData = this.newTile(this.state.tileData)
        // this.setState({
        //     addScores: 10,
        //     showAddScores: false,
        //     tileData: tileData,
        //     lineData: getLineData(tileData)
        // })
    }
    randNum = () => {
        return Math.random() >= 0.5 ? 4 : 2;
    }
    // 随机新增一个数字
    newTile = (array) => {
        let emptyArray = []
        for (let i=0; i<array.length; i++) {
            for (let j=0; j<array.length; j++) {
                if (!array[i][j]) {
                    emptyArray.push([i, j])
                }
            }
        }
        let emptyLength = emptyArray.length;
        if (emptyLength > 0) {
            let emptyIndex = Math.floor(Math.random() * emptyLength);
            let x = emptyArray[emptyIndex][0]
            let y = emptyArray[emptyIndex][1]
            array[x][y] = this.randNum();
            this.setState({
                newTile: [x, y]
            });
            console.log(this.state.newTile);
        } else {
            this.setState({
                gameOver: true,
            })
        }
        return array
        // this.setState({
        //     tileData: array,
        //     lineData: getLineData(array)
        // });
    }
    // 游戏是否结束
    isOver(array) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (array[i][j] == 0) {
                    return false;
                }
                // 检查同一行是否有相同的数
                if (i<3) {
                    if(array[i][j] == array[i][j+1]){
                        return false;
                    }
                }
                //检测同一列之间是否有相同
                if (j<3) {
                    if(array[i][j] == array[i+1][j]){
                        return false;
                    }
                }
            }
        }
        return true;
    }
    render() {
        const {
          gameData,
          gameOver,
          scores,
          addScores,
          showAddScores,
          tileData,
          newTile
        } = this.state;
        const lineData = getLineData(tileData)
        // 背景网格
        const gridContainer = gameData.map((item, index) => (
            <li className="grid-row" key={index}>
                {item.map((child, childIndex) => (
                    <span className="grid-cell" key={childIndex}></span>
                ))}
            </li>
        ));
        // 数字瓷砖 不显示0的
        const tileContainer = lineData.map((item, index) => (
            <Fragment key={index}>
                {item != 0 && (
                    <div key={index} className={classNames({
                        'tile': true,
                        [`tile-position-${(index % 4) + 1}-${~~(index / 4) +1}`]: true,
                        'tile-new': (newTile[0] * 4 + newTile[1]) == index
                    })}>
                        <span className={`tile-inner tile-${item}`}>
                        {item}
                        </span>
                    </div>
                )}
            </Fragment>
        ));
        // const tileContainer = lineData.map((item, index) => (
        //     <Fragment key={index}>
        //         {item != 0 && (
        //             <div className={`tile new-tile tile-position-${(index % 4) + 1}-${~~(index / 4) + 1}`} key={index}>
        //                 <span className={`tile-inner tile-${item}`}>
        //                 {item}
        //                 </span>
        //             </div>
        //         )}
        //     </Fragment>
        // ));
        return (
            <div id="game2048">
                <section className="container">
                    <header className="header">
                        <div className="head-container">
                            <h3 className="title">2048</h3>
                            <div className="scores-container">
                                <span>分数</span>
                                <strong>{scores}</strong>
                                {showAddScores && <div className="scores-add">{'+'+addScores}</div>}
                            </div>
                        </div>
                        <div className="gameInfo">
                            <p>将小的方块合成2048方块</p>
                            <Button type="primary game2048" onClick={this.newGame}>重新开始</Button>
                        </div>
                    </header>
                    <main className="game-container">
                        <section className="grid-container">
                            { gridContainer }
                        </section>
                        <section className="tile-container"
                            onTouchStart={this.NavonTouchStart}
                            onTouchEnd={this.NavonTouchEnd}>
                            { tileContainer }
                        </section>
                        { gameOver && (
                            <section className="game-over">
                                <h2>游戏结束</h2>
                                <h3>{scores}分</h3>
                                <Button type="primary game2048" onClick={this.initGame}>再来一次</Button>
                            </section>
                        )}
                    </main>
                </section>
            </div>
        )
    }
}

export default Game2048