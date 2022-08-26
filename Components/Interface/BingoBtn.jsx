import { useContext } from 'react';
import { GameContext } from '../../Contexts/GameContext';

const BingoBtn = () => {
	const { setIsWinner } = useContext(GameContext);

	const handleClick = () => {
		if (confirm('Are you ready to call a winner?')) setIsWinner(true);
	};
	return (
		<button
			onClick={handleClick}
			className='b-buttons__btn btn--interface txt-white bg-red-500 fw-bold bs-300'
		>
			bingo!
		</button>
	);
};

export default BingoBtn;
