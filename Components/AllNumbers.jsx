import { useContext } from 'react';
import { GameContext } from '../Contexts/GameContext';
import { returnColClass, returnColLetter } from './Helpers/colClassHelper';

const AllNumbers = (props) => {
	const { error } = props;
	const { calledNumbers, isWinner, isPaused } = useContext(GameContext);
	const animateClass =
		!isWinner && !isPaused
			? 'numbers__circles--animate'
			: 'numbers__circles--animated';
	/* display all called numbers */
	return (
		<ul className='numbers__list flex'>
			{error && (
				<div className='game__error txt-white flex--center'>{error}</div>
			)}
			{calledNumbers.map((number) => (
				<li
					className={`numbers__circle noselect numbers__circles ${animateClass} txt-black ${returnColClass(
						number[0]
					)} bg-white bs-400`}
					key={number}
				>
					<span className='numbers__letter fw-bold'>
						{returnColLetter(number[0])}
					</span>
					<span className='numbers__num'>{number[1]}</span>
				</li>
			))}
		</ul>
	);
};

export default AllNumbers;
