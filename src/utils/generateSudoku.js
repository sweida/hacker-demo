class Sudoku {
 
	constructor() {
		this.digits = this.blankMatrix(9);
	}
 
	blankMatrix(size) {
		let newMatrix = [];
		for (let i = 0;i < size;i ++) {
			newMatrix.push([]);
		}
		return newMatrix;
	}
 
	makeDigits() {
		let colLists = this.blankMatrix(9);
		let areaLists = this.blankMatrix(3);
		let nine = this.randNine();
		let i = 0,
			j = 0,
			areaIndex = 0,
			count = 0,
			error = false,
			first = 0;
		for (i = 0;i < 9;i ++) {
			colLists[i].push(nine[i]);
		}
		areaLists[0] = nine.slice(0, 3);
		areaLists[1] = nine.slice(3, 6);
		areaLists[2] = nine.slice(6);
 
		for (i = 0;i < 8;i ++) {
			nine = this.randNine();
			if (i % 3 == 2) {
				areaLists = this.blankMatrix(3);
			}
 
			for (j = 0;j < 9;j ++) {
				areaIndex = Math.floor(j / 3);
				count = 0;
				error = false;
				while (colLists[j].includes(nine[0]) || areaLists[areaIndex].includes(nine[0])) {
					if (++count >= nine.length) {
						error = true;
						break;
					}
					nine.push(nine.shift());
				}
				if (error) return false;
				first = nine.shift();
				colLists[j].push(first);
				areaLists[areaIndex].push(first);
			}
		}
		this.digits = colLists;
		return true;
	}
 
	randNine() {
		const nine = this.nine();
		let index = 0;
 
		for (let i = 0;i < 5;i ++) {
			index = this.randIndex();
			[nine[0], nine[index]] = [nine[index], nine[0]];
		}
 
		return nine;
	}
 
	nine() {
		return [1, 2, 3, 4, 5, 6, 7, 8, 9];
	}
 
	randIndex() {
		return Math.floor(Math.random() * 9);
	}
}
 
export const generateSudoKu = () => {
	let sudoku = new Sudoku();
	const start = Date.now();
	while (!sudoku.makeDigits());
	const end = Date.now();
	// console.log(end - start);
	// console.log(sudoku.digits);
	return sudoku.digits;
}
