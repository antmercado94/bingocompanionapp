describe('functionality related to user data when a winner is called and/or saved', () => {
	const getUserURL = '/api/get_user';
	const completeApiUrl = '/api/complete';
	const saveApiUrl = '/api/save';

	beforeEach(() => {
		cy.resetUserDataWinGame();
		cy.apiCheckUser(true);
		cy.setCookie('jwt', 'example');
		cy.intercept('GET', getUserURL, (req) => {
			req.reply({
				fixture: 'userDataWinGame.json',
			});
		});
	});
	/* grid */
	it("tests increment of user's completed games count and records list after grid win", () => {
		cy.visit('/myaccount/overview');
		cy.get('[data-testid="completedGames"]').contains('1').should('be.visible');
		cy.get('[data-testid="savedGames"]').contains('1').should('be.visible');
		cy.get('.nav__btn').contains('new game').click();
		cy.apiGetCells(true);
		cy.apiGetNumbers(true);
		cy.get('.selection__link[href="/game/grid"]').click();
		cy.wait(800);
		cy.intercept('PUT', completeApiUrl, (req) => {
			req.reply({
				statusCode: 200,
				body: { isVerified: true },
			});
		});
		cy.intercept('POST', saveApiUrl, (req) => {
			req.reply({
				statusCode: 200,
				body: { saved: true },
			});
		});
		cy.get('.b-buttons__btn').contains('bingo!').click();
		cy.get('.game__win').should('be.visible');
		cy.get('#nameInput').type('Example Winner 2');
		cy.get('#btnSubmit').click();
		cy.updateUserDataWinGame();
		cy.get('.success')
			.contains('Game record has been saved.')
			.should('be.visible');
		cy.visit('/myaccount/overview');
		cy.get('[data-testid="completedGames"]').contains('2').should('be.visible');
		cy.get('[data-testid="savedGames"]').contains('2').should('be.visible');
		cy.get('[data-value="saved"]').click();
		cy.get('.records__item').should('have.length', 2);
	});
	/* no-grid */
	it("tests increment of user's completed games count and records list after no-grid win", () => {
		cy.visit('/myaccount/overview');
		cy.get('[data-testid="completedGames"]').contains('1').should('be.visible');
		cy.get('[data-testid="savedGames"]').contains('1').should('be.visible');
		cy.get('.nav__btn').contains('new game').click();
		cy.apiGetCells(true);
		cy.apiGetNumbers(true);
		cy.get('.selection__link[href="/game/no-grid"]').click();
		cy.wait(800);
		cy.intercept('PUT', completeApiUrl, (req) => {
			req.reply({
				statusCode: 200,
				body: { isVerified: true },
			});
		});
		cy.intercept('POST', saveApiUrl, (req) => {
			req.reply({
				statusCode: 200,
				body: { saved: true },
			});
		});
		cy.get('.b-buttons__btn').contains('bingo!').click();
		cy.get('.game__win').should('be.visible');
		cy.get('#nameInput').type('Example Winner 2');
		cy.get('#btnSubmit').click();
		cy.updateUserDataWinGame();
		cy.get('.success')
			.contains('Game record has been saved.')
			.should('be.visible');
		cy.visit('/myaccount/overview');
		cy.get('[data-testid="completedGames"]').contains('2').should('be.visible');
		cy.get('[data-testid="savedGames"]').contains('2').should('be.visible');
		cy.get('[data-value="saved"]').click();
		cy.get('.records__item').should('have.length', 2);
	});
});
