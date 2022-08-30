import { useContext, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { UpdateUserContext } from '../Contexts/UpdateUserContext';
import GameRecords from '../Components/GameRecords';
import { returnColLetter, returnColClass } from './Helpers/colClassHelper';

const MyGames = (props) => {
	const { isErased } = useContext(UpdateUserContext);

	const records = !isErased ? props.records : '';

	const [pageNumber, setPageNumber] = useState(0);
	const [gameData, setGameData] = useState({
		dateSaved: '',
		winner: '',
		calledNumbers: '',
	});

	/* called numbers pagination */
	const numbersPerPage = 36;
	const pagesVisited = pageNumber * numbersPerPage;

	const displayNumbers =
		gameData.calledNumbers &&
		gameData.calledNumbers
			.slice(pagesVisited, pagesVisited + numbersPerPage)
			.map((bNum, index) => (
				<li
					className={`numbers__circle ${returnColClass(
						bNum[0]
					)} txt-black bg-white bs-400`}
					key={index}
				>
					<span className='numbers__letter fw-bold'>
						{returnColLetter(bNum[0])}
					</span>
					<span className='numbers__num'>{bNum[1]}</span>
				</li>
			));

	const pageCount = Math.ceil(gameData.calledNumbers.length / numbersPerPage);

	const changePage = ({ selected }) => {
		/** add/reset animation classes */
		const numbersEl = document.querySelector(
			'.section__numbers .numbers__list'
		);
		let sectionClass = numbersEl.classList[0];
		let animateClass = sectionClass + '--animate';
		numbersEl.classList.remove(animateClass);
		void numbersEl.offsetWidth;
		numbersEl.classList.add(animateClass);

		setPageNumber(selected);
	};

	return (
		<section className='acc-area__section section section--records flex'>
			<div className='section__half flex'>
				<h1 className='section__header fw-bold'>game records</h1>
				<ul className='section__item flex'>
					<span className='section__name'>date saved:</span>
					<li className='section__value user-data fw-bold'>
						{gameData.dateSaved}
					</li>
				</ul>
				<ul className='section__item flex'>
					<span className='section__name'>winner:</span>
					<li className='section__value user-data fw-bold'>
						{gameData.winner}
					</li>
				</ul>
				<section className='section__numbers section__container'>
					<ul className='numbers__list user-data grid'>{displayNumbers}</ul>
				</section>
				<section className='section__pagination pagination'>
					<ReactPaginate
						renderOnZeroPageCount={null}
						previousLabel={''}
						nextLabel={''}
						pageCount={pageCount === 1 ? 0 : pageCount}
						onPageChange={changePage}
						pageLabelBuilder={(page) => (
							<span className='pagination__circle'></span>
						)}
						containerClassName={'pagination__container'}
						previousLinkClassName={'pagination__previous'}
						nextLinkClassName={'pagination__next'}
						disabledClassName={'pagination__disabled'}
						activeClassName={'pagination__active'}
						forcePage={pageNumber}
					/>
				</section>
			</div>
			<div className='section__half'>
				<section className='section__records records section__container flex'>
					{records && (
						<GameRecords
							records={records}
							setGameData={setGameData}
							setPageNumber={setPageNumber}
						/>
					)}
				</section>
			</div>
		</section>
	);
};

export default MyGames;
