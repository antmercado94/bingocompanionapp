import { useContext, useEffect, useState } from 'react';
import { GameContext } from '../../Contexts/GameContext';
import WinBox from '../WinBox';

const WinMatch = () => {
	const { matching, setIsWinner, isWinner } = useContext(GameContext);
	const [winConditions, setWinConditions] = useState({
		rows: [],
		columns: [],
		diagonals: [],
	});
	const freeSpace = 12; // index 12 in bingo grid array
	const rowMatches = [],
		columnMatches = [],
		diagonalMatches = [];

	/* sort values in 'matching' into rows, columns, and diagonal matches */
	useEffect(() => {
		if (matching.length > 0) {
			matching.forEach((match) => {
				/** check rows (startingX) */
				if (match.startingX) {
					const startingX = match.index,
						row = {
							row: startingX, // index 0, 5, 10, 15, or 20
							values: startingX > 9 && startingX <= 14 ? [freeSpace] : [],
						};
					/** check every match */
					for (let i = 0; i < matching.length; i++) {
						const matchingIndex = matching[i].index;
						/** find matching within same row as 'startingX' index */
						if (matchingIndex >= startingX && matchingIndex <= startingX + 4)
							row.values.push(matchingIndex);
					}
					/** sort and push row matches */
					row.values = row.values.sort((a, b) => a - b);
					rowMatches.push(row);
				}

				/** check columns (startingY) */
				if (match.startingY) {
					const column = {
						column: match.column, // values 'b', 'i', 'n', 'g' or 'o';
						values: match.column === 'n' ? [freeSpace] : [],
					};
					/** check every match */
					for (let i = 0; i < matching.length; i++) {
						/** find matching with the same column value as 'startingY' column */
						if (matching[i].column === match.column)
							column.values.push(matching[i].index);
					}
					/** sort and push column matches */
					column.values = column.values.sort((a, b) => a - b);
					columnMatches.push(column);
				}

				/** check diagonals (startingD) */
				if (match.startingD) {
					const diag = match.index,
						diagonal = {
							diagonal: diag, // index 0 or 4
							values: [freeSpace],
						};
					if (diag === 0) {
						/** check every match */
						for (let i = 0; i < matching.length; i++) {
							const indexZeroCells = 24; // cells after index 0
							let n = 0;
							while (n <= indexZeroCells) {
								/** find matching of index with multiples of 6 */
								if (matching[i].index === diag + n)
									diagonal.values.push(matching[i].index);

								n += 6; // increment in relation to every 6th index (diagonally)
							}
						}
					}
					if (diag === 4) {
						/** check every match */
						for (let i = 0; i < matching.length; i++) {
							const indexFourCells = 20; // cells after index 4
							let n = 4;
							while (n <= indexFourCells) {
								/** find matching of index with multiples of 4 */
								if (matching[i].index === n)
									diagonal.values.push(matching[i].index);

								n += 4; // increment in relation to every 4th index (diagonally)
							}
						}
					}
					/** sort and push diagonal matches */
					diagonal.values = diagonal.values.sort((a, b) => a - b);
					diagonalMatches.push(diagonal);
				}
			});
			/** set all row, column, diagonal matches to state */
			setWinConditions({
				...winConditions,
				rows: rowMatches,
				columns: columnMatches,
				diagonals: diagonalMatches,
			});
		}
	}, [matching]);

	/* set winner, display winBox */
	const toggleWin = () => {
		setIsWinner(true);
	};

	/* check for winning condition */
	useEffect(() => {
		const cells = document.querySelectorAll('.b-grid__nbr');
		const gameBtns = document.querySelectorAll('.b-buttons__btn');
		let matchingRowCells = winConditions.rows,
			matchingColCells = winConditions.columns,
			matchingDiagCells = winConditions.diagonals;
		const matchesToWin = 5;

		/** row win */
		for (let i = 0; i < matchingRowCells.length; i++) {
			if (matchingRowCells[i].values.length === matchesToWin) {
				/** add class to winning match cells */
				let matchIndexVals = matchingRowCells[i].values;
				matchIndexVals.forEach((matchIndex) => {
					if (!isWinner) {
						cells[matchIndex].classList.add('b-grid__winMatch--animate');
					}
				});
				/** disable game btns */
				gameBtns.forEach((btn) => {
					btn.setAttribute('disabled', '');
				});
				/** set winner after 5s */
				!isWinner && setTimeout(toggleWin, 5000);
			}
		}
		/** column win */
		for (let i = 0; i < matchingColCells.length; i++) {
			if (matchingColCells[i].values.length === matchesToWin) {
				/** add class to winning match cells */
				let matchIndexVals = matchingColCells[i].values;
				matchIndexVals.forEach((matchIndex) => {
					if (!isWinner) {
						cells[matchIndex].classList.add('b-grid__winMatch--animate');
					}
				});
				/** disable game btns */
				gameBtns.forEach((btn) => {
					btn.setAttribute('disabled', '');
				});
				/** set winner after 5s */
				!isWinner && setTimeout(toggleWin, 5000);
			}
		}
		/** diagonal win */
		for (let i = 0; i < matchingDiagCells.length; i++) {
			if (matchingDiagCells[i].values.length === matchesToWin) {
				/** add class to winning match cells */
				let matchIndexVals = matchingDiagCells[i].values;
				matchIndexVals.forEach((matchIndex) => {
					if (!isWinner) {
						cells[matchIndex].classList.add('b-grid__winMatch--animate');
					}
				});
				/** disable game btns */
				gameBtns.forEach((btn) => {
					btn.setAttribute('disabled', '');
				});
				/** set winner after 5s */
				!isWinner && setTimeout(toggleWin, 5000);
			}
		}
	}, [winConditions]);

	return <WinBox winConditions={winConditions} />;
};

export default WinMatch;
