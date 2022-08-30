describe('functionality related to user data when a winner is called and/or saved after login/signup', () => {
	const getUserURL = '/api/get_user';
	const completeApiUrl = '/api/complete';
	const saveApiUrl = '/api/save';
	const signupApiUrl = '/api/signup';
	const loginApiUrl = '/api/login';

	beforeEach(() => {
		cy.resetUserDataWinGame();
	});
	/* grid */
	it("tests increment of user's completed games count and records list after signup", () => {
		cy.apiCheckUser(false);
		cy.apiGetCells(true);
		cy.apiGetNumbers(true);
		cy.visit('/game/grid');
		cy.wait(800);
		cy.intercept('POST', saveApiUrl, (req) => {
			req.reply({
				statusCode: 404,
				body: { isUser: false },
			});
		});
		cy.intercept('PUT', completeApiUrl, (req) => {
			req.reply({
				statusCode: 401,
				body: { isVerified: false },
			});
		});
		cy.get('.b-buttons__btn').contains('bingo!').click();
		cy.get('#nameInput').type('Example Winner');
		cy.get('#btnSubmit').click();
		cy.get('.error')
			.contains('Please log in to continue.')
			.should('be.visible');
		cy.get('a[href="/signup"]').contains('Create Account').click();
		cy.intercept('POST', signupApiUrl, (req) => {
			req.reply({
				statusCode: 201,
				body: { userCreated: true },
			});
		});
		cy.get('input[placeholder="name"]').type('userName1');
		cy.get('input[placeholder="email"]').type('userName1@example1.com');
		cy.get('input[placeholder="password"]').type('123456');
		cy.get('.form-area__cb').click();
		cy.get('#btnSubmit').click();
		cy.apiCheckUser(true);
		cy.setCookie('jwt', 'example');
		cy.intercept('GET', getUserURL, (req) => {
			req.reply({
				fixture: 'userDataWinGame.json',
			});
		});
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
	it("tests increment of user's completed games count and records list after login", () => {
		cy.apiCheckUser(false);
		cy.apiGetCells(true);
		cy.apiGetNumbers(true);
		cy.visit('/game/grid');
		cy.wait(800);
		cy.intercept('POST', saveApiUrl, (req) => {
			req.reply({
				statusCode: 404,
				body: { isUser: false },
			});
		});
		cy.intercept('PUT', completeApiUrl, (req) => {
			req.reply({
				statusCode: 401,
				body: { isVerified: false },
			});
		});
		cy.get('.b-buttons__btn').contains('bingo!').click();
		cy.get('#nameInput').type('Example Winner');
		cy.get('#btnSubmit').click();
		cy.intercept('POST', loginApiUrl, (req) => {
			req.reply({
				statusCode: 200,
				body: { loggedIn: true },
			});
		});
		cy.get('.error')
			.contains('Please log in to continue.')
			.should('be.visible');
		cy.get('input[placeholder="email"]:not("#resetEmail")').type(
			'userName1@example1.com'
		);
		cy.get('input[placeholder="password"]').type('123456');
		cy.get('#btnSubmit').click();
		cy.apiCheckUser(true);
		cy.setCookie('jwt', 'example');
		cy.intercept('GET', getUserURL, (req) => {
			req.reply({
				fixture: 'userDataWinGame.json',
			});
		});
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
	it("tests increment of user's completed games count and records list after signup", () => {
		cy.apiCheckUser(false);
		cy.apiGetCells(true);
		cy.apiGetNumbers(true);
		cy.visit('/game/no-grid');
		cy.wait(800);
		cy.intercept('POST', saveApiUrl, (req) => {
			req.reply({
				statusCode: 404,
				body: { isUser: false },
			});
		});
		cy.intercept('PUT', completeApiUrl, (req) => {
			req.reply({
				statusCode: 401,
				body: { isVerified: false },
			});
		});
		cy.get('.b-buttons__btn').contains('bingo!').click();
		cy.get('#nameInput').type('Example Winner');
		cy.get('#btnSubmit').click();
		cy.get('.error')
			.contains('Please log in to continue.')
			.should('be.visible');
		cy.get('a[href="/signup"]').contains('Create Account').click();
		cy.intercept('POST', signupApiUrl, (req) => {
			req.reply({
				statusCode: 201,
				body: { userCreated: true },
			});
		});
		cy.get('input[placeholder="name"]').type('userName1');
		cy.get('input[placeholder="email"]').type('userName1@example1.com');
		cy.get('input[placeholder="password"]').type('123456');
		cy.get('.form-area__cb').click();
		cy.get('#btnSubmit').click();
		cy.apiCheckUser(true);
		cy.setCookie('jwt', 'example');
		cy.intercept('GET', getUserURL, (req) => {
			req.reply({
				fixture: 'userDataWinGame.json',
			});
		});
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
	it("tests increment of user's completed games count and records list after login", () => {
		cy.apiCheckUser(false);
		cy.apiGetCells(true);
		cy.apiGetNumbers(true);
		cy.visit('/game/grid');
		cy.wait(800);
		cy.intercept('POST', saveApiUrl, (req) => {
			req.reply({
				statusCode: 404,
				body: { isUser: false },
			});
		});
		cy.intercept('PUT', completeApiUrl, (req) => {
			req.reply({
				statusCode: 401,
				body: { isVerified: false },
			});
		});
		cy.get('.b-buttons__btn').contains('bingo!').click();
		cy.get('#nameInput').type('Example Winner');
		cy.get('#btnSubmit').click();
		cy.intercept('POST', loginApiUrl, (req) => {
			req.reply({
				statusCode: 200,
				body: { loggedIn: true },
			});
		});
		cy.get('.error')
			.contains('Please log in to continue.')
			.should('be.visible');
		cy.get('input[placeholder="email"]:not("#resetEmail")').type(
			'userName1@example1.com'
		);
		cy.get('input[placeholder="password"]').type('123456');
		cy.get('#btnSubmit').click();
		cy.apiCheckUser(true);
		cy.setCookie('jwt', 'example');
		cy.intercept('GET', getUserURL, (req) => {
			req.reply({
				fixture: 'userDataWinGame.json',
			});
		});
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
