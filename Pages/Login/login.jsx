import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { post } from '../../Components/Helpers/httpReqHelper';
import ResetBox from '../../Components/ResetBox';
import logoIMG from '../../Assets/svg/bingo-logo.svg';
import Loading from '../../Components/Interface/Loading';

const LogIn = (props) => {
	const { userStatus, dispatch } = props;
	const isDeleted = userStatus.isDeleted;
	const navigate = useNavigate();
	const location = useLocation();
	const [lightBoxHidden, setLightBoxHidden] = useState(true);
	const [isImageLoaded, setIsImageLoaded] = useState(false);

	const [pending, setPending] = useState(false),
		[error, setError] = useState({ user: null }),
		[resetMsg, setResetMsg] = useState({ reset: null }),
		[deleteSuccess, setDeleteSuccess] = useState({ message: null });

	const [email, setEmail] = useState(),
		[password, setPassword] = useState();

	/* status msgs */
	useEffect(() => {
		if (location.state) setResetMsg({ reset: location.state.message });
		if (isDeleted) {
			setDeleteSuccess({ message: 'Account has been deleted successfully.' });
			dispatch({ type: 'SET_USERSTATUS', isUser: false, isDeleted: false });
		}
	}, []);

	/* log in user and redirect */
	const handleSubmit = (e) => {
		e.preventDefault();
		const btn = document.getElementById('btnSubmit');
		const user = { email, password };
		/** req info */
		const options = {
			endpoint: '/api/login',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify(user),
		};

		setResetMsg({ reset: null });
		setPending(true);
		/** fetch POST req */
		post(options)
			.then((res) => {
				btn.setAttribute('disabled', '');
				if (res.errors) throw res.errors;

				setPending(false);
				setError({ user: null });
				navigate('/', { replace: true });
				dispatch({ type: 'SET_USERSTATUS', isUser: true, isDeleted: false });
			})
			.catch((err) => {
				setPending(false);
				setError(err);
				btn.removeAttribute('disabled');
			});
	};

	/* toggle reset pw lightbox */
	const toggleLightBox = () => {
		setLightBoxHidden(!lightBoxHidden);
	};
	return (
		<main className='form-area grid grid--main'>
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
						<h2 className='form-area__title txt-white'>Log In</h2>
						{error.user && (
							<div className='error txt-white fw-light fs-100'>
								{error.user}
							</div>
						)}
						<input
							className='form-area__input input pd-400 fw-light'
							type='email'
							placeholder='email'
							onChange={(e) => setEmail(e.target.value)}
						/>
						<input
							className='form-area__input input pd-400 fw-light'
							type='password'
							placeholder='password'
							onChange={(e) => setPassword(e.target.value)}
						/>
						<div className='flex--center'>
							<h5 className='fw-regular'>
								Don't have an account yet?{' '}
								<strong>
									<Link to='/signup'>Create Account</Link>
								</strong>
							</h5>
						</div>
						<button
							className='form-area__btn btn btn--alt txt-white bg-indigo-400 fw-bold bs-300'
							id='btnSubmit'
						>
							{pending ? '.....' : 'log in'}
						</button>
						{deleteSuccess.message && (
							<div className='success txt-white fw-light fs-100'>
								{deleteSuccess.message}
							</div>
						)}
						{resetMsg.reset && (
							<div className='error txt-white fw-light fs-100'>
								{resetMsg.reset}
							</div>
						)}
						{error.server && (
							<div className='error txt-white fw-light fs-100'>
								{error.server}
							</div>
						)}
					</form>
				) : (
					<Loading />
				)}
			</section>
			<section className='form-area__small flex--center'>
				<h5 className='fw-regular'>
					Forgot your password?&nbsp;
					<a onClick={toggleLightBox}>
						<strong>Reset Password</strong>
					</a>
				</h5>
			</section>
			<section className='lightbox' data-hidden={lightBoxHidden}>
				<ResetBox setResetMsg={setResetMsg} lightBoxHidden={lightBoxHidden} />
				<div onClick={toggleLightBox} className='lightbox__overlay'></div>
			</section>
		</main>
	);
};

export default LogIn;
