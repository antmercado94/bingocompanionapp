import { useContext, useState } from 'react';
import { UpdateUserContext } from '../../Contexts/UpdateUserContext';
import { post } from '../Helpers/httpReqHelper';

const EraseRecords = (props) => {
	const setEraseStatus = props.setEraseStatus;
	const { setIsErased } = useContext(UpdateUserContext);
	const [pending, setPending] = useState(false);

	/* req info */
	const options = {
		endpoint: '/api/erase_records',
		method: 'DELETE',
	};

	/* remove all user record data */
	const handleClick = () => {
		const btn = document.getElementById('btnErase');

		if (confirm('Are you sure you want to erase all record data?')) {
			setPending(true);
			/** fetch DELETE req */
			post(options)
				.then((res) => {
					btn.setAttribute('disabled', '');
					if (res.errors) throw res.errors;

					setPending(false);
					setIsErased(true);
					setEraseStatus({
						error: null,
						success: 'Records have been removed successfully.',
					});
				})
				.catch((err) => {
					setPending(false);
					setEraseStatus({
						error: !err.server ? err.message : err.server,
						success: null,
					});
					btn.removeAttribute('disabled');
				});
		}
	};
	return (
		<button
			onClick={handleClick}
			className='section--config__btn btn btn--alt txt-white bg-indigo-400 fw-bold bs-300'
			id='btnErase'
		>
			{pending ? '.....' : 'erase records'}
		</button>
	);
};

export default EraseRecords;
