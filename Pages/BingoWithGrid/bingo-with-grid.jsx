import { useContext, useState } from 'react';
import { GameContext } from '../../Contexts/GameContext';
import BingoGrid from '../../Components/BingoGrid';
import AllNumbers from '../../Components/AllNumbers';
import GameBtns from '../../Components/GameBtns';
import PausedBox from '../../Components/PausedBox';
import CurrentNum from '../../Components/Interface/CurrentNum';
import PauseGame from '../../Components/Interface/PauseGame';
import WinMatch from '../../Components/Interface/WinMatch';
import GenerateCards from '../../Components/Interface/GenerateCards';
import GenerateBox from '../../Components/GenerateBox';

const BingoWithGrid = () => {
	const { calledNumbers, isWinner, state } = useContext(GameContext);
	const { isPaused } = state.gameStatus;
	const numbersExist = calledNumbers.length > 0;
	const [generateHidden, setGenerateHidden] = useState(true);
	const slider = document.getElementsByClassName('numbers--grid')[0];

	/* wheel scroll numbers */
	const onWheel = (e) => {
		e.preventDefault();
		const containerScrollPosition =
			document.getElementsByClassName('numbers--grid')[0].scrollLeft;
		slider.scrollTo({
			top: 0,
			left: containerScrollPosition + e.deltaY,
			behaviour: 'smooth',
		});
	};

	/* click drag numbers */
	const handleMouseCapture = () => {
		/** credit Ionut Daniel, 
				codepen: https://codepen.io/thenutz/pen/VwYeYEE */
		let isDown = false;
		let startX;
		let scrollLeft;

		slider.addEventListener('mousedown', (e) => {
			isDown = true;
			slider.classList.add('active');
			startX = e.pageX - slider.offsetLeft;
			scrollLeft = slider.scrollLeft;
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
			const x = e.pageX - slider.offsetLeft;
			const walk = (x - startX) * 3; //scroll-fast
			slider.scrollLeft = scrollLeft - walk;
		});
	};

	/* touch drag numbers */
	const handleTouchCapture = () => {
		if (isTouchDevice()) {
			/** if touch events exist **/
			var scrollStartPos = 0;
			slider.addEventListener(
				'touchstart',
				function (event) {
					scrollStartPos = this.scrollLeft + event.touches[0].pageX;
				},
				false
			);
			slider.addEventListener(
				'touchmove',
				function (event) {
					this.scrollLeft = scrollStartPos - event.touches[0].pageX;
				},
				false
			);
		}
	};

	/* add touch event for mobile scroll */
	const isTouchDevice = () => {
		try {
			document.createEvent('TouchEvent');
			return true;
		} catch (e) {
			return false;
		}
	};

	/* hide generate lightbox */
	const handleClick = () => {
		setGenerateHidden(true);
	};
	return (
		<>
			<main className='game game--grid grid grid--main'>
				<section className='game__pause'>
					<PauseGame />
				</section>
				<section className='game__numbers'>
					<section
						onWheel={onWheel}
						onMouseDownCapture={handleMouseCapture}
						onTouchStartCapture={handleTouchCapture}
						className='numbers numbers--grid bg-red-500 bs-400 flex'
						id='scroller'
					>
						<AllNumbers />
					</section>
				</section>
				<section className='game__grid'>
					<BingoGrid />
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

export default BingoWithGrid;
