import { Link } from 'react-router-dom';
import Switch from './Interface/Switch';
import bingoCardSVG from '../Assets/svg/bingo-card.svg';
import userSVG from '../Assets/svg/user.svg';

const Navbar = (props) => {
	const { isUser } = props.state.userStatus;
	const { isPaused, isWin } = props.state.gameStatus;

	return (
		<header data-paused={isPaused}>
			<nav className='nav bs-400 grid'>
				<ul className='nav__links grid txt-white'>
					<li>
						<Link
							className='nav__btn btn btn--tp-light pd-200 fw-black hv-op-50'
							to='/'
						>
							{!isPaused && !isWin ? 'new game' : 'continue'}
						</Link>
					</li>
					{!isUser ? (
						<>
							<li>
								<Link className='nav__link flex' to='/login'>
									log in
									<img
										className='nav__icon'
										src={bingoCardSVG}
										alt='bingo card icon'
									/>
								</Link>
							</li>
							<li>
								<Link className='nav__link flex' to='/signup'>
									sign up
									<img className='nav__icon' src={userSVG} alt='user icon' />
								</Link>
							</li>
						</>
					) : (
						<>
							<li>
								<Link className='nav__link flex' to='/myaccount/saved'>
									saved games
									<img
										className='nav__icon'
										src={bingoCardSVG}
										alt='bingo card icon'
									/>
								</Link>
							</li>
							<li>
								<Link className='nav__link flex' to='/myaccount/overview'>
									my account
									<img className='nav__icon' src={userSVG} alt='user icon' />
								</Link>
							</li>
						</>
					)}
					<div className='nav__toggle flex'>
						<Switch />
					</div>
				</ul>
			</nav>
		</header>
	);
};

export default Navbar;
