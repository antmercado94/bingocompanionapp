import { useContext, useEffect } from 'react';
import { GameContext } from '../../Contexts/GameContext';

const NumberPicker = () => {
	const {
		calledNumbers,
		setCalledNumbers,
		callableNumbers,
		setCallableNumbers,
		isWinner,
	} = useContext(GameContext);
	let maxNumbers = 75; // 75-Ball Bingo

	useEffect(() => {
		if (calledNumbers.length > 0) {
			/** filter last called number out of 'callableNumbers' array */
			const currentNumber = calledNumbers[calledNumbers.length - 1];
			const currentColumn = currentNumber[0];
			const newArray = callableNumbers.slice();

			newArray[currentColumn] = callableNumbers[currentColumn].filter(
				(number) => number !== currentNumber[1]
			);
			setCallableNumbers(newArray);
		}
	}, [calledNumbers]);

	/* set a random available number to 'calledNumbers' state */
	const handleClick = () => {
		let currentNumEl = document.getElementById('currentNum');
		let columns = [0, 1, 2, 3, 4]; // B,I,N,G,O columns respectively

		/** restart current number animation */
		if (currentNumEl && !isWinner) {
			currentNumEl.classList.remove('numbers__current--animate');
			void currentNumEl.offsetWidth;
			currentNumEl.classList.add('numbers__current--animate');
		}

		/** filter out value from 'columns' when matching 'callableNumbers' index is empty */
		callableNumbers.forEach((array, index) => {
			switch (index) {
				case 0:
					if (array.length === 0)
						columns = columns.filter((col) => !col.toString().includes(index));
					break;
				case 1:
					if (array.length === 0)
						columns = columns.filter((col) => !col.toString().includes(index));
					break;
				case 2:
					if (array.length === 0)
						columns = columns.filter((col) => !col.toString().includes(index));
					break;
				case 3:
					if (array.length === 0)
						columns = columns.filter((col) => !col.toString().includes(index));
					break;
				case 4:
					if (array.length === 0)
						columns = columns.filter((col) => !col.toString().includes(index));
					break;
				default:
					break;
			}
		});

		if (columns.length > 0) {
			const randomColumn = columns[Math.floor(Math.random() * columns.length)];
			const randomNumber =
				callableNumbers[randomColumn][
					Math.floor(Math.random() * callableNumbers[randomColumn].length)
				];

			setCalledNumbers([...calledNumbers, [randomColumn, randomNumber]]);
		} else {
			/** no more columns available */
			console.log('done');
		}
	};
	return (
		<button
			onClick={handleClick}
			className='b-buttons__btn b-buttons__btn--icon btn--interface bg-red-400 bs-300'
			disabled={
				calledNumbers.length < maxNumbers && callableNumbers !== null
					? ''
					: 'disabled'
			}
		></button>
	);
};

export default NumberPicker;
