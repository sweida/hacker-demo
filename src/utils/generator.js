function generateArr() {
  var arr = [];
  for (var i = 0; i < 9; i++) {
    arr[i] = new Array(9);
    arr[i].fill(0);
  }
  return arr;
}

class Generator {
  generate() {
		this.matrix = generateArr();

    for (let n = 1; n <= 9; n++) {
      this.fillNumber(n);
    }
  }

  fillNumber(n) {
    this.fillRow(n, 0);
  }

  fillRow(n, rowIndex) {
    if (rowIndex > 8) {
			return true
		}
		
		const row = this.matrix[rowIndex]
		// todo随机选择列

		for (let i=0; i<9; i++) {
			const colIndex = i
			// 如果这个位置已经有值，跳过
			if (row[colIndex]) {
				continue
			}

			// 检查这个位置是否可以填n
			// if (true) {
			// 	continue
			// }

			row[colIndex] = n

			// 当前行填写 n 成功，递归调用 fillRow() 来下一行中填写 n
			if (!this.fillRow(n, rowIndex+1)) {
				row[colIndex] = 0
				continue
			}
			return true
		}

		return false
		// this.fillRow(n, rowIndex+1)
  }
}
