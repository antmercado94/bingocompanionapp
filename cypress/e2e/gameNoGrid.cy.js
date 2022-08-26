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
		cy.apiGetNonPlayableCells(); // enures no winning matches will occur
		cy.apiGetNumbers(true);
		cy.visit('/game/no-grid');
		cy.wait(800);
		/** click through all possible numbers (100)*/
		for (let n = 0; n < 100; n++) {
			cy.get('.b-buttons__btn--icon').click();
		}
		cy.get('.numbers__list>li').should('have.length', 100);
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
	it('should be able to click and drag called numbers when component is overflowed', () => {
		cy.apiGetNumbers(true);
		cy.visit('/game/no-grid');
		cy.wait(800);
		/** fill component with numbers */
		for (let n = 0; n < 78; n++) {
			cy.get('.b-buttons__btn--icon').click();
		}
		cy.get('#scroller ul').then(($ul) => {
			const initialPos = $ul.position().top;
			/** drag (-)top */
			cy.get('#scroller')
				.trigger('mousedown', 5000, 5000, { button: 0, force: true })
				.trigger('mousemove', { clientX: 0, clientY: -999999 })
				.trigger('mouseup', { force: true })
				.then(($scroller) => {
					cy.get('#scroller ul').then(($ul) => {
						const currentPos = $ul.position().top;
						/** expect to not be in original position after scroll */
						expect(initialPos).to.not.equal(currentPos);
					});
				});
			/** drag (+)top */
			cy.get('#scroller')
				.trigger('mousedown', -5000, -5000, { button: 0, force: true })
				.trigger('mousemove', { clientX: 0, clientY: 999999 })
				.trigger('mouseup', { force: true })
				.then(($scroller) => {
					cy.get('#scroller ul').then(($ul) => {
						const currentPos = $ul.position().top;
						/** expect to be in original position after scroll */
						expect(initialPos).to.equal(currentPos);
					});
				});
		});
	});
});
