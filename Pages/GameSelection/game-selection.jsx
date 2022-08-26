import { useState } from 'react';
import { Link } from 'react-router-dom';
import bingoCardSVG from '../../Assets/svg/bingo-card.svg';
import pickerSVG from '../../Assets/svg/number-picker.svg';

const GameSelection = () => {
	const [isImage1Loaded, setIsImage1Loaded] = useState(false);
	const [isImage2Loaded, setIsImage2Loaded] = useState(false);
	const [isImage3Loaded, setIsImage3Loaded] = useState(false);

	return (
		<main className='selection grid grid--main'>
			<section
				className={`selection__card selection__card--1 ${
					!isImage1Loaded && !isImage2Loaded && !isImage3Loaded
						? 'skeleton'
						: 'selection__card--animate'
				} container txt-white flex`}
			>
				<Link className='selection__link' to='/game/no-grid' />
				<div className='selection__cat'>
					<img
						className='selection__icon'
						src={pickerSVG}
						alt='Number Picker'
						onLoad={() => setIsImage1Loaded(true)}
					/>
				</div>
				<h1 className='selection__title fw-bold'>game mode</h1>
			</section>
			<section
				className={`selection__card selection__card--2 ${
					!isImage1Loaded && !isImage2Loaded && !isImage3Loaded
						? 'skeleton'
						: 'selection__card--animate'
				} container txt-white flex`}
			>
				<Link className='selection__link' to='/game/grid' />
				<div className='selection__cat flex'>
					<img
						className='selection__icon selection__icon--picker'
						src={pickerSVG}
						alt='Number Picker'
						onLoad={() => setIsImage2Loaded(true)}
					/>
					<img
						className='selection__icon selection__icon--card'
						src={bingoCardSVG}
						alt='Bingo Card'
						onLoad={() => setIsImage3Loaded(true)}
					/>
				</div>
				<h1 className='selection__title fw-bold'>game mode</h1>
			</section>
		</main>
	);
};

export default GameSelection;
