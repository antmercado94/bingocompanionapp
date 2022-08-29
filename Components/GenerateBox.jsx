import { useState } from 'react';
import { post } from './Helpers/httpReqHelper';
import logoIMG from '../Assets/svg/bingo-logo.svg';
import Loading from './Interface/Loading';

const GenerateBox = () => {
	const [pending, setPending] = useState(false),
		[error, setError] = useState({ generate: null });

	const [quantity, setQuantity] = useState('1');

	const [isImageLoaded, setIsImageLoaded] = useState(false);

	const input = document.getElementById('quantity');
	if (input) {
		input.defaultValue = '1';
	}

	/* generate PDF */
	const handleSubmit = (e) => {
		e.preventDefault();

		/** req info */
		const options = {
			endpoint: '/api/generate',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify({ quantity }),
		};

		setPending(true);
		/** fetch POST req */
		post(options)
			.then((res) => {
				if (res.errors) throw res.errors;

				setPending(false);
				setError({ generate: null });
				/** get PDF */
				window.open(res.url, '_blank');
			})
			.catch((err) => {
				setPending(false);
				setError(err);
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
					<form className='form-area__form form flex'>
						<div className='form-area__inp'>
							<h2 className='form-area__title txt-white'>
								Generate Bingo Cards
							</h2>
							<h5 className='txt-white fw-light'>
								Specify number of bingo cards to generate
							</h5>
							<input
								onChange={(e) => setQuantity(e.target.value)}
								type='number'
								className='form-area__input input pd-400 fw-light'
								id='quantity'
								name='quantity'
								min='1'
								max='50'
							/>
							{error.generate && (
								<div className='error inp-msg inp-msg--generate txt-white fw-light fs-200'>
									{error.generate}
								</div>
							)}
						</div>
						<div className='lightbox__btns flex--center'>
							<button
								onClick={(e) => handleSubmit(e)}
								className='form-area__btn btn btn--alt txt-white bg-indigo-400 fw-bold fs-200 bs-300'
								id='btnGenerateSubmit'
							>
								{pending ? '.....' : 'generate'}
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

export default GenerateBox;
