import { useEffect, useState } from 'react';
import {
	Link,
	Routes,
	Route,
	useLocation,
	useNavigate,
	Navigate,
} from 'react-router-dom';
import UpdateUserContextProvider from '../../Contexts/UpdateUserContext';
import { logout } from '../../Components/Helpers/httpReqHelper';
import useFetch from '../../Components/Hooks/useFetch';
import MyOverview from '../../Components/MyOverview';
import MyGames from '../../Components/MyGames';
import MyConfig from '../../Components/MyConfig';
import ResetBox from '../../Components/ResetBox';
import bingoCardSVG from '../../Assets/svg/bingo-card.svg';
import clockSVG from '../../Assets/svg/clock.svg';
import configSVG from '../../Assets/svg/config.svg';
import Loading from '../../Components/Interface/Loading';

const MyAccount = (props) => {
	const { dispatch } = props;
	const { data, isPending, error } = useFetch('/api/get_user');
	const [userData, setUserData] = useState({
		overView: null,
		records: null,
		settings: null,
	});
	const [activePane, setActivePane] = useState({
		overview: false,
		saved: false,
		settings: false,
	});
	const [resetMsg, setResetMsg] = useState({ reset: null });
	const [lightBoxHidden, setLightBoxHidden] = useState(true);

	const [isImage1Loaded, setIsImage1Loaded] = useState(false);
	const [isImage2Loaded, setIsImage2Loaded] = useState(false);
	const [isImage3Loaded, setIsImage3Loaded] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();
	const slug = location.pathname.slice(11);

	/* auth check */
	useEffect(() => {
		/** redirect */
		if (error) {
			dispatch({ type: 'SET_USERSTATUS', isUser: false, isDeleted: false });
			return navigate('/login', {
				state: { message: 'Please log in to continue.' },
			});
		}
	}, [error]);

	/* seperate user data used towards three sub-components */
	useEffect(() => {
		/** redirect */
		if (error) {
			dispatch({ type: 'SET_USERSTATUS', isUser: false, isDeleted: false });
			return navigate('/login', {
				state: { message: 'Please log in to continue.' },
			});
		}
		if (!data) return;
		const {
			name,
			email,
			completedGames,
			lastCompletedGame,
			savedGames,
			games,
		} = data.userData;

		/** handle date obj */
		let localeDate;
		if (lastCompletedGame) {
			const dateObj = new Date(lastCompletedGame);
			localeDate =
				dateObj.toLocaleDateString() +
				' ' +
				dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		} else {
			localeDate = 'no games yet';
		}

		/** seperate user data */
		const overViewData = { name, completedGames, savedGames, localeDate },
			recordsData = { games },
			settingsData = { name, email };
		setUserData({
			overView: overViewData,
			records: recordsData,
			settings: settingsData,
		});
	}, [data]);

	/* toggle active pane */
	useEffect(() => {
		switch (slug) {
			case 'overview':
				setActivePane({ overview: true, saved: false, settings: false });
				break;
			case 'saved':
				setActivePane({ overview: false, saved: true, settings: false });
				break;
			case 'settings':
				setActivePane({ overview: false, saved: false, settings: true });
				break;
		}
	}, [location]);

	/* log out user */
	const getLogout = () => {
		/** remove jwt, local storage, and redirect */
		logout().then(() => {
			localStorage.removeItem('pausedGame');
			localStorage.removeItem('winGame');
			dispatch({ type: 'SET_USERSTATUS', isUser: false, isDeleted: false });
			dispatch({
				type: 'SET_GAMESTATUS',
				isPaused: false,
				isWin: false,
				isSaved: false,
				gameType: null,
			});
			navigate('/', { replace: true });
		});
	};

	/* toggle reset pw lightbox */
	const toggleLightBox = () => {
		setLightBoxHidden(!lightBoxHidden);
	};

	//if (isPending) return null;
	return (
		<main className='acc-area grid grid--main'>
			<section className='acc-area__container container grid'>
				<section className='acc-area__pane pane bg-red-400 flex'>
					<ul className='pane__list flex'>
						<li className='pane__item' data-active={activePane.overview}>
							<img
								className={`pane__img ${
									!isImage1Loaded && !isImage2Loaded && !isImage3Loaded
										? 'skeleton'
										: 'pane__img--animated'
								}`}
								src={clockSVG}
								alt='Overview'
								onLoad={() => setIsImage1Loaded(true)}
							/>
							<Link
								to={'overview'}
								className='pane__route'
								data-value='overview'
							></Link>
						</li>
						<li className='pane__item' data-active={activePane.saved}>
							<img
								className={`pane__img ${
									!isImage1Loaded && !isImage2Loaded && !isImage3Loaded
										? 'skeleton'
										: 'pane__img--animated'
								}`}
								src={bingoCardSVG}
								alt='Saved'
								onLoad={() => setIsImage2Loaded(true)}
							/>
							<Link
								to={'saved'}
								className='pane__route'
								data-value='saved'
							></Link>
						</li>
						<li className='pane__item' data-active={activePane.settings}>
							<img
								className={`pane__img ${
									!isImage1Loaded && !isImage2Loaded && !isImage3Loaded
										? 'skeleton'
										: 'pane__img--animated'
								}`}
								src={configSVG}
								alt='Settings'
								onLoad={() => setIsImage3Loaded(true)}
							/>
							<Link
								to={'settings'}
								className='pane__route'
								data-value='settings'
							></Link>
						</li>
					</ul>
					<a
						onClick={getLogout}
						className='pane__link txt-white fw-bold fs-200'
					>
						sign out
					</a>
				</section>
				<section
					className={`acc-area__main ${
						!isPending ? 'txt-white acc-area__main--animate' : 'flex--center'
					}`}
				>
					{!isPending ? (
						<UpdateUserContextProvider
							settings={userData.settings ? userData.settings : ''}
						>
							<Routes>
								<Route
									exact
									path='overview'
									element={
										<MyOverview
											overView={userData.overView ? userData.overView : ''}
										/>
									}
								/>
								<Route
									exact
									path='saved'
									element={
										<MyGames
											records={userData.records ? userData.records : ''}
										/>
									}
								/>
								<Route
									exact
									path='settings'
									element={
										<MyConfig
											settings={userData.settings ? userData.settings : ''}
											lightBoxHidden={lightBoxHidden}
											toggleLightBox={toggleLightBox}
											resetMsg={resetMsg}
											setResetMsg={setResetMsg}
											dispatch={dispatch}
										/>
									}
								/>
								<Route exact path='*' element={<Navigate to='overview' />} />
							</Routes>
						</UpdateUserContextProvider>
					) : (
						<Loading />
					)}
				</section>
			</section>
			<section className='lightbox' data-hidden={lightBoxHidden}>
				<ResetBox setResetMsg={setResetMsg} lightBoxHidden={lightBoxHidden} />
				<div onClick={toggleLightBox} className='lightbox__overlay'></div>
			</section>
		</main>
	);
};

export default MyAccount;
