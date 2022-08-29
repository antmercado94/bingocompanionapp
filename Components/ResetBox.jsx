import { useEffect, useState } from 'react';
import { post } from './Helpers/httpReqHelper';
import logoIMG from '../Assets/svg/bingo-logo.svg';
import Loading from './Interface/Loading';

const ResetBox = (props) => {
	const { setResetMsg, lightBoxHidden } = props;

	const [pending, setPending] = useState(false),
		[error, setError] = useState({ email: null }),
		[success, setSuccess] = useState({ email: null });

	const [email, setEmail] = useState('');
	const [isImageLoaded, setIsImageLoaded] = useState(false);

	/* focus/clear input */
	useEffect(() => {
		if (!isImageLoaded) return;
		const input = document.getElementById('resetEmail');
		if (!lightBoxHidden) {
			input.focus();
		} else {
			input.value = '';
			setError({ email: null });
		}
	}, [lightBoxHidden]);

	/* send reset email */
	const handleSubmit = (e) => {
		e.preventDefault();
		const btn = document.getElementById('btnResetSubmit'),
			input = document.getElementById('resetEmail');

		/* req info */
		const options = {
			endpoint: '/api/resetpw_post',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify({ email }),
		};

		setResetMsg({ reset: null });
		setPending(true);
		/** fetch POST req */
		post(options)
			.then((res) => {
				btn.setAttribute('disabled', '');
				if (res.errors) throw res.errors;

				setPending(false);
				setError({ email: null });
				input.value = '';
				setEmail('');

				setSuccess({ email: 'Email has been sent!' });
			})
			.catch((err) => {
				setPending(false);
				setError(err);
				setSuccess({ email: null });
				btn.removeAttribute('disabled');
			});
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
					<form
						onSubmit={(e) => handleSubmit(e)}
						className='form-area__form form flex'
					>
						<div className='form-area__inp'>
							<h2 className='form-area__title txt-white'>reset password</h2>
							<h5 className='txt-white fw-light'>
								enter an email address you use to sign in to
							</h5>
							<input
								onChange={(e) => setEmail(e.target.value)}
								className='form-area__input input pd-400 fw-light'
								id='resetEmail'
								type='email'
								placeholder='email'
							/>
							{success.email && (
								<div className='success inp-msg  txt-white fw-light fs-200'>
									{success.email}
								</div>
							)}
							{error.email && (
								<div className='error inp-msg txt-white fw-light fs-200'>
									{error.email}
								</div>
							)}
						</div>
						<div className='lightbox__btns flex--center'>
							<button
								type='submit'
								className='form-area__btn btn btn--alt txt-white bg-indigo-400 fw-bold fs-200 bs-300'
								id='btnResetSubmit'
							>
								{pending ? '.....' : 'reset password'}
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

export default ResetBox;
