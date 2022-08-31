import { useEffect, useReducer, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { statusReducer } from './Reducers/statusReducer';
import GameContextProvider from './Contexts/GameContext';
import ThemeContextProvider from './Contexts/ThemeContext';
import useCheckUserAuth from './Components/Hooks/useCheckUserAuth';
import Navbar from './Components/Navbar';
/* pages */
import GameSelection from './Pages/GameSelection/game-selection';
import BingoNoGrid from './Pages/BingoNoGrid/bingo-no-grid';
import BingoWithGrid from './Pages/BingoWithGrid/bingo-with-grid';
import LogIn from './Pages/Login/login';
import SignUp from './Pages/SignUp/sign-up';
import MyAccount from './Pages/MyAccount/my-account';
import ResetPassword from './Pages/ResetPassword/reset-password';
import PrivacyPolicy from './Pages/PrivacyPolicy/privacy-policy';

function App() {
	const [state, dispatch] = useReducer(statusReducer, {
		gameStatus: {
			isPaused: false,
			isWin: false,
			isSaved: false,
			gameType: null,
		},
		userStatus: { isUser: false, isDeleted: false },
		isUpdatePending: false,
	});
	const { userStatus, isPending } = useCheckUserAuth();
	const { isPaused, isWin, gameType } = state.gameStatus;
	const { isUser } = state.userStatus;
	const [theme, setTheme] = useState('light');

	/* set pause/win status */
	useEffect(() => {
		const pausedGame = localStorage.getItem('pausedGame');
		const winGame = localStorage.getItem('winGame');

		if (pausedGame) {
			const { gameType } = JSON.parse(pausedGame);
			dispatch({
				type: 'SET_GAMESTATUS',
				isPaused: true,
				isWin: false,
				isSaved: false,
				gameType,
			});
		}
		if (winGame) {
			const { gameType } = JSON.parse(winGame);
			dispatch({
				type: 'SET_GAMESTATUS',
				isPaused: false,
				isWin: true,
				isSaved: false,
				gameType,
			});
			/** keep completed games update status pending if not signed in */
			if (!isUser) {
				dispatch({ type: 'SET_GAMECOMPLETE', isUpdatePending: true });
			}
		}
	}, []);

	/* set user status */
	useEffect(() => {
		userStatus &&
			dispatch({
				type: 'SET_USERSTATUS',
				isUser: userStatus.isUser,
				isDeleted: false,
			});
	}, [userStatus]);

	if (isPending) return null;
	return (
		<div className='App grid grid--top' data-theme={theme}>
			<BrowserRouter>
				<ThemeContextProvider setTheme={setTheme}>
					<Navbar state={state} />
					<Routes>
						<Route
							exact
							path='/'
							element={
								!isPaused && !isWin ? (
									<GameSelection />
								) : gameType === 'BingoWithGrid' ? (
									<Navigate to='/game/grid' />
								) : (
									<Navigate to='/game/no-grid' />
								)
							}
						/>
						<Route
							path='/game/grid'
							element={
								gameType === 'BingoNoGrid' ? (
									<Navigate to='/game/no-grid' />
								) : (
									<GameContextProvider state={state} dispatch={dispatch}>
										<BingoWithGrid userStatus={state.userStatus} />
									</GameContextProvider>
								)
							}
						/>
						<Route
							path='/game/no-grid'
							element={
								gameType === 'BingoWithGrid' ? (
									<Navigate to='/game/grid' />
								) : (
									<GameContextProvider state={state} dispatch={dispatch}>
										<BingoNoGrid userStatus={state.userStatus} />
									</GameContextProvider>
								)
							}
						/>
						<Route
							path='/login'
							element={
								isUser ? (
									<Navigate to='/' />
								) : (
									<LogIn userStatus={state.userStatus} dispatch={dispatch} />
								)
							}
						/>
						<Route path='/myaccount' element={<Navigate to='overview' />} />
						<Route
							path='/myaccount/*'
							element={
								!isUser ? (
									<Navigate to='/login' />
								) : (
									<MyAccount dispatch={dispatch} />
								)
							}
						/>
						<Route
							path='/resetpw/:id/:token'
							element={<ResetPassword userStatus={state.userStatus} />}
						/>
						<Route
							path='/signup'
							element={
								isUser ? <Navigate to='/' /> : <SignUp dispatch={dispatch} />
							}
						/>
						<Route path='/generated/:quantity' />
						<Route path='/privacy-policy' element={<PrivacyPolicy />} />
						<Route path='*' element={<Navigate to='/' />} />
					</Routes>
				</ThemeContextProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
