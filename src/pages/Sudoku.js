import React from "react";
import "style/sudoku.less";
import classNames from "classnames";
import { Button, message, Modal, Select } from "antd";
import { generateSudoKu } from "utils/generateData";

const { Option } = Select;

let defaultArr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
// 创建一个 9X9 数组
const createArray = () => {
  let array = new Array(9);
  for (let i = 0; i < 9; i++) {
    array[i] = new Array(9);
    array[i].fill(false);
  }
  return array;
};
let defalultMarks = createArray()

// 获取宫的原坐标
function getboxesIndex(cellIndex, boxIndex) {
  this.rowIndex = ~~(cellIndex / 3) + ~~(boxIndex / 3) * 3;
  this.colIndex = (cellIndex % 3) + (boxIndex % 3) * 3;
};

class Sudoku extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spanWidth: "",
      gameWidth: "",
      currentIndex: null,
      gameData: [],
      defaultData: [],
      statusArr: [],
      difficulty: "4",
      marksStatus: [],
      currentYellow: null,
      currentRed: null
    };
  }
  componentWillMount() {
    this.initGame();
  }

  componentDidMount() {
    // 键盘监听
    document.addEventListener("keydown", this.onKeyDown);

    this.setState({
      spanWidth: document.getElementsByTagName("span")[0].offsetWidth - 1,
      gameWidth: document.getElementById("sudoku").offsetWidth
    });
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }

  // 键盘控制方向 左上右下
  onKeyDown = e => {
    let curren = this.state.currentIndex;
    let x = ~~(curren / 10);
    let y = curren % 10;

    switch (e.keyCode) {
      case 37:
        if (curren % 10 != 0) {
          this.active(x, y - 1);
        }
        break;
      case 38:
        if (~~(curren / 10) != 0) {
          this.active(x - 1, y);
        }
        break;
      case 39:
        if (curren % 10 < 8) {
          this.active(x, y + 1);
        }
        break;
      case 40:
        if (~~(curren / 10) < 8) {
          this.active(x + 1, y);
        }
        break;
      default:
        if (Number(e.key) < 10) {
          this.setNumber(Number(e.key));
        }
    }
  };

  // 设置难度系数
  setDiffcul = num => {
    return Math.random() > Number(num) * 0.1;
  };

  // 开始游戏
  initGame = () => {
    let gameData = generateSudoKu();
    let defaultData = [];

    for (let i = 0; i < 9; i++) {
      defaultData.push([]);
      for (let j = 0; j < 9; j++) {
        // 设置难度
        let beanlon = this.setDiffcul(this.state.difficulty);
        defaultData[i].push(beanlon);
        if (!beanlon) gameData[i][j] = 0;
      }
    }

    this.setState({
      gameData: gameData,
      statusArr: createArray(),
      defaultData: defaultData,
      marksStatus: createArray()
    });
  };

  successModal = () => {
    Modal.success({
      content: "答案正确！"
    });
  };

  handleSelect = (name, e) => {
    this.setState({
      [name]: e
    }, () => {
      this.initGame();
    });
  };

  // 选中
  active = (x, y) => {
    const { gameData, statusArr } = this.state;

    // 清空选中
    if (statusArr[x][y] == "active") {
      let status = createArray();
      this.setState({
        statusArr: status
      });
      return;
    }

    // 列高亮
    for (let k = 0; k < 9; k++) {
      statusArr[k].fill(false);
      statusArr[k][y] = "common";
    }
    // 行高亮
    statusArr[x].fill("common");
    // 宫高亮
    let gridX = ~~(x / 3) * 3;
    let gridY = ~~(y / 3) * 3;
    for (let i = gridX; i < gridX + 3; i++) {
      for (let j = gridY; j < gridY + 3; j++) {
        statusArr[i][j] = "common";
      }
    }

    // 相同数字高亮显示
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        // 目标高亮
        if (gameData[i][j] == gameData[x][y] && gameData[x][y] != 0) {
          statusArr[i][j] = "commonNum";
        }
      }
    }
    // 目标高亮
    statusArr[x][y] = "active";

    this.setState({
      currentIndex: x * 10 + y,
      statusArr: statusArr
    });
  };

  // 标记颜色 (暂时没用)
  addStatus = status => {
    const { defaultData } = this.state;
    let x = ~~(this.state.currentIndex / 10);
    let y = this.state.currentIndex % 10;

    if (!defaultData[x][y]) {
      if (defalultMarks[x][y] == status) {
        defalultMarks[x][y] = false;
      } else {
        defalultMarks[x][y] = status;
      }
      this.setState({
        marksStatus: defalultMarks
      });
    }
  };

  // 设置数字
  setNumber = num => {
    const { defaultData, statusArr, gameData } = this.state;
    let x = ~~(this.state.currentIndex / 10);
    let y = this.state.currentIndex % 10;

    if (!defaultData[x][y]) {
      gameData[x][y] = num;
      statusArr[x][y] = false;
      this.setState({
        gameData: gameData,
        statusArr: statusArr
      });
    }
    // 填充数字后高亮其它数字
    this.active(x, y);
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
    return true;
  };

  // 开始检测
  checkArray = array => {
    const length = array.length;
    const marks = new Array(length);
    marks.fill(true);

    for (let i = 0; i < length - 1; i++) {
      if (!marks[i]) {
        continue;
      }
      for (let j = i + 1; j < length; j++) {
        if (array[i] == array[j]) {
          marks[i] = marks[j] = "error";
        }
      }
    }
    return marks;
  };

  // 检测行
  checkRows = () => {
    const { gameData } = this.state;
    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
      const rows = gameData[rowIndex];
      const marks = this.checkArray(rows);

      for (let colIndex = 0; colIndex < marks.length; colIndex++) {
        if (marks[colIndex] == "error") {
          defalultMarks[rowIndex][colIndex] = "error";
        }
      }
    }
  };

  // 检测列
  checkCols = () => {
    const { gameData } = this.state;

    for (let colIndex = 0; colIndex < 9; colIndex++) {
      const cols = [];
      for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
        cols[rowIndex] = gameData[rowIndex][colIndex];
      }

      const marks = this.checkArray(cols);
      for (let rowIndex = 0; rowIndex < marks.length; rowIndex++) {
        if (marks[rowIndex] == "error") {
          defalultMarks[rowIndex][colIndex] = "error";
        }
      }
    }
  };

  // 将宫 3X3 转换成一行
  boxsArr = num => {
    const { gameData } = this.state;
    let row = ~~(num / 3) * 3;
    let col = (num % 3) * 3;
    let arrayData = [];
    for (let i = row; i < row + 3; i++) {
      for (let j = col; j < col + 3; j++) {
        arrayData.push(gameData[i][j]);
      }
    }
    return arrayData;
  };

  // 检测宫
  checkBoxs = () => {
    for (let boxIndex = 0; boxIndex < 9; boxIndex++) {
      const boxes = this.boxsArr(boxIndex);
      const marks = this.checkArray(boxes);
      for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
        if (marks[cellIndex] == "error") {
          const { rowIndex, colIndex } = new getboxesIndex(cellIndex, boxIndex);
          defalultMarks[rowIndex][colIndex] = "error";
        }
      }
    }
  };

  // 提交
  submit = () => {
    const { gameData } = this.state;
    if (!this.checkIsNull(gameData)) {
      return false;
    }
    this.setState({
      currentIndex: null,
      statusArr: createArray()
    });

    defalultMarks = createArray();
    this.checkRows();
    this.checkCols();
    this.checkBoxs();
    this.setState({
      marksStatus: defalultMarks
    });
    let isSuccess = defalultMarks.every(row =>
      row.every(mark => mark == false)
    );
    if (isSuccess) {
      this.successModal();
    } else {
      message.error("答案有误！");
    }
  };

  render() {
    const {
      gameData,
      spanWidth,
      gameWidth,
      defaultData,
      statusArr,
      marksStatus,
    } = this.state;

    // 自适应高度
    const gameStyle = {
      height: gameWidth,
      lineHeight: spanWidth + "px",
      fontSize: spanWidth > 40 ? "22px" : "18px"
    };

    const gameBox = gameData.map((item, index) => (
      <li key={index}>
        {item.map((child, childIndex) => (
          <span
            key={childIndex}
            onClick={() => this.active(index, childIndex)}
            className={classNames({
              default: defaultData[index][childIndex],
              [statusArr[index][childIndex]]: statusArr[index][childIndex],
              [marksStatus[index][childIndex]]: marksStatus[index][childIndex]
            })}
          >
            {child != 0 ? child : ""}
          </span>
        ))}
      </li>
    ));
    const numBox = defaultArr.map((item, index) => (
      <Button key={item} onClick={() => this.setNumber(index + 1)}>
        {index + 1}
      </Button>
    ));
    return (
      <>
        <h3>数独游戏</h3>
        <div id="sudoku" style={gameStyle}>
          {gameBox}
        </div>
        <div className="numBox">
          {numBox}
          <Button icon="delete" onClick={() => this.setNumber(0)}></Button>
          <span
            className="yellow"
            onClick={() => this.addStatus("yellow")}
          ></span>
        </div>
        <div className="menu">
          <Select
            defaultValue={this.state.difficulty}
            style={{ width: 100 }}
            onChange={e => this.handleSelect("difficulty", e)}
          >
            <Option value="3">简单模式</Option>
            <Option value="4">普通模式</Option>
            <Option value="5">困难模式</Option>
            <Option value="6">地狱模式</Option>
          </Select>
          <Button type="primary" onClick={this.initGame}>
            重新开始
          </Button>
          <Button type="primary" onClick={this.submit}>
            提交答案
          </Button>
        </div>
      </>
    );
  }
}


export default Sudoku;
