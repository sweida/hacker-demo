// 检测行是否正确
const checkRow = (arr, row) => {
  let length = 9;
  let marks = new Array(length);
  marks.fill(true);

  for (let i = 0; i < length - 1; i++) {
    if (!marks[i]) {
      continue;
    }
    if (arr[i] == 0) {
      marks[i] = false;
      continue;
    }
    for (let j = i + 1; j < length; j++) {
      if (arr[i] == arr[j]) {
        marks[i] = marks[j] = false;
      }
    }
  }
};

// 检测列是否正确
const checkLine = (arr, col) => {
	for (var j = 0; j < 8; j++) {
		if (arr[j][col] == 0) {
			continue;
		}
		for (var k = j + 1; k < 9; k++) {
			if (arr[j][col] == arr[k][col]) {
				return false;
			}
		}
	}
	return true;
}


// 检测3X3宫是否符合
const checkNine = (arr, row, col) => {
	// 获得左上角的坐标
	var j = Math.floor(row / 3) * 3;
	var k = Math.floor(col / 3) * 3;
	// 循环比较
	for (var i = 0; i < 8; i++) {
		if (arr[j + Math.floor(i / 3)][k + i % 3] == 0) {
			continue;
		}
		for (var m = i + 1; m < 9; m++) {
			if (arr[j + Math.floor(i / 3)][k + Math.round(i % 3)] == arr[j + Math.floor(m / 3)][k + Math.round(m % 3)]) {
				return false;
			}
		}
	}
	return true;
}
