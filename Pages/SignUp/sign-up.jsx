import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../../Components/Helpers/httpReqHelper';
import logoIMG from '../../Assets/svg/bingo-logo.svg';
import Loading from '../../Components/Interface/Loading';

const SignUp = (props) => {
	const { dispatch } = props;
	const navigate = useNavigate();

	const [pending, setPending] = useState(false),
		[error, setError] = useState({ name: null, email: null, password: null });

	const [name, setName] = useState(),
		[email, setEmail] = useState(),
		[password, setPassword] = useState();

	const [isImageLoaded, setIsImageLoaded] = useState(false);

	/* sign up new user and login/redirect */
	const handleSubmit = (e) => {
		e.preventDefault();
		const btn = document.getElementById('btnSubmit');
		const user = { name, email, password };
		/** req info */
		const options = {
			endpoint: '/api/signup',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify(user),
		};

		setPending(true);
		/** fetch POST req */
		post(options)
			.then((res) => {
				btn.setAttribute('disabled', '');
				if (res.errors) throw res.errors;

				setPending(false);
				setError({ name: null, email: null, password: null });
				navigate('/', { replace: true });
				dispatch({ type: 'SET_USERSTATUS', isUser: true, isDeleted: false });
			})
			.catch((err) => {
				setPending(false);
				setError(err);
				btn.removeAttribute('disabled');
			});
	};
	return (
		<main className='form-area grid grid--main'>
			<section
				style={isImageLoaded ? { blockSize: 'unset' } : {}}
				className='form-area__container container flex'
			>
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
						<h2 className='form-area__title txt-white'>create account</h2>
						{error.name && (
							<div className='error txt-white fw-light fs-100'>
								{error.name}
							</div>
						)}
						<input
							className='form-area__input input fw-light'
							type='text'
							placeholder='name'
							onChange={(e) => setName(e.target.value)}
						/>
						{error.email && (
							<div className='error txt-white fw-light fs-100'>
								{error.email}
							</div>
						)}
						<input
							className='form-area__input input fw-light'
							type='email'
							placeholder='email'
							onChange={(e) => setEmail(e.target.value)}
						/>
						{error.password && (
							<div className='error txt-white fw-light fs-100'>
								{error.password}
							</div>
						)}
						<input
							className='form-area__input input fw-light'
							type='password'
							placeholder='password'
							onChange={(e) => setPassword(e.target.value)}
						/>
						<div className='flex--center'>
							<input
								className='form-area__cb'
								type='checkbox'
								id='cb-terms'
								required
							/>
							<label className='fs-200' htmlFor='cb-terms'>
								By creating an account you agree with the storage and handling
								of your data by this website in accordance with our{' '}
								<strong>
									<Link to='/privacy-policy' target='_blank'>
										Privacy Policy
									</Link>
								</strong>
							</label>
						</div>
						<button
							className='form-area__btn btn btn--alt txt-white bg-indigo-400 fw-bold bs-300'
							id='btnSubmit'
						>
							{pending ? '.....' : 'sign up'}
						</button>
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
					Already a member?{' '}
					<strong>
						<Link to='/login'>Sign In</Link>
					</strong>
				</h5>
			</section>
		</main>
	);
};

export default SignUp;
