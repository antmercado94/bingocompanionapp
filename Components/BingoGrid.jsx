import { useContext, useEffect, useState } from 'react';
import { GameContext } from '../Contexts/GameContext';
import useFetch from './Hooks/useFetch';
import logoIMG from '../Assets/svg/bingo-logo.svg';
import Loading from './Interface/Loading';

const BingoGrid = () => {
	const { data } = useFetch('/api/cells');
	const {
		calledNumbers,
		setMatching,
		columns,
		bingoGrid,
		setBingoGrid,
		isWinner,
		error,
		state,
	} = useContext(GameContext);
	const { isPaused } = state.gameStatus;
	const [isReady, setIsReady] = useState(false);
	const matchingCells = [];
	const animateClass = !isWinner && !isPaused ? 'b-grid__match--animate' : '';

	/* fetch data to populate grid */
	useEffect(() => {
		if (isPaused || bingoGrid.length > 0) {
			setIsReady(true);
			return;
		}
		if (data) {
			setBingoGrid(data.cells);
			setIsReady(true);
		}
	}, [data]);

	/* check for matching between 'calledNumbers' and 'bingoGrid' */
	useEffect(() => {
		calledNumbers.length &&
			bingoGrid.forEach((cell, index) => {
				for (let i = 0; i < calledNumbers.length; i++) {
					const calledNumCol = calledNumbers[i][0];
					const calledNumVal = calledNumbers[i][1];
					/** check for matching column and value */
					if (calledNumCol === cell.column && calledNumVal === cell.value) {
						matchingCells.push({
							column: columns[cell.column],
							value: cell.value,
							index: index,
							startingX: [0, 5, 10, 15, 20].includes(index) ? true : false,
							startingY: [0, 1, 2, 3, 4].includes(index) ? true : false,
							startingD: [0, 4].includes(index) ? true : false,
						});
						/** set match of cell to true */
						cell.match = true;
					}
				}
				/** set matching to state (ascending order by index)*/
				matchingCells.length > 0 &&
					setMatching(matchingCells.sort((a, b) => a.index - b.index));
			});
	}, [calledNumbers]);
	return (
		<section className='b-grid grid'>
			<div className='b-grid__letters grid'>
				<li className='b-grid__ltr txt-white bg-blue fw-bold flex--center'>
					b
				</li>
				<li className='b-grid__ltr txt-white bg-indigo-400 fw-bold flex--center'>
					i
				</li>
				<li className='b-grid__ltr txt-white bg-gray fw-bold flex--center'>
					n
				</li>
				<li className='b-grid__ltr txt-white bg-green fw-bold flex--center'>
					g
				</li>
				<li className='b-grid__ltr txt-white bg-brown-light fw-bold flex--center'>
					o
				</li>
			</div>
			<div className='b-grid__numbers grid'>
				{error && <div className='game__error txt-white'>{error}</div>}
				{isReady
					? bingoGrid.map((cell, index) => (
							<li
								className={`b-grid__nbr${
									!cell.match ? '' : ` b-grid__match ${animateClass}`
								} flex--center`}
								key={index}
							>
								{cell.value === 'free' ? (
									<img id='logoImg' src={logoIMG} alt='free' />
								) : (
									cell.value
								)}
							</li>
					  ))
					: !error && <Loading />}
			</div>
		</section>
	);
};

export default BingoGrid;
