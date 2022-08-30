import { useState } from 'react';
import ReactPaginate from 'react-paginate';
import bingoCardSVG from '../Assets/svg/bingo-card.svg';
import pickerSVG from '../Assets/svg/number-picker.svg';

const GameRecords = (props) => {
	const games = props.records.games;
	const { setGameData, setPageNumber: setCalledPageNumber } = props;
	const [pageNumber, setPageNumber] = useState(0);
	const [activeRecord, setActiveRecord] = useState();

	/* covert date to show M/D for record icons */
	const convertDate = (date) => {
		const dateObj = new Date(date);
		const localeDate =
			dateObj.toLocaleDateString() +
			' ' +
			dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		const dateMonthYear = localeDate.split('/').slice(0, 2).join('/');

		return dateMonthYear;
	};

	/* show game details */
	const revealDetails = (game, target, isTouch) => {
		const dateObj = new Date(game.dateSaved);
		const localeDate =
			dateObj.toLocaleDateString() +
			' ' +
			dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		setGameData({
			dateSaved: localeDate,
			winner: game.winner,
			calledNumbers: game.calledNumbers,
		});

		/** hover */
		if (!isTouch) {
			if (target.nodeName === 'LI') {
				if (target !== activeRecord) {
					/** add/reset animation classes */
					const userDataEls = document.querySelectorAll('.user-data');
					userDataEls.forEach((el) => {
						let sectionClass = el.classList[0];
						let animateClass = sectionClass + '--animate';
						el.classList.remove(animateClass);
						void el.offsetWidth;
						el.classList.add(animateClass);
					});
					/** reset pagination of called numbers */
					setCalledPageNumber(0);
				}
				setActiveRecord(target);
			}
		} else {
			/** mobile touch event */
			if (
				target.nodeName === 'LI' ||
				target.nodeName === 'SPAN' ||
				target.nodeName === 'IMG'
			) {
				if (target.closest('li') !== activeRecord) {
					/** add/reset animation classes */
					const userDataEls = document.querySelectorAll('.user-data');
					userDataEls.forEach((el) => {
						let sectionClass = el.classList[0];
						let animateClass = sectionClass + '--animate';
						el.classList.remove(animateClass);
						void el.offsetWidth;
						el.classList.add(animateClass);
					});
					/** reset pagination of called numbers */
					setCalledPageNumber(0);
				}
				setActiveRecord(target.closest('li'));
			}
		}
	};

	/* record icon based on game type */
	const gameType = (withGrid) => {
		/** grid game type */
		if (!withGrid)
			return (
				<img
					className='records__icon records__icon--picker'
					src={pickerSVG}
					alt='Number Picker'
				/>
			);
		/** no-grid game type */
		return (
			<>
				<img
					className='records__icon records__icon--picker'
					src={pickerSVG}
					alt='Number Picker'
				/>
				<img
					className='records__icon records__icon--card'
					src={bingoCardSVG}
					alt='Bingo Card'
				/>
			</>
		);
	};

	/* game records pagination */
	const recordsPerPage = 12;
	const pagesVisited = pageNumber * recordsPerPage;

	const displayRecords = games
		.slice(pagesVisited, pagesVisited + recordsPerPage)
		.map((game) => (
			<li
				onMouseOver={(e) => revealDetails(game, e.target, false)}
				onTouchStart={(e) => revealDetails(game, e.target, true)}
				className='records__item txt-white bg-indigo-400 bs-400 flex--center'
				key={game._id}
			>
				<span className='records__date fw-bold'>
					{convertDate(game.dateSaved)}
				</span>
				<span className='records__type'>{gameType(game.withGrid)}</span>
			</li>
		));

	const pageCount = Math.ceil(games.length / recordsPerPage);

	const changePage = ({ selected }) => {
		/** add/reset animation classes */
		const recordsEl = document.querySelector(
			'.section__records .records__list'
		);
		let sectionClass = recordsEl.classList[0];
		let animateClass = sectionClass + '--animate';
		recordsEl.classList.remove(animateClass);
		void recordsEl.offsetWidth;
		recordsEl.classList.add(animateClass);

		setPageNumber(selected);
	};
	return (
		<>
			<div className='records__container'>
				<ul className='records__list grid'>{displayRecords}</ul>
			</div>
			<ReactPaginate
				renderOnZeroPageCount={null}
				previousLabel={'<'}
				nextLabel={'>'}
				pageCount={pageCount === 1 ? 0 : pageCount}
				onPageChange={changePage}
				pageLabelBuilder={(page) => null}
				containerClassName={'pagination__container'}
				previousLinkClassName={'pagination__previous'}
				nextLinkClassName={'pagination__next'}
				disabledClassName={'pagination__disabled'}
				activeClassName={'pagination__active'}
			/>
		</>
	);
};

export default GameRecords;
