import { useContext } from 'react';
import { ThemeContext } from '../../Contexts/ThemeContext';

const Switch = () => {
	const { toggleTheme } = useContext(ThemeContext);
	/** toggle light/dark theme */
	return (
		<label className='switch'>
			<input onChange={toggleTheme} type='checkbox' />
			<span className='slider' />
		</label>
	);
};

export default Switch;
