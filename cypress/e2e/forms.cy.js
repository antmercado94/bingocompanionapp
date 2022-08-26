describe('all forms', () => {
	const signupApiUrl = '/api/signup';
	const loginApiUrl = '/api/login';
	const generateApiUrl = '/api/generate';
	const resetPwApiUrl = '/api/resetpw_post';
	const saveApiUrl = '/api/save';
	const completeApiUrl = '/api/complete';

	describe('signed out/no auth', () => {
		beforeEach(() => {
			cy.apiCheckUser(false);
		});
		/* sign up */
		describe('sign up form', () => {
			it('displays root page and user nav when sign up is successful', () => {
				cy.visit('/signup');
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
				cy.get('main.selection').should('be.visible');
				cy.get('.nav__link').contains('my account').should('be.visible');
				cy.get('.nav__link').contains('saved games').should('be.visible');
			});
			it('displays/removes errors from inputs', () => {
				cy.visit('/signup');
				/** all errors */
				cy.intercept('POST', signupApiUrl, (req) => {
					req.reply({
						statusCode: 400,
						body: {
							errors: {
								name: 'Please enter a name.',
								email: 'Please enter an email.',
								password: 'Please enter a password.',
							},
						},
					});
				});
				cy.get('.form-area__cb').click();
				cy.get('#btnSubmit').click();
				cy.get('.error').contains('Please enter a name.').should('be.visible');
				cy.get('.error')
					.contains('Please enter an email.')
					.should('be.visible');
				cy.get('.error')
					.contains('Please enter a password.')
					.should('be.visible');
				/** only email and password errors */
				cy.intercept('POST', signupApiUrl, (req) => {
					req.reply({
						statusCode: 400,
						body: {
							errors: {
								name: '',
								email: 'Please enter an email.',
								password: 'Please enter a password.',
							},
						},
					});
				});
				cy.get('input[placeholder="name"]').type('userName1');
				cy.get('#btnSubmit').click();
				cy.get('.error').contains('Please enter a name.').should('not.exist');
				/** only password error */
				cy.intercept('POST', signupApiUrl, (req) => {
					req.reply({
						statusCode: 400,
						body: {
							errors: {
								name: '',
								email: '',
								password: 'Please enter a password.',
							},
						},
					});
				});
				cy.get('input[placeholder="email"]').type('userName1@example1.com');
				cy.get('#btnSubmit').click();
				cy.get('.error').contains('Please enter an email.').should('not.exist');
				/** clear errors */
				cy.intercept('POST', signupApiUrl, (req) => {
					req.reply({
						statusCode: 400,
						body: {
							errors: {
								name: '',
								email: '',
								password: '',
							},
						},
					});
				});
				cy.get('input[placeholder="password"]').type('123456');
				cy.get('#btnSubmit').click();
				cy.get('.error').should('not.exist');
			});
			it('displays server error if api unavailable', () => {
				cy.visit('/signup');
				cy.intercept('POST', signupApiUrl, {
					statusCode: 504,
				});
				cy.get('.form-area__cb').click();
				cy.get('#btnSubmit').click();
				cy.get('.error')
					.contains('Server error: could not send data.')
					.should('be.visible');
			});
		});

		/* login */
		describe('login form', () => {
			it('displays root page and user nav when login is successful', () => {
				cy.visit('/login');
				cy.intercept('POST', loginApiUrl, (req) => {
					req.reply({
						statusCode: 200,
						body: { loggedIn: true },
					});
				});
				cy.get('input[placeholder="email"]:not("#resetEmail")').type(
					'userName1@example1.com'
				);
				cy.get('input[placeholder="password"]').type('123456');
				cy.get('#btnSubmit').click();
				cy.get('main.selection').should('be.visible');
				cy.get('.nav__link').contains('my account').should('be.visible');
				cy.get('.nav__link').contains('saved games').should('be.visible');
			});
			it('displays user error if email and/or password is incorrect', () => {
				cy.visit('/login');
				cy.intercept('POST', loginApiUrl, (req) => {
					req.reply({
						statusCode: 400,
						body: { errors: { user: 'Incorrect email or password.' } },
					});
				});
				cy.get('#btnSubmit').click();
				cy.get('.error')
					.contains('Incorrect email or password.')
					.should('be.visible');
			});
			it('displays server error if api unavailable', () => {
				cy.visit('/login');
				cy.intercept('POST', loginApiUrl, {
					statusCode: 504,
				});
				cy.get('#btnSubmit').click();
				cy.get('.error')
					.contains('Server error: could not send data.')
					.should('be.visible');
			});
		});

		/* generate PDF */
		describe('generate pdf form', () => {
			/* game with grid */
			describe('gameGrid pdf generator', () => {
				it('displays generated PDF when form submission is successful', () => {
					let cardsToGenerate = 3;
					cy.apiGetCells(true);
					cy.apiGetNumbers(true);
					cy.visit('/game/grid');
					cy.intercept('POST', generateApiUrl, (req) => {
						req.reply({
							statusCode: 200,
							body: {
								url: `/api/generated/${cardsToGenerate}`,
							},
						});
					});
					cy.get('.generate-cards').click();
					cy.get('#quantity').clear();
					cy.get('#quantity').type(cardsToGenerate);
					/** check window.open tab */
					cy.window().then((win) => {
						cy.stub(win, 'open').as('open');
					});
					cy.get('#btnGenerateSubmit').click();
					cy.get('@open').should(
						'have.been.calledOnceWithExactly',
						`/api/generated/${cardsToGenerate}`,
						'_blank'
					);
				});
				it('displays error when an invalid number is submitted', () => {
					let cardsToGenerate = 3;
					cy.apiGetCells(true);
					cy.apiGetNumbers(true);
					cy.visit('/game/grid');
					cy.intercept('POST', generateApiUrl, (req) => {
						req.reply({
							statusCode: 400,
							body: {
								errors: { generate: 'Please enter a valid number from 1-50' },
							},
						});
					});
					cy.get('.generate-cards').click();
					cy.get('#quantity').clear();
					cy.get('#quantity').type(cardsToGenerate);
					cy.get('#btnGenerateSubmit').click();
					cy.get('.error')
						.contains('Please enter a valid number from 1-50')
						.should('be.visible');
				});
				it('displays server error if api unavailable', () => {
					let cardsToGenerate = 3;
					cy.apiGetCells(true);
					cy.apiGetNumbers(true);
					cy.visit('/game/grid');
					cy.intercept('POST', generateApiUrl, {
						statusCode: 504,
					});
					cy.get('.generate-cards').click();
					cy.get('#quantity').clear();
					cy.get('#quantity').type(cardsToGenerate);
					cy.get('#btnGenerateSubmit').click();
					cy.get('.error')
						.contains('Server error: could not send data.')
						.should('be.visible');
				});
			});

			/* game with no grid */
			describe('gameNoGrid pdf generator', () => {
				it('displays generated PDF when form submission is successful', () => {
					let cardsToGenerate = 3;
					cy.apiGetNumbers(true);
					cy.visit('/game/no-grid');
					cy.intercept('POST', generateApiUrl, (req) => {
						req.reply({
							statusCode: 200,
							body: {
								url: `/api/generated/${cardsToGenerate}`,
							},
						});
					});
					cy.get('.generate-cards').click();
					cy.get('#quantity').clear();
					cy.get('#quantity').type(cardsToGenerate);
					/** check window.open tab */
					cy.window().then((win) => {
						cy.stub(win, 'open').as('open');
					});
					cy.get('#btnGenerateSubmit').click();
					cy.get('@open').should(
						'have.been.calledOnceWithExactly',
						`/api/generated/${cardsToGenerate}`,
						'_blank'
					);
				});
				it('displays error when an invalid number is submitted', () => {
					let cardsToGenerate = 3;
					cy.apiGetNumbers(true);
					cy.visit('/game/no-grid');
					cy.intercept('POST', generateApiUrl, (req) => {
						req.reply({
							statusCode: 400,
							body: {
								errors: { generate: 'Please enter a valid number from 1-50' },
							},
						});
					});
					cy.get('.generate-cards').click();
					cy.get('#quantity').clear();
					cy.get('#quantity').type(cardsToGenerate);
					cy.get('#btnGenerateSubmit').click();
					cy.get('.error')
						.contains('Please enter a valid number from 1-50')
						.should('be.visible');
				});
				it('displays server error if api unavailable', () => {
					let cardsToGenerate = 3;
					cy.apiGetNumbers(true);
					cy.visit('/game/no-grid');
					cy.intercept('POST', generateApiUrl, {
						statusCode: 504,
					});
					cy.get('.generate-cards').click();
					cy.get('#quantity').clear();
					cy.get('#quantity').type(cardsToGenerate);
					cy.get('#btnGenerateSubmit').click();
					cy.get('.error')
						.contains('Server error: could not send data.')
						.should('be.visible');
				});
			});
		});

		/* reset password request */
		describe('reset password request form', () => {
			it('displays email sent success message', () => {
				cy.visit('/login');
				cy.intercept('POST', resetPwApiUrl, (req) => {
					req.reply({
						statusCode: 200,
						body: { emailSent: true },
					});
				});
				cy.get('a').contains('Reset Password').click();
				cy.get('#resetEmail').type('username1@exampleuser1.com');
				cy.get('#btnResetSubmit').click();
				cy.get('.success')
					.contains('Email has been sent!')
					.should('be.visible');
			});
			it('displays email not found error', () => {
				cy.visit('/login');
				cy.intercept('POST', resetPwApiUrl, (req) => {
					req.reply({
						statusCode: 404,
						body: { errors: { email: 'Email could not be found.' } },
					});
				});
				cy.get('a').contains('Reset Password').click();
				cy.get('#resetEmail').type('username1@exampleuser1.com');
				cy.get('#btnResetSubmit').click();
				cy.get('.error')
					.contains('Email could not be found.')
					.should('be.visible');
			});
			it('displays server error if email could not be sent', () => {
				cy.visit('/login');
				cy.intercept('POST', resetPwApiUrl, (req) => {
					req.reply({
						statusCode: 500,
						body: {
							errors: { email: 'There was a problem sending an Email.' },
						},
					});
				});
				cy.get('a').contains('Reset Password').click();
				cy.get('#resetEmail').type('username1@exampleuser1.com');
				cy.get('#btnResetSubmit').click();
				cy.get('.error')
					.contains('Server error: could not send data.')
					.should('be.visible');
			});
		});
	});

	describe('signed in/auth', () => {
		/* win box form */
		describe('win box form', () => {
			/** grid */
			describe('grid win box form', () => {
				it('displays success message when game has been saved', () => {
					cy.apiCheckUser(true);
					cy.apiGetCells(true);
					cy.apiGetNumbers(true);
					cy.visit('/game/grid');
					cy.intercept('PUT', completeApiUrl, (req) => {
						req.reply({
							statusCode: 200,
							body: { updated: true },
						});
					});
					cy.intercept('POST', saveApiUrl, (req) => {
						req.reply({
							statusCode: 200,
							body: { saved: true },
						});
					});
					cy.get('.b-buttons__btn').contains('bingo!').click();
					cy.get('#nameInput').type('Example Winner');
					cy.get('#btnSubmit').click();
					cy.get('.success')
						.contains('Game record has been saved.')
						.should('be.visible');
				});
				it('redirects to log in page when not authorized', () => {
					cy.apiCheckUser(true);
					cy.apiGetCells(true);
					cy.apiGetNumbers(true);
					cy.visit('/game/grid');
					cy.intercept('PUT', completeApiUrl, (req) => {
						req.reply({
							statusCode: 401,
							body: { isVerified: false },
						});
					});
					cy.intercept('POST', saveApiUrl, (req) => {
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
				});
				it('redirects to log in page when not signed in', () => {
					cy.apiCheckUser(false);
					cy.apiGetCells(true);
					cy.apiGetNumbers(true);
					cy.visit('/game/grid');
					cy.intercept('POST', saveApiUrl, (req) => {
						req.reply({
							statusCode: 404,
							body: { isUser: false },
						});
					});
					cy.get('.b-buttons__btn').contains('bingo!').click();
					cy.get('#nameInput').type('Example Winner');
					cy.get('#btnSubmit').click();
					cy.get('.error')
						.contains('Please log in to continue.')
						.should('be.visible');
				});
				it('displays user error if name field is empy', () => {
					cy.apiCheckUser(true);
					cy.apiGetCells(true);
					cy.apiGetNumbers(true);
					cy.visit('/game/grid');
					cy.intercept('PUT', completeApiUrl, (req) => {
						req.reply({
							statusCode: 200,
							body: { isVerified: true },
						});
					});
					cy.intercept('POST', saveApiUrl, (req) => {
						req.reply({
							statusCode: 400,
							body: { errors: { winner: 'Please enter a name' } },
						});
					});
					cy.get('.b-buttons__btn').contains('bingo!').click();
					cy.get('#btnSubmit').click();
					cy.get('.error').contains('Please enter a name').should('be.visible');
				});
				it('displays server error if api cannot be reached', () => {
					cy.apiCheckUser(true);
					cy.apiGetCells(true);
					cy.apiGetNumbers(true);
					cy.visit('/game/grid');
					cy.intercept('PUT', completeApiUrl, (req) => {
						req.reply({
							statusCode: 500,
							body: { message: 'An internal server error has occurred.' },
						});
					});
					cy.intercept('POST', saveApiUrl, (req) => {
						req.reply({
							statusCode: 500,
							body: { message: 'An internal server error has occurred.' },
						});
					});
					cy.get('.b-buttons__btn').contains('bingo!').click();
					cy.get('#nameInput').type('Example Winner');
					cy.get('#btnSubmit').click();
					cy.get('.error')
						.contains('Server error: could not send data.')
						.should('be.visible');
				});
			});

			/** no-grid */
			describe('no-grid win box form', () => {
				it('displays success message when game has been saved', () => {
					cy.apiCheckUser(true);
					cy.apiGetNumbers(true);
					cy.visit('/game/no-grid');
					cy.intercept('PUT', completeApiUrl, (req) => {
						req.reply({
							statusCode: 200,
							body: { updated: true },
						});
					});
					cy.intercept('POST', saveApiUrl, (req) => {
						req.reply({
							statusCode: 200,
							body: { saved: true },
						});
					});
					cy.get('.b-buttons__btn').contains('bingo!').click();
					cy.get('#nameInput').type('Example Winner');
					cy.get('#btnSubmit').click();
					cy.get('.success')
						.contains('Game record has been saved.')
						.should('be.visible');
				});
				it('redirects to log in page when not authorized', () => {
					cy.apiCheckUser(true);
					cy.apiGetNumbers(true);
					cy.visit('/game/no-grid');
					cy.intercept('PUT', completeApiUrl, (req) => {
						req.reply({
							statusCode: 401,
							body: { isVerified: false },
						});
					});
					cy.intercept('POST', saveApiUrl, (req) => {
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
				});
				it('redirects to log in page when not signed in', () => {
					cy.apiCheckUser(false);
					cy.apiGetNumbers(true);
					cy.visit('/game/no-grid');
					cy.intercept('POST', saveApiUrl, (req) => {
						req.reply({
							statusCode: 404,
							body: { isUser: false },
						});
					});
					cy.get('.b-buttons__btn').contains('bingo!').click();
					cy.get('#nameInput').type('Example Winner');
					cy.get('#btnSubmit').click();
					cy.get('.error')
						.contains('Please log in to continue.')
						.should('be.visible');
				});
				it('displays user error if name field is empy', () => {
					cy.apiCheckUser(true);
					cy.apiGetNumbers(true);
					cy.visit('/game/no-grid');
					cy.intercept('PUT', completeApiUrl, (req) => {
						req.reply({
							statusCode: 200,
							body: { isVerified: true },
						});
					});
					cy.intercept('POST', saveApiUrl, (req) => {
						req.reply({
							statusCode: 400,
							body: { errors: { winner: 'Please enter a name' } },
						});
					});
					cy.get('.b-buttons__btn').contains('bingo!').click();
					cy.get('#btnSubmit').click();
					cy.get('.error').contains('Please enter a name').should('be.visible');
				});
				it('displays server error if api cannot be reached', () => {
					cy.apiCheckUser(true);
					cy.apiGetNumbers(true);
					cy.visit('/game/no-grid');
					cy.intercept('PUT', completeApiUrl, (req) => {
						req.reply({
							statusCode: 500,
							body: { message: 'An internal server error has occurred.' },
						});
					});
					cy.intercept('POST', saveApiUrl, (req) => {
						req.reply({
							statusCode: 500,
							body: { message: 'An internal server error has occurred.' },
						});
					});
					cy.get('.b-buttons__btn').contains('bingo!').click();
					cy.get('#nameInput').type('Example Winner');
					cy.get('#btnSubmit').click();
					cy.get('.error')
						.contains('Server error: could not send data.')
						.should('be.visible');
				});
			});
		});
	});
});
