import React from "react";
import "./App.css";
import { Form, Card, Input, Button, message, Row, Col } from "antd";

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
    // 键盘监听
    document.addEventListener("keydown", this.onKeyDown);

    let gameData = [];
    let status = [];
    let defaultData = [];
    for (let i = 0; i < 9; i++) {
      gameData.push([]);
      status.push([]);
      defaultData.push([]);
      for (let j = 1; j < 10; j++) {
        status[i].push(false);
        let beanlon = Math.random() > 0.5;
        defaultData[i].push(beanlon);
        gameData[i].push(j);
        // beanlon ? gameData[i].push(j) : gameData[i].push(0);
        // if (defaultData[i][j]) {
        // } else {
        //   gameData[i].push(0);
        // }
      }
      this.shuffle(gameData[i]);
    }
    this.setState({
      gameData: gameData,
      statusArr: status,
      defaultData: defaultData
    });
  }
  componentDidMount() {
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

  shuffle = arr => {
    arr.sort(() => Math.random() - 0.5);
    return arr;
  };

  // 选中
  active = (x, y) => {
    const { defaultData } = this.state;
    if (!defaultData[x][y]) {
      this.setState({
        currentIndex: x * 10 + y
      });
    }
  };

  // 标记颜色
  addStatus = status => {
    const { defaultData } = this.state;
    let x = ~~(this.state.currentIndex / 10);
    let y = this.state.currentIndex % 10;
    let newRed = this.state.statusArr;
    if (!defaultData[x][y]) {
      if (this.state.statusArr[x][y] == status) {
        newRed[x][y] = false;
      } else {
        newRed[x][y] = status;
      }
      this.setState({
        statusArr: newRed
      });
    }
  };

  // 设置数字
  setNumber = num => {
    const { defaultData } = this.state;
    let x = ~~(this.state.currentIndex / 10);
    let y = this.state.currentIndex % 10;
    let newData = this.state.gameData;
    if (!defaultData[x][y]) {
      newData[x][y] = num;
      this.setState({
        gameData: newData
      });
    }
  };

  // 设置难度系数
  setDiffcul = () => {};

  // 重新开始
  newGame = () => {
    this.componentWillMount();
  };

  // 检测是否正确
  checker = arr => {
    let length = 9;
    let marks = new Array(length);
    marks.fill(true);

    for (let i = 0; i < length - 1; i++) {
      if (!marks[i]) {
        continue;
      }
      const v = arr[i];
      if (v == 0) {
        marks[i] = false;
        continue;
      }
      for (let j = i + 1; j < length; j++) {
        if (v == arr[j]) {
          marks[i] = marks[j] = false;
        }
      }
    }
    this.setState({
      marks: marks
    });
    console.log(this.state.marks, 222);
  };
  // 提交
  submit = () => {
    const { gameData } = this.state;
    // 检测是否填写完整
    for (let i=0; i<gameData.length; i++) {
      let check = gameData[i].every(item => {
        return item > 0;
      });
      if (!check) {
        message.error("请填写完整");
        return false;
      }
    }
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
              currentIndex == index * 10 + childIndex ? "active" : ""
            } ${
              statusArr[index][childIndex] == "red"
                ? "red"
                : statusArr[index][childIndex] == "yellow"
                ? "yellow"
                : ""
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
