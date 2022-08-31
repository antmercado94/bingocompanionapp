/**
 * Game related states
 */

import { createContext, useEffect, useLayoutEffect, useState } from 'react';
import useFetch from '../Components/Hooks/useFetch';

export const GameContext = createContext();

const GameContextProvider = (props) => {
	const { state, dispatch } = props;
	const currentGameType = props.children.type.name.includes('BingoWithGrid')
		? 'BingoWithGrid'
		: 'BingoNoGrid';
	const [calledNumbers, setCalledNumbers] = useState([]);
	const [matching, setMatching] = useState([]);
	const [isWinner, setIsWinner] = useState(false);
	const [bingoGrid, setBingoGrid] = useState([]);
	const columns = ['b', 'i', 'n', 'g', 'o'];

	/* game api */
	const { data, error } = useFetch('/api/numbers');
	const [callableNumbers, setCallableNumbers] = useState(null);
	/* current game status */
	const { isPaused, isWin } = state.gameStatus;

	/* restart numbers list animation */
	const restartListAnimation = () => {
		if (isWin || isPaused) return;
		let numbersList = document.querySelectorAll(
			'.numbers__circles:not(:last-of-type)'
		);
		numbersList.forEach((number) => {
			number.classList.remove('numbers__circles--animate');
			void number.offsetWidth;
			number.classList.add('numbers__circles--animate');
		});
	};

	useLayoutEffect(() => {
		currentGameType !== 'BingoNoGrid' && restartListAnimation();
	}, [calledNumbers]);

	useEffect(() => {
		if (isPaused || isWin) return;
		/** 5 arrays (emulating columns) containing callable numbers */
		data && setCallableNumbers(data.numbers);
	}, [data]);

	/* set game data on pause or win */
	useEffect(() => {
		const pausedGame = localStorage.getItem('pausedGame');
		const winGame = localStorage.getItem('winGame');
		if (pausedGame || winGame) {
			const { gameType, calledNumbers, matching, callableNumbers, bingoGrid } =
				JSON.parse(!pausedGame ? winGame : pausedGame);
			setCalledNumbers(calledNumbers);
			setMatching(matching);
			setCallableNumbers(callableNumbers);
			setIsWinner(!winGame ? false : true);
			/** repopulate grid cells for 'BingoWithGrid' game type */
			if (gameType === 'BingoWithGrid') setBingoGrid(bingoGrid);
		}
	}, []);

	return (
		<GameContext.Provider
			value={{
				calledNumbers,
				setCalledNumbers,
				columns,
				matching,
				setMatching,
				isPaused,
				isWinner,
				setIsWinner,
				currentGameType,
				callableNumbers,
				setCallableNumbers,
				bingoGrid,
				setBingoGrid,
				error,
				state,
				dispatch,
			}}
		>
			{props.children}
		</GameContext.Provider>
	);
};

export default GameContextProvider;
