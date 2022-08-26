import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UpdateUserContext } from '../Contexts/UpdateUserContext';
import { post } from './Helpers/httpReqHelper';
import DeleteAccount from './Interface/DeleteAccount';
import EraseRecords from './Interface/EraseRecords';

const MyConfig = (props) => {
	const { dispatch, lightBoxHidden, toggleLightBox, resetMsg, setResetMsg } =
		props;
	const { name, email } = props.settings;
	const {
		userNameUpdated,
		userEmailUpdated,
		toggleUserNameUpdated,
		toggleUserEmailUpdated,
		currentName,
		setCurrentName,
		currentEmail,
		setCurrentEmail,
	} = useContext(UpdateUserContext);

	const [pending, setPending] = useState(false),
		[error, setError] = useState({ email: null }),
		[success, setSuccess] = useState({ update: null });

	const [eraseStatus, setEraseStatus] = useState({
			error: null,
			success: null,
		}),
		[deleteStatus, setDeleteStatus] = useState({ error: null });

	const [newName, setNewName] = useState(''),
		[newEmail, setNewEmail] = useState('');

	const nameRef = useRef(),
		emailRef = useRef();

	const location = useLocation();

	/* set pw reset err */
	useEffect(() => {
		if (location.state) setResetMsg({ reset: location.state.message });
	}, []);

	/* focus input */
	const handleClick = (ref, target) => {
		let btn = target;
		ref.disabled = false;
		ref.focus();
		btn.disabled = true;
	};

	/* update name or email */
	const handleBlur = (data, ref) => {
		let btn = document.querySelector('.setting__btn:disabled');
		ref.disabled = true;
		btn.disabled = false;
		if (!data) return;

		setPending(true);
		let newData;
		/** name/email */
		switch (ref.name) {
			case 'name':
				if (data === currentName) return setPending(false);
				newData = { newName: data };
				break;
			case 'email':
				if (data === currentEmail) return setPending(false);
				newData = { newEmail: data };
				break;
		}

		/** req info */
		const options = {
			endpoint: '/api/update-user',
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify(newData),
		};
		/** fetch PUT req */
		post(options)
			.then((res) => {
				if (res.errors) throw res.errors;

				setPending(false);
				setError({ email: null });
				ref.value = '';

				if (res.nameUpdated) {
					setNewName('');
					setCurrentName(newData.newName);
					toggleUserNameUpdated();
					setSuccess({ update: 'Name has been updated successfully.' });
				} else if (res.emailUpdated) {
					setNewEmail('');
					setCurrentEmail(newData.newEmail);
					toggleUserEmailUpdated();
					setSuccess({ update: 'Email has been updated successfully.' });
				}
			})
			.catch((err) => {
				setPending(false);
				setError(err);
				setSuccess({ update: null });
			});
	};
	return (
		<section className='acc-area__section section section--config flex'>
			<h1 className='section__header fw-bold'>settings</h1>
			<section className='section__settings section__container flex'>
				<ul className='section__item setting flex'>
					<span className='setting__name setting__name--name flex'>name</span>
					<div className='setting__spacer flex'>
						<input
							ref={nameRef}
							onBlur={() => handleBlur(newName, nameRef.current)}
							onChange={(e) => setNewName(e.target.value)}
							type='text'
							className='setting__value fw-bold'
							name='name'
							placeholder={!userNameUpdated ? name : currentName}
							data-testid='userDataName'
							disabled
						/>
						<button
							onClick={(e) => handleClick(nameRef.current, e.target)}
							data-input='name'
							className='setting__btn btn txt-white bg-indigo-400 fw-bold bs-300'
						>
							{pending ? '.....' : 'edit'}
						</button>
					</div>
				</ul>
				<ul className='section__item setting flex'>
					<span className='setting__name setting__name--email flex'>email</span>
					<div className='setting__spacer flex'>
						<input
							ref={emailRef}
							onBlur={() => handleBlur(newEmail, emailRef.current)}
							onChange={(e) => setNewEmail(e.target.value)}
							type='email'
							className='setting__value fw-bold'
							name='email'
							placeholder={!userEmailUpdated ? email : currentEmail}
							disabled
						/>
						<button
							onClick={(e) => handleClick(emailRef.current, e.target)}
							data-input='email'
							className='setting__btn btn txt-white bg-indigo-400 fw-bold bs-300'
						>
							{pending ? '.....' : 'edit'}
						</button>
					</div>
				</ul>
				<ul className='section__item setting flex'>
					<span className='setting__name setting__name--password flex'>
						password
					</span>
					<div className='setting__spacer flex'>
						<li className='setting__value fw-bold'>***********</li>
						<button
							onClick={toggleLightBox}
							className='setting__btn btn txt-white bg-indigo-400 fw-bold bs-300'
							disabled={!lightBoxHidden ? true : false}
							data-testid='configResetPw'
						>
							edit
						</button>
					</div>
				</ul>
			</section>
			<section className='section--config__btns flex--center'>
				<EraseRecords setEraseStatus={setEraseStatus} />
				<DeleteAccount setDeleteStatus={setDeleteStatus} dispatch={dispatch} />
			</section>
			{eraseStatus.success && (
				<div className='success txt-white fw-light fs-100'>
					{eraseStatus.success}
				</div>
			)}
			{success.update && (
				<div className='success txt-white fw-light fs-100'>
					{success.update}
				</div>
			)}
			{deleteStatus.error && (
				<div className='error txt-white fw-light fs-100'>
					{deleteStatus.error}
				</div>
			)}
			{eraseStatus.error && (
				<div className='error txt-white fw-light fs-100'>
					{eraseStatus.error}
				</div>
			)}
			{error.email && (
				<div className='error txt-white fw-light fs-100'>{error.email}</div>
			)}
			{error.message && (
				<div className='error txt-white fw-light fs-100'>{error.message}</div>
			)}
			{error.server && (
				<div className='error txt-white fw-light fs-100'>{error.server}</div>
			)}
			{resetMsg.reset && (
				<div className='resetMsg txt-white fw-light fs-100'>
					{resetMsg.reset}
				</div>
			)}
		</section>
	);
};

export default MyConfig;
