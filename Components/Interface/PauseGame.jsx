import { useContext } from 'react';
import { GameContext } from '../../Contexts/GameContext';

const PauseGame = () => {
	const {
		calledNumbers,
		matching,
		callableNumbers,
		bingoGrid,
		currentGameType,
		dispatch,
	} = useContext(GameContext);

	const handleClick = () => {
		let currentGame = {
			gameType: currentGameType,
			calledNumbers,
			matching,
			callableNumbers,
			bingoGrid,
		};

		/** add current game values to local storage */
		localStorage.setItem('pausedGame', JSON.stringify(currentGame));

		dispatch({
			type: 'SET_GAMESTATUS',
			isPaused: true,
			isWin: false,
			isSaved: false,
			gameType: currentGameType,
		});
	};
	return (
		<button
			onClick={handleClick}
			className='btn btn--alt txt-white bg-indigo-400 fw-bold fs-100 bs-300'
			id='btnPause'
		>
			pause
		</button>
	);
};

export default PauseGame;
