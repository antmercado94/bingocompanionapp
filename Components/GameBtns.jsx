import BingoBtn from './Interface/BingoBtn';
import NumberPicker from './Interface/NumberPicker';

const GameBtns = () => {
	return (
		<section className='b-buttons flex'>
			<NumberPicker />
			<BingoBtn />
		</section>
	);
};

export default GameBtns;
