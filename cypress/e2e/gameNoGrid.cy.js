describe('bingo game with grid', () => {
	beforeEach(() => {
		cy.apiCheckUser(false);
	});

	it('displays error when unable to get api req', () => {
		cy.apiGetNumbers(false);
		cy.visit('/game/no-grid');
		cy.wait(800);
		cy.get('.game__error')
			.contains('An error has occurred, could not fetch data.')
			.should('be.visible');
	});
	it('displays two random matching called number elements when call button is clicked', () => {
		cy.apiGetNumbers(true);
		cy.visit('/game/no-grid');
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
		cy.visit('/game/no-grid');
		cy.wait(800);
		/** click through all possible numbers */
		for (let n = 0; n < maxNumbers; n++) {
			cy.get('.b-buttons__btn--icon').click();
		}
		cy.get('.numbers__list>li').should('have.length', maxNumbers);
		cy.get('.b-buttons__btn--icon').should('be.disabled');
	});
	it('displays winBox component when bingo button is clicked and confirmed', () => {
		cy.apiGetNumbers(true);
		cy.visit('/game/no-grid');
		cy.wait(800);
		cy.get('.b-buttons__btn:nth-of-type(2)').click();
		cy.get('.game__win').should('be.visible');
	});
	it('displays pauseBox component when pause button is clicked', () => {
		cy.apiGetNumbers(true);
		cy.visit('/game/no-grid');
		cy.wait(800);
		cy.get('#btnPause').click();
		cy.get('.paused').should('be.visible');
	});
	it('displays generateBox component when generate button is clicked', () => {
		cy.apiGetNumbers(true);
		cy.visit('/game/no-grid');
		cy.wait(800);
		cy.get('.generate-cards').click();
		cy.get('.generate').should('be.visible');
	});
	it('displays color change when dark mode switch is toggled', () => {
		cy.apiGetNumbers(true);
		cy.visit('/game/no-grid');
		cy.wait(800);
		cy.get('.switch').click();
		cy.get('.numbers--no-grid').should(
			'have.css',
			'background-color',
			'rgb(96, 31, 92)'
		);
	});
});
