import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../Helpers/httpReqHelper';

const DeleteAccount = (props) => {
	const { dispatch, setDeleteStatus } = props;
	const [pending, setPending] = useState(false);
	const navigate = useNavigate();

	/* delete all user data */
	const handleClick = () => {
		const btn = document.getElementById('btnDelete');
		/* req info */
		const options = {
			endpoint: '/api/delete_user',
			method: 'DELETE',
		};

		if (confirm('Are you sure you want to delete your existing account?')) {
			setPending(true);
			/** fetch DELETE req */
			post(options)
				.then((res) => {
					btn.setAttribute('disabled', '');
					if (res.errors) throw res.errors;

					setPending(false);
					setDeleteStatus({ error: null });
					dispatch({
						type: 'SET_USERSTATUS',
						isUser: false,
						isDeleted: true,
					});
					navigate('/login', { replace: true });
				})
				.catch((err) => {
					setPending(false);
					setDeleteStatus({ error: !err.server ? err.message : err.server });
					btn.removeAttribute('disabled');
				});
		}
	};
	return (
		<button
			onClick={handleClick}
			className='section--config__btn btn btn--alt txt-white bg-indigo-400 fw-bold bs-300'
			id='btnDelete'
		>
			{pending ? '.....' : 'delete account'}
		</button>
	);
};

export default DeleteAccount;
