import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { post } from '../../Components/Helpers/httpReqHelper';
import useFetch from '../../Components/Hooks/useFetch';
import logoIMG from '../../Assets/svg/bingo-logo.svg';
import Loading from '../../Components/Interface/Loading';

const ResetPassword = (props) => {
	const { userStatus } = props;
	const { isUser } = userStatus;
	const { id, token } = useParams();
	const navigate = useNavigate();

	const [pending, setPending] = useState(false),
		[error, setError] = useState({ password: null });

	const [password, setPassword] = useState(''),
		[repeatPassword, setRepeatPassword] = useState('');

	const [isImageLoaded, setIsImageLoaded] = useState(false);

	/* fetch param auth check */
	const { isPending, error: err } = useFetch(`/api/resetpw/${id}/${token}`);

	/* auth check */
	useEffect(() => {
		/** redirect */
		if (err)
			navigate(isUser ? '/myaccount/settings' : '/login', {
				replace: true,
				state: {
					message: 'There was a problem verifying request, please try again.',
				},
			});
	}, [err]);

	/* reset pw and redirect */
	const handleSubmit = (e) => {
		e.preventDefault();
		const btn = document.getElementById('btnSubmit'),
			passwordInput = document.getElementById('resetPassword'),
			repeatPasswordInput = document.getElementById('resetRepeatPassword');
		const user = { password, repeatPassword };
		/** req info */
		const options = {
			endpoint: `/api/pw_reset/${id}/${token}`,
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
				/** redirect */
				if (res.isUser === false || res.isVerified === false)
					return navigate(isUser ? '/myaccount/settings' : '/login', {
						replace: true,
						state: {
							message:
								'There was a problem verifying request, please try again.',
						},
					});

				setPending(false);
				setError({ password: null });
				passwordInput.value = '';
				repeatPasswordInput.value = '';
				setPassword('');
				setRepeatPassword('');
				navigate(isUser ? '/myaccount/settings' : '/login', {
					replace: true,
					state: { message: 'Password reset successfully.' },
				});
			})
			.catch((err) => {
				setPending(false);
				setError(err);
				btn.removeAttribute('disabled');
			});
	};

	if (isPending) return null;
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
						<h2 className='form-area__title txt-white'>Create New Password</h2>
						<h5 className='txt-white fw-light'>
							your new password must be different from previously used passwords
						</h5>
						<input
							className='form-area__input input pd-400 fw-light'
							id='resetPassword'
							type='password'
							placeholder='enter new password'
							onChange={(e) => setPassword(e.target.value)}
						/>
						<input
							className='form-area__input input pd-400 fw-light'
							id='resetRepeatPassword'
							type='password'
							placeholder='verify new password'
							onChange={(e) => setRepeatPassword(e.target.value)}
						/>
						{error.password && (
							<div className='error txt-white fw-light fs-100'>
								{error.password}
							</div>
						)}
						<button
							className='form-area__btn btn btn--alt txt-white bg-indigo-400 fw-bold bs-300'
							id='btnSubmit'
						>
							{pending ? '.....' : 'reset password'}
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
		</main>
	);
};

export default ResetPassword;
