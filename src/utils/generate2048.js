// 对角线翻转数组
export const filpArray = (array) => {
    let newArray = []
    for (let i=0; i<4; i++) {
        let temp = []
        for (let j=0; j<4; j++) {
            temp.push(array[j][i])
        }
        newArray.push(temp)
    }
    return newArray
}

export const touchTile = (array, direction) => {
    if (direction == "up" || direction == "down") {
      array = filpArray(array);
    }
    return removeEmpty(array);
}

// 去除0
export const removeEmpty = (array) => {
    let newArray = []
    for (let i=0; i<array.length;i++) {
        let temp = []
        for (let j=0; j<array[i].length; j++) {
            array[i][j] && temp.push(array[i][j])
        }
        newArray.push(temp)
    }
    return newArray;
}

// 相同数字合并
export const mergeTile = (array, direction='left') => {
    for (let i=0; i<array.length; i++) {
        for (let j=0; j<array[i].length; j++) {
            if (array[i][j] == array[i][j+1]) {
                // 左滑
                if (direction == 'left' || direction == 'up') {
                    array[i][j] = array[i][j] * 2
                    array[i][j+1] = 0
                    j++
                }
                // 右滑
                if (direction == 'right' || direction == 'down') {
                    array[i][j+1] = array[i][j+1] * 2
                    array[i][j] = 0
                    j++
                }
            }
        }
	}
	return array
    // return fillingTile(removeEmpty(array), direction);
}

// 填充0
export const fillingTile = (array, direction='left') => {
    for (let i=0; i<array.length; i++) {
        let iLength = array[i].length
        if (iLength<4) {
            let emptyArray = new Array(4 - iLength);
            emptyArray.fill(0)
            // 左滑后面补0
            if (direction == 'left' || direction == 'up') {
                array[i].push(...emptyArray)
            }
            // 右滑前面补0
            if (direction == 'right' || direction == 'down') {
                array[i].unshift(...emptyArray)
            }
        }
    }
    return array
}

// 滑动前后是否有变化
export const isChange = (oldArray, newArray) => {
	return !(String(oldArray) == String(newArray))
}

// mergeTile(touchDirection(gameData, "up"), "up");




// 去0 => 合并 => 去0 => 补0

// up 上滑，对角翻转后和left一致
