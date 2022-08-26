import useCalled from '../Hooks/useCalled';
import { returnColClass } from '../Helpers/colClassHelper';
import { useContext } from 'react';
import { GameContext } from '../../Contexts/GameContext';

const CurrentNum = () => {
	const { isWinner, isPaused } = useContext(GameContext);
	const { currentCol, currentNum } = useCalled();
	const currentColClass = returnColClass(currentCol);

	const animateClass =
		!isWinner && !isPaused ? 'numbers__current--animate' : '';

	return (
		<li
			className={`numbers__circle numbers__current ${animateClass} ${currentColClass} txt-black bg-white bs-400`}
			id='currentNum'
		>
			<span className='numbers__letter fw-bold'>{currentCol}</span>
			<span className='numbers__num'>{currentNum}</span>
		</li>
	);
};

export default CurrentNum;
