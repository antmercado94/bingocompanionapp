/**
 * Status states reducer
 */

export const statusReducer = (state, action) => {
	switch (action.type) {
		case 'SET_GAMESTATUS':
			return {
				...state,
				gameStatus: {
					isPaused: action.isPaused,
					isWin: action.isWin,
					isSaved: action.isSaved,
					gameType: action.gameType,
				},
			};
		case 'SET_USERSTATUS':
			return {
				...state,
				userStatus: {
					isUser: action.isUser,
					isDeleted: action.isDeleted,
				},
			};
		case 'SET_GAMECOMPLETE':
			return { ...state, isUpdatePending: action.isUpdatePending };
		default:
			return state;
	}
};
