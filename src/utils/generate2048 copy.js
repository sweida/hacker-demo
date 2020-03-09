var my2048;
var rows = 4;
var cols = 4;
var squareWidth = 100;
var spacing = 12;
var boardSet = [];
var squareSet = [];
var valueMap = [];
var colorMapping = {
  "0": "#ccc0b3",
  "2": "#eee4da",
  "4": "#ede0c8",
  "8": "#f2b179",
  "16": "#f59563",
  "32": "#f67e5f",
  "64": "#f65e3b",
  "128": "#edcf72",
  "256": "#edcc61",
  "512": "#9c0",
  "1024": "#33b5e5",
  "2048": "#09c"
};
var directionEnum = {
  left: { x: -1, y: 0, key: "left" },
  right: { x: 1, y: 0, key: "left" },
  top: { x: 0, y: -1, key: "top" },
  down: { x: 0, y: 1, key: "top" }
};
var lock = true;
var isChange = false;
function move(direction) {
  if (isOver()) {
    alert("game over ~!");
    return;
  }
  var newSquareSet = analysisActions(direction);
  setTimeout(function() {
    refresh(newSquareSet);
    if (isChange) {
      randGenerateSquare();
    }
    lock = true;
    isChange = false;
  }, 300);
}
function analysisActions(direction) {
  var newSquareSet = generateNullMap();
  if (direction == directionEnum.left) {
    console.log("向左");
    for (var i = 0; i < squareSet.length; i++) {
      var temp = [];
      for (var j = 0; j < squareSet[i].length; j++) {
        if (squareSet[i][j] != null) {
          temp.push(squareSet[i][j]);
        }
      }
      temp = getNewLocation(temp);
      for (var k = 0; k < newSquareSet[i].length; k++) {
        if (temp[k]) {
          newSquareSet[i][k] = temp[k];
        }
      }
    }
  } else if (direction == directionEnum.right) {
    console.log("向右");
    for (var i = 0; i < squareSet.length; i++) {
      var temp = [];
      for (var j = squareSet[i].length - 1; j >= 0; j--) {
        if (squareSet[i][j] != null) {
          temp.push(squareSet[i][j]);
        }
      }
      temp = getNewLocation(temp);
      for (var k = newSquareSet[i].length - 1; k >= 0; k--) {
        if (temp[newSquareSet[i].length - 1 - k]) {
          newSquareSet[i][k] = temp[newSquareSet[i].length - 1 - k];
        }
      }
    }
  } else if (direction == directionEnum.top) {
    console.log("向前");
    for (var j = 0; j < squareSet[0].length; j++) {
      var temp = [];
      for (var i = 0; i < squareSet.length; i++) {
        if (squareSet[i][j] != null) {
          temp.push(squareSet[i][j]);
        }
      }
      temp = getNewLocation(temp);
      for (var k = 0; k < newSquareSet.length; k++) {
        if (temp[k]) {
          newSquareSet[k][j] = temp[k];
        }
      }
    }
  } else {
    console.log("向后");
    for (var j = 0; j < squareSet[0].length; j++) {
      var temp = [];
      for (var i = squareSet.length - 1; i >= 0; i--) {
        if (squareSet[i][j] != null) {
          temp.push(squareSet[i][j]);
        }
      }
      temp = getNewLocation(temp);
      for (var k = newSquareSet.length - 1; k >= 0; k--) {
        if (temp[newSquareSet.length - 1 - k]) {
          newSquareSet[k][j] = temp[newSquareSet.length - 1 - k];
        }
      }
    }
  }
  for (var i = 0; i < newSquareSet.length; i++) {
    for (var j = 0; j < newSquareSet[i].length; j++) {
      if (newSquareSet[i][j] == null) {
        continue;
      }
      newSquareSet[i][j].style.transition = direction.key + " 0.3s";
      newSquareSet[i][j].style.left =
        (j + 1) * spacing + j * squareWidth + "px";
      newSquareSet[i][j].style.top = (i + 1) * spacing + i * squareWidth + "px";
      if (newSquareSet[i][j].nextSquare) {
        newSquareSet[i][j].nextSquare.style.transition =
          direction.key + " 0.3s";
        newSquareSet[i][j].nextSquare.style.left =
          (j + 1) * spacing + j * squareWidth + "px";
        newSquareSet[i][j].nextSquare.style.top =
          (i + 1) * spacing + i * squareWidth + "px";
      }
    }
  }
  return newSquareSet;
}
function getNewLocation(arr) {
  if (arr.length == 0) {
    return [];
  }
  var temp = [];
  temp.push(arr[0]);
  for (var i = 1; i < arr.length; i++) {
    if (
      arr[i].num == temp[temp.length - 1].num &&
      (!temp[temp.length - 1].nextSquare ||
        temp[temp.length - 1].nextSquare == null)
    ) {
      temp[temp.length - 1].nextSquare = arr[i];
    } else {
      temp.push(arr[i]);
    }
  }
  return temp;
}
function generateNullMap() {
  var newValueMap = [];
  for (var i = 0; i < rows; i++) {
    newValueMap[i] = [];
    for (var j = 0; j < cols; j++) {
      newValueMap[i][j] = null;
    }
  }
  return newValueMap;
}
function isOver() {
  for (var i = 0; i < squareSet.length; i++) {
    for (var j = 0; j < squareSet[i].length; j++) {
      if (squareSet[i][j] == null) {
        return false;
      }
      if (
        (squareSet[i][j + 1] &&
          squareSet[i][j].num == squareSet[i][j + 1].num) ||
        (squareSet[i + 1] &&
          squareSet[i + 1][j] &&
          squareSet[i][j].num == squareSet[i + 1][j].num)
      ) {
        return false;
      }
    }
  }
  return true;
}
function refresh(newSquareSet) {
  squareSet = generateNullMap();
  var newValueMap = generateNullMap();
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      if (newSquareSet[i][j]) {
        if (newSquareSet[i][j].nextSquare) {
          var temp = createSquare(
            newSquareSet[i][j].num * 2,
            newSquareSet[i][j].offsetLeft,
            newSquareSet[i][j].offsetTop,
            i,
            j
          );
          squareSet[i][j] = temp;
          my2048.append(temp);
          my2048.removeChild(newSquareSet[i][j].nextSquare);
          my2048.removeChild(newSquareSet[i][j]);
        } else {
          var temp = createSquare(
            newSquareSet[i][j].num,
            newSquareSet[i][j].offsetLeft,
            newSquareSet[i][j].offsetTop,
            i,
            j
          );
          squareSet[i][j] = temp;
          my2048.append(temp);
          my2048.removeChild(newSquareSet[i][j]);
        }
        if (valueMap[i][j] != squareSet[i][j].num) {
          isChange = true;
        }
        newValueMap[i][j] = squareSet[i][j].num;
      } else {
        newValueMap[i][j] = 0;
      }
    }
  }
  valueMap = newValueMap;
}
function randSquareNum() {
  return Math.random() >= 0.5 ? 4 : 2;
}
function randGenerateSquare() {
  for (;;) {
    var randRow = Math.floor(Math.random() * rows);
    var randCol = Math.floor(Math.random() * cols);
    if (valueMap[randRow][randCol] == 0) {
      var temp = createSquare(
        randSquareNum(),
        randCol * squareWidth + (randCol + 1) * spacing,
        randRow * squareWidth + (randRow + 1) * spacing,
        randRow,
        randCol
      );
      valueMap[temp.row][temp.col] = temp.num;
      squareSet[temp.row][temp.col] = temp;
      my2048.appendChild(temp);
      return true;
    }
  }
}
function createSquare(value, left, top, row, col) {
  var temp = document.createElement("div");
  temp.style.width = squareWidth + "px";
  temp.style.height = squareWidth + "px";
  temp.style.left = left + "px";
  temp.style.top = top + "px";
  temp.style.background = colorMapping[value];
  temp.style.lineHeight = squareWidth + "px";
  temp.style.textAlign = "center";
  temp.style.fontSize = 0.4 * squareWidth + "px";
  temp.num = value;
  temp.row = row;
  temp.col = col;
  if (value > 0) {
    temp.innerHTML = "" + value;
  }
  return temp;
}
function initBoard() {
  my2048 = document.getElementById("my2048");
  my2048.style.width = cols * squareWidth + (cols + 1) * spacing + "px";
  my2048.style.height = rows * squareWidth + (rows + 1) * spacing + "px";
}
function init() {
  initBoard();
  for (var i = 0; i < rows; i++) {
    boardSet[i] = [];
    valueMap[i] = [];
    squareSet[i] = [];
    for (var j = 0; j < cols; j++) {
      valueMap[i][j] = 0;
      squareSet[i][j] = null;
      boardSet[i][j] = createSquare(
        0,
        j * squareWidth + (j + 1) * spacing,
        i * squareWidth + (i + 1) * spacing,
        i,
        j
      );
      my2048.appendChild(boardSet[i][j]);
    }
  }
  randGenerateSquare();
  randGenerateSquare();
  document.addEventListener("keydown", function(e) {
    if (!lock) return;
    lock = false;
    switch (e.key) {
      case "ArrowUp":
        move(directionEnum.top);
        break;
      case "ArrowDown":
        move(directionEnum.down);
        break;
      case "ArrowLeft":
        move(directionEnum.left);
        break;
      case "ArrowRight":
        move(directionEnum.right);
        break;
      default: {
        lock = true;
      }
    }
  });
}
window.onload = function() {
  init();
};
