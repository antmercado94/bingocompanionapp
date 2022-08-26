import { useContext, useState } from 'react';
import { GameContext } from '../../Contexts/GameContext';
import AllNumbers from '../../Components/AllNumbers';
import GameBtns from '../../Components/GameBtns';
import PausedBox from '../../Components/PausedBox';
import CurrentNum from '../../Components/Interface/CurrentNum';
import PauseGame from '../../Components/Interface/PauseGame';
import WinMatch from '../../Components/Interface/WinMatch';
import GenerateCards from '../../Components/Interface/GenerateCards';
import GenerateBox from '../../Components/GenerateBox';

const BingoNoGrid = () => {
	const { calledNumbers, isWinner, error, state } = useContext(GameContext);
	const { isPaused } = state.gameStatus;
	const numbersExist = calledNumbers.length > 0;
	const [generateHidden, setGenerateHidden] = useState(true);
	const slider = document.getElementsByClassName('numbers--no-grid')[0];

	/* hide generate lightbox */
	const handleClick = () => {
		setGenerateHidden(true);
	};

	/* click drag numbers */
	const handleMouseCapture = () => {
		/** credit Ionut Daniel, 
					codepen: https://codepen.io/thenutz/pen/VwYeYEE */
		let isDown = false;
		let startY;
		let scrollTop;

		slider.addEventListener('mousedown', (e) => {
			isDown = true;
			slider.classList.add('active');
			startY = e.pageY - slider.offsetTop;
			scrollTop = slider.scrollTop;
		});
		slider.addEventListener('mouseleave', () => {
			isDown = false;
			slider.classList.remove('active');
		});
		slider.addEventListener('mouseup', () => {
			isDown = false;
			slider.classList.remove('active');
		});
		slider.addEventListener('mousemove', (e) => {
			if (!isDown) return;
			e.preventDefault();
			const y = e.pageY - slider.offsetTop;
			const walk = (y - startY) * 3; //scroll-fast
			slider.scrollTop = scrollTop - walk;
		});
	};
	return (
		<>
			<main className='game game--no-grid grid grid--main'>
				<section className='game__pause'>
					<PauseGame />
				</section>
				<section className='game__numbers'>
					<section
						className='numbers numbers--no-grid bg-red-500 bs-400'
						id='scroller'
						onMouseDownCapture={handleMouseCapture}
					>
						<AllNumbers error={error} />
					</section>
				</section>
				<section className='game__current'>
					{numbersExist && <CurrentNum />}
				</section>
				<section className='game__interface flex'>
					<GameBtns />
				</section>
				<section className={`game__win lightbox`} data-hidden={!isWinner}>
					<WinMatch />
					<div className='lightbox__overlay'></div>
				</section>
				<section className='paused lightbox' data-hidden={!isPaused}>
					<PausedBox />
					<div className='lightbox__overlay'></div>
				</section>
				<section className='generate lightbox' data-hidden={generateHidden}>
					<GenerateBox />
					<div onClick={handleClick} className='lightbox__overlay'></div>
				</section>
			</main>
			<GenerateCards
				generateHidden={generateHidden}
				setGenerateHidden={setGenerateHidden}
			/>
		</>
	);
};

export default BingoNoGrid;
