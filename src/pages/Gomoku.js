import React from 'react'
import "style/gomoku.less";

// 创建一个 16X6 数组
const createArray = () => {
  let array = new Array(16);
  for (let i = 0; i < 16; i++) {
    array[i] = new Array(16);
    array[i].fill(false);
  }
  return array;
};


class Gomoku extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spanWidth: "",
      gameWidth: "",
      gameData: createArray()
    };
  }
  componentWillMount() {
	}
	
	componentDidMount() {
		this.setState({
      spanWidth: document.getElementsByTagName("span")[0].offsetWidth - 1,
      gameWidth: document.getElementById("gomoku").offsetWidth
    });
	}
	
	active = () => {
		console.log(222);
		
	}

  render() {
		const { gameData, spanWidth, gameWidth } = this.state;

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
          >
						<i className="piece black"></i>
          </span>
        ))}
      </li>
    ));
    return (
      <div id="gomoku" style={gameStyle}>
        {gameBox}
        <h1>Gomoku</h1>
      </div>
    );
  }
}

export default Gomoku