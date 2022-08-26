describe('functionality that makes use of local storage', () => {
	beforeEach(() => {
		cy.apiCheckUser(false);
	});

	/* pause game */
	describe('pause game functionality', () => {
		/** grid */
		describe('grid pause functionality', () => {
			it('tests pause functionality is enabled and remains active when switching routes', () => {
				cy.apiGetCells(true);
				cy.apiGetNumbers(true);
				cy.visit('/game/grid');
				cy.wait(800);
				cy.get('.b-buttons__btn--icon').click().click().click();
				cy.get('#btnPause').click();
				cy.get('.paused').should('be.visible');
				cy.get('.nav__btn').contains('continue').should('be.visible');
				cy.get('.nav__link').contains('log in').click();
				cy.get('main.form-area.grid.grid--main').should('be.visible');
				cy.get('.nav__btn').contains('continue').click();
				cy.get('.paused').should('be.visible');
				cy.get('.numbers__circles').should('have.length', 3);
			});
			it('tests redirect from root to current grid game when pause is active', () => {
				cy.apiGetCells(true);
				cy.apiGetNumbers(true);
				cy.visit('/game/grid');
				cy.wait(800);
				cy.get('.b-buttons__btn--icon').click().click().click();
				cy.get('#btnPause').click();
				cy.get('.paused').should('be.visible');
				cy.visit('/');
				cy.get('main.selection').should('not.exist');
				cy.get('main.game--grid').should('exist');
				cy.get('.paused').should('be.visible');
				cy.get('.numbers__circles').should('have.length', 3);
			});
			it('tests redirect from no-grid to current grid game when pause is active', () => {
				cy.apiGetCells(true);
				cy.apiGetNumbers(true);
				cy.visit('/game/grid');
				cy.wait(800);
				cy.get('.b-buttons__btn--icon').click().click().click();
				cy.get('#btnPause').click();
				cy.get('.paused').should('be.visible');
				cy.visit('/game/no-grid');
				cy.get('main.game--no-grid').should('not.exist');
				cy.get('main.game--grid').should('exist');
				cy.get('.paused').should('be.visible');
				cy.get('.numbers__circles').should('have.length', 3);
			});
			it('tests pause box clears localstorage after new game button is clicked', () => {
				cy.apiGetCells(true);
				cy.apiGetNumbers(true);
				cy.visit('/game/grid');
				cy.wait(800);
				cy.get('.b-buttons__btn--icon').click().click().click();
				cy.get('#btnPause').click();
				cy.get('.paused').should('be.visible');
				cy.get('.nav__btn').contains('continue').should('be.visible');
				cy.get('.nav__link').contains('log in').click();
				cy.get('main.form-area.grid.grid--main').should('be.visible');
				cy.get('.nav__btn').contains('continue').click();
				cy.get('.paused').should('be.visible');
				cy.get('.numbers__circles').should('have.length', 3);
				cy.get('.form-area__btn').contains('new game').click({ force: true });
				cy.clearLocalStorage();
				cy.get('main.selection').should('be.visible');
				cy.get('.selection__link[href="/game/grid"]').click();
				cy.get('.numbers__circles').should('not.exist');
			});
		});
		/** no-grid */
		describe('no-grid pause functionality', () => {
			it('tests pause functionality is enabled and remains active when switching routes', () => {
				cy.apiGetNumbers(true);
				cy.visit('/game/no-grid');
				cy.wait(800);
				cy.get('.b-buttons__btn--icon').click().click().click();
				cy.get('#btnPause').click();
				cy.get('.paused').should('be.visible');
				cy.get('.nav__btn').contains('continue').should('be.visible');
				cy.get('.nav__link').contains('log in').click();
				cy.get('main.form-area.grid.grid--main').should('be.visible');
				cy.get('.nav__btn').contains('continue').click();
				cy.get('.paused').should('be.visible');
				cy.get('.numbers__circles').should('have.length', 3);
			});
			it('tests redirect from root to current grid game when pause is active', () => {
				cy.apiGetCells(true);
				cy.apiGetNumbers(true);
				cy.visit('/game/no-grid');
				cy.wait(800);
				cy.get('.b-buttons__btn--icon').click().click().click();
				cy.get('#btnPause').click();
				cy.get('.paused').should('be.visible');
				cy.visit('/');
				cy.get('main.selection').should('not.exist');
				cy.get('main.game--no-grid').should('exist');
				cy.get('.paused').should('be.visible');
				cy.get('.numbers__circles').should('have.length', 3);
			});
			it('tests redirect from no-grid to current grid game when pause is active', () => {
				cy.apiGetCells(true);
				cy.apiGetNumbers(true);
				cy.visit('/game/no-grid');
				cy.wait(800);
				cy.get('.b-buttons__btn--icon').click().click().click();
				cy.get('#btnPause').click();
				cy.get('.paused').should('be.visible');
				cy.visit('/game/grid');
				cy.get('main.game--grid').should('not.exist');
				cy.get('main.game--no-grid').should('exist');
				cy.get('.paused').should('be.visible');
				cy.get('.numbers__circles').should('have.length', 3);
			});
			it('tests pause box clears localstorage after new game button is clicked', () => {
				cy.apiGetNumbers(true);
				cy.visit('/game/no-grid');
				cy.wait(800);
				cy.get('.b-buttons__btn--icon').click().click().click();
				cy.get('#btnPause').click();
				cy.get('.paused').should('be.visible');
				cy.get('.nav__btn').contains('continue').should('be.visible');
				cy.get('.nav__link').contains('log in').click();
				cy.get('main.form-area.grid.grid--main').should('be.visible');
				cy.get('.nav__btn').contains('continue').click();
				cy.get('.paused').should('be.visible');
				cy.get('.numbers__circles').should('have.length', 3);
				cy.get('.form-area__btn').contains('new game').click({ force: true });
				cy.clearLocalStorage();
				cy.get('main.selection').should('be.visible');
				cy.get('.selection__link[href="/game/no-grid"]').click();
				cy.get('.numbers__circles').should('not.exist');
			});
		});
	});

	/* win game */
	describe('win game functionality', () => {
		/** grid */
		describe('grid win functionality', () => {
			it('tests win functionality is enabled and remains active when switching routes', () => {
				cy.apiGetCells(true);
				cy.apiGetNumbers(true);
				cy.visit('/game/grid');
				cy.wait(800);
				cy.get('.b-buttons__btn--icon').click().click().click();
				cy.get('.b-buttons__btn').contains('bingo!').click();
				cy.get('.form-area__container').should('be.visible');
				cy.get('.nav__btn').contains('continue').should('be.visible');
				cy.get('#nameInput').type('Example Winner');
				cy.get('#btnSubmit').click();
				cy.get('.error')
					.contains('Please log in to continue.')
					.should('be.visible');
				cy.get('.nav__btn').contains('continue').click();
				cy.get('.form-area__container').should('be.visible');
				cy.get('.numbers__circles').should('have.length', 3);
			});
			it('tests redirect from root to current grid game when pause is active', () => {
				cy.apiGetCells(true);
				cy.apiGetNumbers(true);
				cy.visit('/game/grid');
				cy.wait(800);
				cy.get('.b-buttons__btn--icon').click().click().click();
				cy.get('.b-buttons__btn').contains('bingo!').click();
				cy.get('.form-area__container').should('be.visible');
				cy.visit('/');
				cy.get('main.selection').should('not.exist');
				cy.get('main.game--grid').should('exist');
				cy.get('.form-area__container').should('be.visible');
				cy.get('.numbers__circles').should('have.length', 3);
			});
			it('tests redirect from no-grid to current grid game when pause is active', () => {
				cy.apiGetCells(true);
				cy.apiGetNumbers(true);
				cy.visit('/game/grid');
				cy.wait(800);
				cy.get('.b-buttons__btn--icon').click().click().click();
				cy.get('.b-buttons__btn').contains('bingo!').click();
				cy.get('.form-area__container').should('be.visible');
				cy.visit('/game/no-grid');
				cy.get('main.game--no-grid').should('not.exist');
				cy.get('main.game--grid').should('exist');
				cy.get('.form-area__container').should('be.visible');
				cy.get('.numbers__circles').should('have.length', 3);
			});
			it('tests win box clears localstorage after new game button is clicked', () => {
				cy.apiGetCells(true);
				cy.apiGetNumbers(true);
				cy.visit('/game/grid');
				cy.wait(800);
				cy.get('.b-buttons__btn--icon').click().click().click();
				cy.get('.b-buttons__btn').contains('bingo!').click();
				cy.get('.form-area__container').should('be.visible');
				cy.get('.nav__btn').contains('continue').should('be.visible');
				cy.get('#btnSubmit').click();
				cy.get('.error')
					.contains('Please log in to continue.')
					.should('be.visible');
				cy.get('.nav__btn').contains('continue').click();
				cy.get('.numbers__circles').should('have.length', 3);
				cy.get('.form-area__btn').contains('new game').click({ force: true });
				cy.clearLocalStorage();
				cy.get('main.selection').should('be.visible');
				cy.get('.selection__link[href="/game/grid"]').click();
				cy.get('.numbers__circles').should('not.exist');
			});
		});

		/** no-grid */
		describe('no-grid win functionality', () => {
			it('tests win functionality is enabled and remains active when switching routes', () => {
				cy.apiGetNumbers(true);
				cy.visit('/game/no-grid');
				cy.wait(800);
				cy.get('.b-buttons__btn--icon').click().click().click();
				cy.get('.b-buttons__btn').contains('bingo!').click();
				cy.get('.form-area__container').should('be.visible');
				cy.get('.nav__btn').contains('continue').should('be.visible');
				cy.get('#nameInput').type('Example Winner');
				cy.get('#btnSubmit').click();
				cy.get('.error')
					.contains('Please log in to continue.')
					.should('be.visible');
				cy.get('.nav__btn').contains('continue').click();
				cy.get('.form-area__container').should('be.visible');
				cy.get('.numbers__circles').should('have.length', 3);
			});
			it('tests redirect from root to current grid game when pause is active', () => {
				cy.apiGetCells(true);
				cy.apiGetNumbers(true);
				cy.visit('/game/no-grid');
				cy.wait(800);
				cy.get('.b-buttons__btn--icon').click().click().click();
				cy.get('.b-buttons__btn').contains('bingo!').click();
				cy.get('.form-area__container').should('be.visible');
				cy.visit('/');
				cy.get('main.selection').should('not.exist');
				cy.get('main.game--no-grid').should('exist');
				cy.get('.form-area__container').should('be.visible');
				cy.get('.numbers__circles').should('have.length', 3);
			});
			it('tests redirect from no-grid to current grid game when pause is active', () => {
				cy.apiGetCells(true);
				cy.apiGetNumbers(true);
				cy.visit('/game/no-grid');
				cy.wait(800);
				cy.get('.b-buttons__btn--icon').click().click().click();
				cy.get('.b-buttons__btn').contains('bingo!').click();
				cy.get('.form-area__container').should('be.visible');
				cy.visit('/game/grid');
				cy.get('main.game--grid').should('not.exist');
				cy.get('main.game--no-grid').should('exist');
				cy.get('.form-area__container').should('be.visible');
				cy.get('.numbers__circles').should('have.length', 3);
			});
			it('tests win box clears localstorage after new game button is clicked', () => {
				cy.apiGetNumbers(true);
				cy.visit('/game/no-grid');
				cy.wait(800);
				cy.get('.b-buttons__btn--icon').click().click().click();
				cy.get('.b-buttons__btn').contains('bingo!').click();
				cy.get('.form-area__container').should('be.visible');
				cy.get('.nav__btn').contains('continue').should('be.visible');
				cy.get('#btnSubmit').click();
				cy.get('.error')
					.contains('Please log in to continue.')
					.should('be.visible');
				cy.get('.nav__btn').contains('continue').click();
				cy.get('.numbers__circles').should('have.length', 3);
				cy.get('.form-area__btn').contains('new game').click({ force: true });
				cy.clearLocalStorage();
				cy.get('main.selection').should('be.visible');
				cy.get('.selection__link[href="/game/grid"]').click();
				cy.get('.numbers__circles').should('not.exist');
			});
		});
	});
});
