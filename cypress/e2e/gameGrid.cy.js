describe('bingo game with grid', () => {
	beforeEach(() => {
		cy.apiCheckUser(false);
	});

	it('displays two random matching called number elements when call button is clicked', () => {
		cy.apiGetCells(true);
		cy.apiGetNumbers(true);
		cy.visit('/game/grid');
		cy.wait(800);
		cy.get('.b-buttons__btn--icon').click();
		cy.get('.numbers__circle').should('have.length', 2);
		/** match both elements (letter and number) */
		cy.get('.numbers__circle').then(($el) => {
			cy.matchCalledEls($el);
		});
	});
	it('should disable button when there are no more numbers to call', () => {
		let maxNumbers = 75;
		cy.apiGetNonPlayableCells(); // enures no winning matches will occur
		cy.apiGetNumbers(true);
		cy.visit('/game/grid');
		cy.wait(800);
		/** click through all possible numbers */
		for (let n = 0; n < maxNumbers; n++) {
			cy.get('.b-buttons__btn--icon').click();
		}
		cy.get('.numbers__list>li').should('have.length', maxNumbers);
		cy.get('.b-buttons__btn--icon').should('be.disabled');
	});
	it('displays winBox component when bingo button is clicked and confirmed', () => {
		cy.apiGetCells(true);
		cy.apiGetNumbers(true);
		cy.visit('/game/grid');
		cy.wait(800);
		cy.get('.b-buttons__btn:nth-of-type(2)').click();
		cy.get('.game__win').should('be.visible');
	});
	it('displays pauseBox component when pause button is clicked', () => {
		cy.apiGetCells(true);
		cy.apiGetNumbers(true);
		cy.visit('/game/grid');
		cy.wait(800);
		cy.get('#btnPause').click();
		cy.get('.paused').should('be.visible');
	});
	it('displays generateBox component when generate button is clicked', () => {
		cy.apiGetCells(true);
		cy.apiGetNumbers(true);
		cy.visit('/game/grid');
		cy.wait(800);
		cy.get('.generate-cards').click();
		cy.get('.generate').should('be.visible');
	});
	it('displays color change when dark mode switch is toggled', () => {
		cy.apiGetCells(true);
		cy.apiGetNumbers(true);
		cy.visit('/game/grid');
		cy.wait(800);
		cy.get('.switch').click();
		cy.get('.b-grid__nbr').should(
			'have.css',
			'background-color',
			'rgb(96, 31, 92)'
		);
	});
	it('displays grid numbers after api req', () => {
		cy.apiGetNumbers(true);
		cy.apiGetCells(true);
		cy.visit('/game/grid');
		cy.wait(800);
		cy.get('.b-grid__nbr').should('have.length', 25);
		cy.get('.b-grid')
			.contains('An error has occurred, could not fetch data.')
			.should('not.exist');
	});
	it('displays error when unable to get api req', () => {
		cy.apiGetCells(false);
		cy.apiGetNumbers(false);
		cy.visit('/game/grid');
		cy.wait(800);
		cy.get('.b-grid')
			.contains('An error has occurred, could not fetch data.')
			.should('be.visible');
	});
	it('should call new random number and append element every time button is clicked', () => {
		cy.apiGetCells(true);
		cy.apiGetNumbers(true);
		cy.visit('/game/grid');
		cy.wait(800);
		cy.get('.b-buttons__btn--icon').click().click().click().click();
		cy.get('.numbers__list>li').should('have.length', 4);
		/** match current and last called numbers */
		cy.get('.numbers__current,.numbers__list>li:last-of-type').then(($el) => {
			cy.matchCalledEls($el);
		});
	});
	it('should be able to scroll (wheel) called numbers when component becomes overflowed', () => {
		cy.apiGetNonPlayableCells();
		cy.apiGetNumbers(true);
		cy.visit('/game/grid');
		cy.wait(800);
		/** fill component with numbers */
		for (let n = 0; n < 15; n++) {
			cy.get('.b-buttons__btn--icon').click();
		}
		cy.get('#scroller ul').then(($ul) => {
			const initialPos = $ul.position().left;
			/** scroll (-)left */
			cy.get('#scroller')
				.scrollTo(99999, 0, { ensureScrollable: false })
				.then(($scroller) => {
					cy.get('#scroller ul').then(($ul) => {
						const currentPos = $ul.position().left;
						/** expect to not be in original position after scroll */
						expect(initialPos).to.not.equal(currentPos);
					});
				});
			/** scroll (+)left (original pos) */
			cy.get('#scroller')
				.scrollTo(-99999, 0, { ensureScrollable: false })
				.then(($scroller) => {
					cy.get('#scroller ul').then(($ul) => {
						const currentPos = $ul.position().left;
						/** expect to be in original position after scroll */
						expect(initialPos).to.equal(currentPos);
					});
				});
		});
	});
	it('should be able to click and drag called numbers when component is overflowed', () => {
		cy.apiGetNonPlayableCells();
		cy.apiGetNumbers(true);
		cy.visit('/game/grid');
		cy.wait(800);
		/** fill component with numbers */
		for (let n = 0; n < 15; n++) {
			cy.get('.b-buttons__btn--icon').click();
		}
		cy.get('#scroller ul').then(($ul) => {
			const initialPos = $ul.position().left;
			/** drag (-)left */
			cy.get('#scroller')
				.trigger('mousedown', 5000, 5000, { button: 0, force: true })
				.trigger('mousemove', { clientX: 999999, clientY: 0 })
				.trigger('mouseup', { force: true })
				.then(($scroller) => {
					cy.get('#scroller ul').then(($ul) => {
						const currentPos = $ul.position().left;
						/** expect to not be in original position after scroll */
						expect(initialPos).to.not.equal(currentPos);
					});
				});
			/** drag (+)left */
			cy.get('#scroller')
				.trigger('mousedown', -5000, -5000, { button: 0, force: true })
				.trigger('mousemove', { clientX: 999999, clientY: 0 })
				.trigger('mouseup', { force: true })
				.then(($scroller) => {
					cy.get('#scroller ul').then(($ul) => {
						const currentPos = $ul.position().left;
						/** expect to be in original position after scroll */
						expect(initialPos).to.equal(currentPos);
					});
				});
		});
	});
	it('should match a called number with numbers in grid', () => {
		cy.apiGetCells(true);
		cy.apiGetFixedNumbers(); // guaranteed to match a number on grid
		cy.visit('/game/grid');
		cy.wait(800);
		cy.get('li.b-grid__match').should('not.exist');
		cy.get('.b-buttons__btn--icon').click();
		cy.get('li.b-grid__match').should('be.visible');
	});

	/* test win conditions */
	describe('bingo game with grid winning conditions', () => {
		/** COLUMNS */
		it('should win the game when a match of 5 occurs (1/12)', () => {
			cy.apiGetWinCells('column');
			cy.apiGetWinNumbersColumn(1); // only specified number will be called
			cy.visit('/game/grid');
			cy.wait(800);
			cy.get('.b-buttons__btn--icon').click();
			cy.get('.game__win', { timeout: 5000 }).should('be.visible');
		});
		it('should win the game when a match of 5 occurs (2/12)', () => {
			cy.apiGetWinCells('column');
			cy.apiGetWinNumbersColumn(2);
			cy.visit('/game/grid');
			cy.wait(800);
			cy.get('.b-buttons__btn--icon').click();
			cy.get('.game__win', { timeout: 5000 }).should('be.visible');
		});
		it('should win the game when a match of 5 occurs (3/12)', () => {
			cy.apiGetWinCells('column');
			cy.apiGetWinNumbersColumn(3);
			cy.visit('/game/grid');
			cy.wait(800);
			cy.get('.b-buttons__btn--icon').click();
			cy.get('.game__win', { timeout: 5000 }).should('be.visible');
		});
		it('should win the game when a match of 5 occurs (4/12)', () => {
			cy.apiGetWinCells('column');
			cy.apiGetWinNumbersColumn(4);
			cy.visit('/game/grid');
			cy.wait(800);
			cy.get('.b-buttons__btn--icon').click();
			cy.get('.game__win', { timeout: 5000 }).should('be.visible');
		});
		it('should win the game when a match of 5 occurs (5/12)', () => {
			cy.apiGetWinCells('column');
			cy.apiGetWinNumbersColumn(5);
			cy.visit('/game/grid');
			cy.wait(800);
			cy.get('.b-buttons__btn--icon').click();
			cy.get('.game__win', { timeout: 5000 }).should('be.visible');
		});
		/** ROWS */
		it('should win the game when a match of 5 occurs (6/12)', () => {
			cy.apiGetWinCells('row');
			cy.apiGetWinNumbersRow(1);
			cy.visit('/game/grid');
			cy.wait(800);
			for (let n = 0; n < 5; n++) {
				cy.get('.b-buttons__btn--icon').click({ force: true });
			}
			cy.get('.game__win', { timeout: 5000 }).should('be.visible');
		});
		it('should win the game when a match of 5 occurs (7/12)', () => {
			cy.apiGetWinCells('row');
			cy.apiGetWinNumbersRow(2);
			cy.visit('/game/grid');
			cy.wait(800);
			for (let n = 0; n < 5; n++) {
				cy.get('.b-buttons__btn--icon').click({ force: true });
			}
			cy.get('.game__win', { timeout: 5000 }).should('be.visible');
		});
		it('should win the game when a match of 5 occurs (8/12)', () => {
			cy.apiGetWinCells('row');
			cy.apiGetWinNumbersRow(3);
			cy.visit('/game/grid');
			cy.wait(800);
			for (let n = 0; n < 5; n++) {
				cy.get('.b-buttons__btn--icon').click({ force: true });
			}
			cy.get('.game__win', { timeout: 5000 }).should('be.visible');
		});
		it('should win the game when a match of 5 occurs (9/12)', () => {
			cy.apiGetWinCells('row');
			cy.apiGetWinNumbersRow(4);
			cy.visit('/game/grid');
			cy.wait(800);
			for (let n = 0; n < 5; n++) {
				cy.get('.b-buttons__btn--icon').click({ force: true });
			}
			cy.get('.game__win', { timeout: 5000 }).should('be.visible');
		});
		it('should win the game when a match of 5 occurs (10/12)', () => {
			cy.apiGetWinCells('row');
			cy.apiGetWinNumbersRow(5);
			cy.visit('/game/grid');
			cy.wait(800);
			for (let n = 0; n < 5; n++) {
				cy.get('.b-buttons__btn--icon').click({ force: true });
			}
			cy.get('.game__win', { timeout: 5000 }).should('be.visible');
		});
		/** DIAGONALS */
		it('should win the game when a match of 5 occurs (11/12)', () => {
			cy.apiGetWinCells('diagonal');
			cy.apiGetWinNumbersDia(1);
			cy.visit('/game/grid');
			cy.wait(800);
			for (let n = 0; n < 4; n++) {
				cy.get('.b-buttons__btn--icon').click({ force: true });
			}
			cy.get('.game__win', { timeout: 5000 }).should('be.visible');
		});
		it('should win the game when a match of 5 occurs (12/12)', () => {
			cy.apiGetWinCells('diagonal');
			cy.apiGetWinNumbersDia(2);
			cy.visit('/game/grid');
			cy.wait(800);
			for (let n = 0; n < 4; n++) {
				cy.get('.b-buttons__btn--icon').click({ force: true });
			}
			cy.get('.game__win', { timeout: 5000 }).should('be.visible');
		});
	});
});
