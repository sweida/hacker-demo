import React from "react";
import "./App.css";
import { Form, Card, Input, Button, message, Row, Col } from "antd";
import { generateSudoKu } from "./utils/generateData";

let defaultArr = [1, 2, 3, 4, 5, 6, 7, 8, 9]

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spanWidth: "",
      gameWidth: "",
      gameData: [],
      defaultData: [],
      statusArr: [],
      currentIndex: null,
      currentYellow: null,
      currentRed: null,
      marks: []
    };
  }
  componentWillMount() {
    let gameData = generateSudoKu();
    
    let defaultData = [];
    for (let i = 0; i < 9; i++) {
      defaultData.push([]);
      for (let j = 0; j < 9; j++) {
        // 设置难度
        let beanlon = this.setDiffcul(1)
        defaultData[i].push(beanlon);
        if (!beanlon) gameData[i][j] = 0;
      }
    }
    
    this.setState({
      gameData: gameData,
      statusArr: this.createStatus(),
      defaultData: defaultData
    });
  }
  componentDidMount() {
    // 键盘监听
    document.addEventListener("keydown", this.onKeyDown);

    this.setState({
      spanWidth: document.getElementsByTagName("span")[0].offsetWidth - 1,
      gameWidth: document.getElementById("game").offsetWidth
    });
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }

  // 键盘控制方向 左上右下
  onKeyDown = e => {
    let curren = this.state.currentIndex;
    switch (e.keyCode) {
      case 37:
        if (curren % 10 != 0) {
          this.setState({
            currentIndex: curren - 1
          });
        }
        break;
      case 38:
        if (~~(curren / 10) != 0) {
          this.setState({
            currentIndex: curren - 10
          });
        }
        break;
      case 39:
        if (curren % 10 < 8) {
          this.setState({
            currentIndex: curren + 1
          });
        }
        break;
      case 40:
        if (~~(curren / 10) < 8) {
          this.setState({
            currentIndex: curren + 10
          });
        }
        break;
      default:
        if (Number(e.key) < 10) {
          this.setNumber(Number(e.key));
        }
    }
  };

  handleChange = (name, e) => {
    this.setState({
      [name]: e.target.value
    });
  };

  createStatus = () => {
    let status = new Array(9);
    for (let i=0; i<9; i++) {
      status[i] = new Array(9)
      status[i].fill(false);
    }
    return status
  }

  // 选中
  active = (x, y) => {
    const {gameData, statusArr} = this.state
    // 相同数字高亮显示
    for (let i=0; i<9; i++) {
      for (let j=0; j<9; j++) {
        statusArr[i][j] = false
        // 目标高亮
        if (gameData[i][j] == gameData[x][y] && gameData[x][y]!=0) {
          statusArr[i][j] = "commonNum";
        }
      }
    }
    // 行高亮
    statusArr[x].fill("common");
    // 列高亮
    for (let k=0; k<9; k++) {
      statusArr[k][y] = "common";
      console.log(k, y);
    }
    // 宫高亮
    let gridX = ~~(x / 3) * 3;
    let gridY = ~~(y / 3) * 3;
    for (let i=gridX; i<gridX+3; i++) {
      for (let j=gridY; j<gridY+3; j++) {
        statusArr[i][j] = 'common'
      }
    }
    // 目标高亮
    statusArr[x][y] = "active";

    console.log(statusArr);
    
    this.setState({
      currentIndex: x * 10 + y,
      statusArr: statusArr
    });
  };

  // 标记颜色
  addStatus = status => {
    const { defaultData } = this.state;
    let x = ~~(this.state.currentIndex / 10);
    let y = this.state.currentIndex % 10;
    let newStatus = this.state.statusArr;
    if (!defaultData[x][y]) {
      if (this.state.statusArr[x][y] == status) {
        newStatus[x][y] = false;
      } else {
        newStatus[x][y] = status;
      }
      this.setState({
        statusArr: newStatus
      });
    }
  };

  // 设置数字
  setNumber = num => {
    const { defaultData, statusArr } = this.state;
    let x = ~~(this.state.currentIndex / 10);
    let y = this.state.currentIndex % 10;
    let newData = this.state.gameData;
    if (!defaultData[x][y]) {
      newData[x][y] = num;
      statusArr[x][y] = false
      this.setState({
        gameData: newData,
        statusArr: statusArr
      });
    }
    // 填充数字后高亮其它数字
    this.active(x, y)
  };

  // 设置难度系数
  setDiffcul = (num) => {
    return Math.random() > (num * 0.1);
  };

  // 重新开始
  newGame = () => {
    this.componentWillMount();
  };

  // 检测是否填写完整
  checkIsNull = arr => {
    for (let i = 0; i < arr.length; i++) {
      let check = arr[i].every(item => {
        return item > 0;
      });
      if (!check) {
        message.error("请填写完整");
        return false;
      } 
    }
    return true
  };

  checkRow = (arr, row) => {
    let marks = new Array(9);
    marks.fill(true);
    for (let i = 0; i < 9; i++) {
      if (!marks[i]) {
        continue;
      }
      if (arr[i] == 0) {
        marks[i] = 'error';
        continue;
      }
      for (let j = i + 1; j < 9; j++) {
        if (arr[i] == arr[j]) {
          marks[i] = marks[j] = 'error';
        }
      }
    }
    this.setState({
      statusArr: marks
    });
  };
  // 检测是否正确
  checkGame() {
    // 清空选中
    this.setState({
      currentIndex: null
    });
    // let status = this.createStatus()
    let status = new Array(9);
    for (let i=0; i<9; i++) {
      status[i] = new Array(9)
      status[i].fill(false);
    };
    console.log(status);
    
    let { gameData, defaultData } = this.state;

    // 检查行
    for (let i=0; i<9; i++) {
      for (let j=0; j<8; j++) {
        if (status[i][j]=='error') {
          continue;
        }
        for (let row = j + 1; row < 9; row++) {
          if (gameData[i][j] == gameData[i][row]) {
            // status[i][j] = status[i][row] = "error";
            defaultData[i][j]
              ? (status[i][j] = false)
              : (status[i][j] = "error");
            defaultData[i][row]
              ? (status[i][row] = false)
              : (status[i][row] = "error");
          }
        }
      }
    }


    // 检查列
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 8; j++) {
        if (status[i][j] == "error") {
          continue;
        }
        for (let col = j + 1; col < 9; col++) {
          if (gameData[i][j] == gameData[col][j]) {
            defaultData[i][j]
              ? (status[i][j] = false)
              : (status[i][j] = "error");
            defaultData[col][j]
              ? (status[col][j] = false)
              : (status[col][j] = "error");
            // status[i][j] = status[col][j] = "error";
          }
        }
      }
    }
    this.setState({
      statusArr: status
    });
    // this.setState({
    //   statusArr: status
    // });
    // for (let i=0; i<9; i++) {
    //   if (gameData[i][col] == num) {
    //     return false
    //   }
    // }

    // // 检查9宫格
    // let ii = ~~(row / 3);
    // let jj = ~~(col / 3);
    // for (let i = ii * 3; i < ii * 3 + 3; i++) {
    //   for (let j = jj * 3; j < jj * 3 + 3; j++) {
    //     if (gameData[i][j] == num) {
    //       return false;
    //     }
    //   }
    // }

    return true
  }

  // 提交
  submit = () => {
    const { gameData } = this.state;
    if (!this.checkIsNull(gameData)) {
      return false
    }
    this.checkGame()
  };

  render() {
    const {
      gameData,
      spanWidth,
      gameWidth,
      currentIndex,
      defaultData,
      statusArr
    } = this.state;

    // 自适应高度
    const gameStyle = {
      height: gameWidth,
      lineHeight: spanWidth + "px",
      fontSize: spanWidth > 40 ? "20px" : "18px"
    };

    const gameBox = gameData.map((item, index) => (
      <li key={index}>
        {item.map((child, childIndex) => (
          <span
            key={childIndex}
            onClick={() => this.active(index, childIndex)}
            className={`${defaultData[index][childIndex] ? "defalut" : ""} ${
              statusArr[index][childIndex] ? statusArr[index][childIndex] : ''
            }`}
          >
            {child != 0 ? child : ""}
          </span>
        ))}
      </li>
    ));
    const numBox = defaultArr.map((item, index) => (
      <span key={item} onClick={() => this.setNumber(index + 1)}>
        {index + 1}
      </span>
    ));
    return (
      <>
        <h3>数独游戏</h3>
        <div id="game" style={gameStyle}>
          {gameBox}
        </div>
        <div className="numBox">
          {numBox}
          <span onClick={() => this.setNumber(0)}>X</span>
          <span
            className="yellow"
            onClick={() => this.addStatus("yellow")}
          ></span>
          <span className="red" onClick={() => this.addStatus("red")}></span>
        </div>
        <div className="menu">
          <span className="red" onClick={this.newGame}>
            重新开始
          </span>
          <span className="red" onClick={this.submit}>
            提交
          </span>
        </div>
      </>
    );
  }
}


export default App;
