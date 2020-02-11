import React from 'react'
import { Button, message } from 'antd'
import "style/gomoku.less";

// 创建一个 15X15 数组
const createArray = () => {
  let array = new Array(15);
  for (let i = 0; i < 15; i++) {
    array[i] = new Array(15);
    array[i].fill(false);
  }
  return array;
};

let gameStatus = createArray();


class Gomoku extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spanWidth: "",
      gameWidth: "",
      currentX: null,
      currentY: null,
      current: "black",
      gameEnd: false,
      record: [],
			gameData: createArray(),
			grid: createArray(),
      gameStatus: createArray()
    };
  }
  componentWillMount() {

	}

  componentDidMount() {
		const {grid} = this.state
		grid[3][3] = true
		grid[11][3] = true;
		grid[11][11] = true;
		grid[7][7] = true;
		grid[3][11] = true;

    this.setState({
			grid: grid,
      spanWidth: document.getElementsByTagName("span")[0].offsetWidth - 1,
      gameWidth: document.getElementById("gomoku").offsetWidth
    });
  }

  // 新游戏
  initGame = () => {
    this.setState({
      gameData: createArray(),
      current: "black",
      record: [],
      gameEnd: false
    });
  };

  // 下棋
  active = (currentX, currentY) => {
    let { current, gameData, record, gameEnd } = this.state;
    if (gameEnd) return;
    if (!gameData[currentX][currentY]) {
      gameData[currentX][currentY] = current;
      record.push({
        index: [currentX, currentY],
        current: current
			});

      // 检测是否胜利
      if (
        this.checkRow(current, currentX, currentY) ||
				this.checkCol(current, currentX, currentY) ||
				this.checkLeftSlash(current, currentX, currentY) ||
				this.checkRightSlash(current, currentX, currentY)
      ) {
        message.success(current == "black" ? "黑方赢" : "白方赢");
        this.setState({
          gameEnd: true,
          gameStatus: gameStatus
        });
        return;
      }
      current == "black" ? (current = "white") : (current = "black");
    }

    this.setState({
      current: current,
      record: record,
      gameData: gameData
    });
  };

  // 悔棋
  regret = () => {
    let { gameData, record, current, gameEnd } = this.state;
    if (record.length == 0 || gameEnd) {
      return;
    }
    let last = record.pop();

    gameData[last.index[0]][last.index[1]] = false;
    current = last.current;

    this.setState({
      record: record,
      gameData: gameData,
      current: current
    });
  };

	// 检测列
  checkCol = (piece, x, y) => {
    let { gameData } = this.state;
    let leftNum = 0;
    let rightNum = 0;
    let hasLeft = true;
    let hasRight = true;
    gameStatus[x][y] = "judge";
    for (let n = 1; n < 5; n++) {
      if (x - n > -1 && hasLeft && gameData[x - n][y] == piece) {
        leftNum++;
        gameStatus[x - n][y] = "judge";
      } else {
        hasLeft = false;
      }
      if (x + n < 15 && hasRight && gameData[x + n][y] == piece) {
        rightNum++;
        gameStatus[x + n][y] = "judge";
      } else {
        hasRight = false;
      }
    }

    if (leftNum + rightNum + 1 >= 5) {
      return true;
    } else {
      gameStatus = createArray();
    }
  };

	// 检测行
  checkRow = (piece, x, y) => {
    let { gameData } = this.state;
    let leftNum = 0;
    let rightNum = 0;
    let hasLeft = true;
    let hasRight = true;
    gameStatus[x][y] = "judge";
    for (let n = 1; n < 5; n++) {
      if (y - n > -1 && hasLeft && gameData[x][y - n] == piece) {
        leftNum++;
        gameStatus[x][y - n] = "judge";
      } else {
        hasLeft = false;
      }
      if (y + n < 15 && hasRight && gameData[x][y + n] == piece) {
        rightNum++;
        gameStatus[x][y + n] = "judge";
      } else {
        hasRight = false;
      }
    }

    if (leftNum + rightNum + 1 >= 5) {
      return true;
    } else {
      gameStatus = createArray();
    }
  };

	// 左斜线
  checkLeftSlash = (piece, x, y) => {
    let { gameData } = this.state;
    let leftNum = 0;
    let rightNum = 0;
    let hasLeft = true;
    let hasRight = true;
    gameStatus[x][y] = "judge";
    for (let n = 1; n < 5; n++) {
      if (x - n > -1 && y - n > -1 && hasLeft && gameData[x - n][y - n] == piece) {
        leftNum++;
        gameStatus[x - n][y - n] = "judge";
      } else {
        hasLeft = false;
      }
      if (x + n < 15 && y + n < 15 && hasRight && gameData[x + n][y + n] == piece) {
        rightNum++;
        gameStatus[x + n][y + n] = "judge";
      } else {
        hasRight = false;
      }
    }

    if (leftNum + rightNum + 1 >= 5) {
      return true;
    } else {
      gameStatus = createArray();
    }
	};
	
	// 右斜线
	checkRightSlash = (piece, x, y) => {
    let { gameData } = this.state;
    let leftNum = 0;
    let rightNum = 0;
    let hasLeft = true;
    let hasRight = true;
    gameStatus[x][y] = "judge";
    for (let n = 1; n < 5; n++) {
      if (x + n < 15 && y - n > -1 && hasLeft && gameData[x + n][y - n] == piece) {
        leftNum++;
        gameStatus[x + n][y - n] = "judge";
      } else {
        hasLeft = false;
      }
      if (x - n > -1 && y + n < 15 && hasRight && gameData[x - n][y + n] == piece) {
        rightNum++;
        gameStatus[x - n][y + n] = "judge";
      } else {
        hasRight = false;
      }
    }

    if (leftNum + rightNum + 1 >= 5) {
      return true;
    } else {
      gameStatus = createArray();
    }
  };

  render() {
    const {
      gameData,
      spanWidth,
      gameWidth,
      gameStatus,
      gameEnd,
      record,
			current,
			grid
		} = this.state;

		// 最后一个棋子
    let last = record[record.length - 1];
    // 自适应高度
    const gameStyle = {
      height: gameWidth,
      lineHeight: spanWidth + "px",
      fontSize: spanWidth > 40 ? "22px" : "18px"
    };

    const gameBox = gameData.map((item, index) => (
      <li key={index}>
        {item.map((child, childIndex) => (
          <span key={childIndex} onClick={() => this.active(index, childIndex)}>
						{ grid[index][childIndex] && <i className="grid"></i> }
            {	child && (
              <i
                className={`piece ${child} ${
                  gameEnd && gameStatus[index][childIndex]
                    ? gameStatus[index][childIndex]
                    : ""
                } ${
                  last.index[0] == index && last.index[1] == childIndex
                    ? "last"
                    : ""
                }`}
              ></i>
            )}
          </span>
        ))}
      </li>
    ));
    return (
      <div id="gomoku">
				<h3>五子棋</h3>
				<div className="sideBox">
					<div className="side">
						<span className={`piece black ${current == "black" ? "active" : ""}`} ></span>
						{current == "black" && <span>{gameEnd ? "黑棋胜✌️" : "黑棋下"}</span>}
					</div>
					<div className="text">
						<span>{current == "black" && '👈'}</span>
						<span>VS</span>
						<span>{current == "white" && '👉'}</span>
					</div>
					<div className="side end">
						{current == "white" && <span>{gameEnd ? "白棋胜✌️" : "白棋下"}</span>}
						<span className={`piece white ${current == "white" ? "active" : ""}`} ></span>
					</div>
				</div>
        <div className="checkerboard" style={gameStyle}>
          {gameBox}
        </div>

        <div className="menu">
          <Button type="primary" onClick={this.regret}>
            悔棋
          </Button>
          <Button type="primary" onClick={this.initGame}>
            重新开始
          </Button>
        </div>
      </div>
    );
  }
}

export default Gomoku