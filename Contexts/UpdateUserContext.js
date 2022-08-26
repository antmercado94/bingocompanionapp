/**
 * Update states related to user account info
 */

import { createContext, useState } from 'react';

export const UpdateUserContext = createContext();

const UpdateUserContextProvider = (props) => {
	const { name, email } = props.settings;
	const [state, setState] = useState({
		userNameUpdated: false,
		userEmailUpdated: false,
	});
	const [currentName, setCurrentName] = useState(name),
		[currentEmail, setCurrentEmail] = useState(email);
	const [isErased, setIsErased] = useState(false);

	/* name updated */
	const toggleUserNameUpdated = () => {
		setState({ ...state, userNameUpdated: true });
	};

	/* email updated */
	const toggleUserEmailUpdated = () => {
		setState({ ...state, userEmailUpdated: true });
	};

	return (
		<UpdateUserContext.Provider
			value={{
				...state,
				toggleUserNameUpdated,
				toggleUserEmailUpdated,
				currentName,
				setCurrentName,
				currentEmail,
				setCurrentEmail,
				isErased,
				setIsErased,
			}}
		>
			{props.children}
		</UpdateUserContext.Provider>
	);
};

export default UpdateUserContextProvider;
