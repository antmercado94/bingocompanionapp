import { useContext } from 'react';
import { UpdateUserContext } from '../Contexts/UpdateUserContext';

const MyOverview = (props) => {
	const {
		name,
		completedGames,
		savedGames,
		localeDate: lastCompletedGame,
	} = props.overView;
	const { userNameUpdated, currentName } = useContext(UpdateUserContext);
	const { isErased } = useContext(UpdateUserContext);

	return (
		<section className='acc-area__section section section--overview flex'>
			<h1 className='section__header fw-bold'>overview</h1>
			<ul className='section__item flex'>
				<span className='section__name'>name:</span>
				<li className='section__value fw-bold' data-testid='userDataName'>
					{!userNameUpdated ? name : currentName}
				</li>
			</ul>
			<ul className='section__item flex'>
				<span className='section__name'>completed games:</span>
				<li className='section__value fw-bold' data-testid='completedGames'>
					{completedGames}
				</li>
			</ul>
			<ul className='section__item flex'>
				<span className='section__name'>saved games:</span>
				<li className='section__value fw-bold' data-testid='savedGames'>
					{!isErased ? savedGames : 0}
				</li>
			</ul>
			<ul className='section__item flex'>
				<span className='section__name'>last completed game:</span>
				<li className='section__value fw-bold'>{lastCompletedGame}</li>
			</ul>
		</section>
	);
};

export default MyOverview;
