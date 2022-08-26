/**
 * Toggle light/dark theme
 */

import { createContext } from 'react';

export const ThemeContext = createContext();

const ThemeContextProvider = (props) => {
	const { setTheme } = props;

	const toggleTheme = () => {
		/** toggle theme */
		setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
	};

	return (
		<ThemeContext.Provider value={{ toggleTheme }}>
			{props.children}
		</ThemeContext.Provider>
	);
};

export default ThemeContextProvider;
