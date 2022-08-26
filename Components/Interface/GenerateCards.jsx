import { useContext, useState } from 'react';
import generateSVG from '../../Assets/svg/generate-icon.svg';
import { GameContext } from '../../Contexts/GameContext';
const GenerateCard = (props) => {
	const { generateHidden, setGenerateHidden } = props;
	const { state } = useContext(GameContext);
	const { isPaused, isWin } = state.gameStatus;
	const [isImageLoaded, setIsImageLoaded] = useState(false);

	const handleClick = () => {
		setGenerateHidden(false);
	};

	return (
		<div
			style={!isImageLoaded ? { opacity: '0.5', transform: 'unset' } : {}}
			data-disabled={isPaused || isWin || !generateHidden ? true : false}
			onClick={handleClick}
			className={`generate-cards ${
				generateHidden ? '' : 'generate-cards--hidden'
			}${
				!isImageLoaded ? 'skeleton' : 'generate-cards--animate'
			} bg-red-600 bs-300 flex--center`}
		>
			<img
				className='generate-cards__icon'
				src={generateSVG}
				onLoad={() => setIsImageLoaded(true)}
				alt='Generate Icon'
			/>
		</div>
	);
};

export default GenerateCard;
