import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../Contexts/GameContext';
import logoIMG from '../Assets/svg/bingo-logo.svg';
import Loading from './Interface/Loading';

const PausedBox = () => {
	const { dispatch } = useContext(GameContext);
	const navigate = useNavigate();

	const [isImageLoaded, setIsImageLoaded] = useState(false);

	/* remove from local storage and redirect */
	const handleNewGame = (e) => {
		e.preventDefault();
		if (confirm('Are you sure?')) {
			dispatch({
				type: 'SET_GAMESTATUS',
				isPaused: false,
				isWin: false,
				isSaved: false,
				gameType: null,
			});
			localStorage.removeItem('pausedGame');
			navigate('/');
		} else {
			return;
		}
	};

	/* remove from local storage and continue */
	const handleContinue = (e) => {
		e.preventDefault();
		dispatch({
			type: 'SET_GAMESTATUS',
			isPaused: false,
			isWin: false,
			isSaved: false,
			gameType: null,
		});
		localStorage.removeItem('pausedGame');
	};
	return (
		<main className='form-area grid' id='lightbox-form'>
			<section className='form-area__container container flex'>
				<div className='form-area__logo'>
					<img
						style={!isImageLoaded ? { display: 'none' } : {}}
						src={logoIMG}
						alt='Bingo Logo'
						onLoad={() => setIsImageLoaded(true)}
					/>
				</div>
				{isImageLoaded ? (
					<form className='form-area__form form flex'>
						<div className='form-area__inp'>
							<h2 className='form-area__title form-area__title--pause txt-white'>
								Game Paused
							</h2>
						</div>
						<div className='lightbox__btns flex--center'>
							<button
								onClick={(e) => handleNewGame(e)}
								className='form-area__btn btn btn--alt txt-white bg-indigo-400 fw-bold fs-200 bs-300'
							>
								New Game
							</button>
							<button
								onClick={(e) => handleContinue(e)}
								className='form-area__btn btn btn--alt txt-white bg-indigo-400 fw-bold fs-200 bs-300'
							>
								Continue
							</button>
						</div>
					</form>
				) : (
					<Loading />
				)}
			</section>
		</main>
	);
};

export default PausedBox;
