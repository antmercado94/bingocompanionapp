import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GameContext } from '../Contexts/GameContext';
import { post, put } from './Helpers/httpReqHelper';
import logoIMG from '../Assets/svg/bingo-logo.svg';
import Loading from './Interface/Loading';

const WinBox = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [isImageLoaded, setIsImageLoaded] = useState(false);
	const slug = location.pathname.slice(6);
	const {
		calledNumbers,
		isWinner,
		currentGameType,
		matching,
		callableNumbers,
		bingoGrid,
		state,
		dispatch,
	} = useContext(GameContext);

	const { isUser } = state.userStatus;
	const { isSaved } = state.gameStatus;
	const isUpdatePending = state.isUpdatePending;

	const [pending, setPending] = useState(false),
		[error, setError] = useState({ winner: null }),
		[success, setSuccess] = useState({ record: null });

	const [name, setName] = useState('');

	/* req info */
	const putOptions = {
		endpoint: '/api/complete',
		method: 'PUT',
	};
	useEffect(() => {
		/** update completed games count after returning from login or signup */
		if (isUser) {
			if (isUpdatePending === true) {
				/** fetch PUT req */
				put(putOptions);
				dispatch({ type: 'SET_GAMECOMPLETE', isUpdatePending: false });
			}
		}
	}, [isUser]);

	/* add game data to local storage and update completed games count */
	useEffect(() => {
		if (!isImageLoaded) return;
		const input = document.getElementById('nameInput');
		const winGame = localStorage.getItem('winGame');
		const currentGame = {
			gameType: currentGameType,
			calledNumbers,
			matching,
			callableNumbers,
			bingoGrid,
		};
		/* redirect if game already saved */
		if (isSaved) {
			dispatch({
				type: 'SET_GAMESTATUS',
				isPaused: false,
				isWin: false,
				isSaved: false,
				gameType: null,
			});
			localStorage.removeItem('winGame');
			navigate('/');
		}
		if (isWinner) {
			/** focus input */
			input.focus();
			/** update completed games count */
			if (!winGame && isUser) {
				/** fetch PUT req */
				put(putOptions);
				dispatch({ type: 'SET_GAMECOMPLETE', isUpdatePending: false });
			}
			/** store game temporarily */
			localStorage.setItem('winGame', JSON.stringify(currentGame));
			dispatch({
				type: 'SET_GAMESTATUS',
				isPaused: false,
				isWin: true,
				isSaved: false,
				gameType: currentGameType,
			});
		}
	}, [isWinner]);

	/* save game results */
	const handleSubmit = (e) => {
		e.preventDefault();
		const btn = document.getElementById('btnSubmit'),
			input = document.getElementById('nameInput');

		const record = {
			winner: name,
			calledNumbers,
			withGrid: slug === 'grid' ? true : false,
		};
		/** req info */
		const options = {
			endpoint: '/api/save',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify(record),
		};

		/** redirect */
		if (isUser === false) {
			dispatch({ type: 'SET_GAMECOMPLETE', isUpdatePending: true });
			return navigate('/login', {
				state: { message: 'Please log in to continue.' },
			});
		}

		setPending(true);
		/** fetch POST req */
		post(options)
			.then((res) => {
				btn.setAttribute('disabled', '');
				if (res.errors) throw res.errors;
				/** redirect */
				if (res.isUser === false || res.isVerified === false) {
					dispatch({
						type: 'SET_USERSTATUS',
						isUser: false,
						isWin: false,
						isDeleted: false,
					});
					return navigate('/login', {
						state: { message: 'Please log in to continue.' },
					});
				}
				setPending(false);
				setError({ winner: null });
				input.value = '';
				setName('');

				dispatch({
					type: 'SET_GAMESTATUS',
					isPaused: false,
					isWin: true,
					isSaved: true,
					gameType: currentGameType,
				});
				localStorage.removeItem('winGame');
				setSuccess({ record: 'Game record has been saved.' });
			})
			.catch((err) => {
				setPending(false);
				setError(err);
				setSuccess({ record: null });
				btn.removeAttribute('disabled');
			});
	};

	/* remove from local storage and redirect */
	const handleNewGame = (e) => {
		e.preventDefault();

		if (!isSaved) {
			if (confirm('Are you sure?')) {
				dispatch({
					type: 'SET_GAMESTATUS',
					isPaused: false,
					isWin: false,
					isSaved: false,
					gameType: null,
				});
				localStorage.removeItem('winGame');
				dispatch({ type: 'SET_GAMECOMPLETE', isUpdatePending: false });
				navigate('/');
			} else {
				return;
			}
		} else {
			dispatch({
				type: 'SET_GAMESTATUS',
				isPaused: false,
				isWin: false,
				isSaved: false,
				gameType: null,
			});
			localStorage.removeItem('winGame');
			dispatch({ type: 'SET_GAMECOMPLETE', isUpdatePending: false });
			navigate('/');
		}
	};

	return (
		<main className='form-area grid'>
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
					<form
						onSubmit={(e) => handleSubmit(e)}
						className='form-area__form form flex'
					>
						<div className='form-area__inp'>
							<h2 className='form-area__title txt-white'>name:</h2>
							<input
								onChange={(e) => setName(e.target.value)}
								className='form-area__input input pd-400 fw-light'
								id='nameInput'
								type='text'
								placeholder='winner name'
							/>
							{success.record && (
								<div className='success inp-msg txt-white fw-light fs-200'>
									{success.record}
								</div>
							)}
							{error.winner && (
								<div className='error inp-msg txt-white fw-light fs-200'>
									{error.winner}
								</div>
							)}
						</div>
						<div className='lightbox__btns flex--center'>
							<button
								onClick={(e) => handleNewGame(e)}
								className='form-area__btn btn btn--alt txt-white bg-indigo-400 fw-bold fs-200 bs-300'
							>
								new game
							</button>
							<button
								type='submit'
								className='form-area__btn btn btn--alt txt-white bg-indigo-400 fw-bold fs-200 bs-300'
								id='btnSubmit'
							>
								{pending ? '.....' : 'save results'}
							</button>
						</div>
						{error.server && (
							<div className='error inp-msg--server txt-white fw-light fs-100'>
								{error.server}
							</div>
						)}
					</form>
				) : (
					<Loading />
				)}
			</section>
		</main>
	);
};

export default WinBox;
