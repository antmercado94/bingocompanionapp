describe('route related tests', () => {
	const getResetURL = '/api/resetpw/exampleid/exampletoken';
	describe('protected routes', () => {
		beforeEach(() => {
			cy.apiCheckUser(false);
		});
		it('tests all auth protected routes', () => {
			cy.visit('/myaccount/');
			cy.get('.form-area.grid.grid--main')
				.contains('log in')
				.should('be.visible');
			cy.visit('/myaccount/overview');
			cy.get('.form-area.grid.grid--main')
				.contains('log in')
				.should('be.visible');
			cy.visit('/myaccount/saved');
			cy.get('.form-area.grid.grid--main')
				.contains('log in')
				.should('be.visible');
			cy.visit('/myaccount/settings');
			cy.get('.form-area.grid.grid--main')
				.contains('log in')
				.should('be.visible');
			cy.intercept('GET', getResetURL, (req) => {
				req.reply({
					statusCode: 401,
					body: { isVerified: false },
				});
			});
			cy.visit('/resetpw/exampleid/exampletoken');
			cy.get('.form-area.grid.grid--main')
				.contains('log in')
				.should('be.visible');
			cy.contains(
				'There was a problem verifying request, please try again.'
			).should('be.visible');
		});
	});
	describe('auth signed in redirects', () => {
		beforeEach(() => {
			cy.apiCheckUser(true);
			cy.setCookie('jwt', 'example');
		});
		it('tests routes that redirect when user is logged in', () => {
			cy.visit('/login');
			cy.get('main.selection.grid.grid--main').should('be.visible');
			cy.visit('/signup');
			cy.get('main.selection.grid.grid--main').should('be.visible');
		});
	});
	describe('auth forms', () => {
		beforeEach(() => {
			cy.apiCheckUser(true);
			cy.setCookie('jwt', 'example');
		});
		/* account page reset pw request */
		describe('account reset pw form', () => {
			const getUserURL = '/api/get_user';
			const resetPwApiUrl = '/api/resetpw_post';
			it('displays root page and user nav when sign up is successful', () => {
				cy.intercept('GET', getUserURL, (req) => {
					req.reply({
						fixture: 'userData.json',
					});
				});
				cy.visit('/myaccount/settings');
				cy.intercept('POST', resetPwApiUrl, (req) => {
					req.reply({
						statusCode: 200,
						body: { emailSent: true },
					});
				});
				cy.get('[data-testid="configResetPw"]').click();
				cy.get('#resetEmail').type('username1@exampleuser1.com');
				cy.get('#btnResetSubmit').click();
				cy.get('.success')
					.contains('Email has been sent!')
					.should('be.visible');
			});
			it('displays email not found error', () => {
				cy.intercept('GET', getUserURL, (req) => {
					req.reply({
						fixture: 'userData.json',
					});
				});
				cy.visit('/myaccount/settings');
				cy.intercept('POST', resetPwApiUrl, (req) => {
					req.reply({
						statusCode: 404,
						body: { errors: { email: 'Email could not be found.' } },
					});
				});
				cy.get('[data-testid="configResetPw"]').click();
				cy.get('#resetEmail').type('username1@exampleuser1.com');
				cy.get('#btnResetSubmit').click();
				cy.get('.error')
					.contains('Email could not be found.')
					.should('be.visible');
			});
			it('displays server error if email could not be sent', () => {
				cy.intercept('GET', getUserURL, (req) => {
					req.reply({
						fixture: 'userData.json',
					});
				});
				cy.visit('/myaccount/settings');
				cy.intercept('POST', resetPwApiUrl, (req) => {
					req.reply({
						statusCode: 500,
						body: {
							errors: { email: 'There was a problem sending an Email.' },
						},
					});
				});
				cy.get('[data-testid="configResetPw"]').click();
				cy.get('#resetEmail').type('username1@exampleuser1.com');
				cy.get('#btnResetSubmit').click();
				cy.get('.error')
					.contains('Server error: could not send data.')
					.should('be.visible');
			});
		});
		/* reset pw page */
		describe('reset pw form', () => {
			const resetPwApiUrl = '/api/pw_reset/exampleid/exampletoken';
			const getUserURL = '/api/get_user';
			it('displays success message when password reset form is successfully submitted', () => {
				cy.intercept('GET', getResetURL, (req) => {
					req.reply({
						statusCode: 200,
						body: { isVerified: true },
					});
				});
				cy.intercept('GET', getUserURL, (req) => {
					req.reply({
						fixture: 'userData.json',
					});
				});
				cy.visit('/resetpw/exampleid/exampletoken');
				cy.intercept('POST', resetPwApiUrl, (req) => {
					req.reply({
						statusCode: 200,
						body: { pwUpdated: true },
					});
				});
				cy.get('#resetPassword').type('123456');
				cy.get('#resetRepeatPassword').type('123456');
				cy.get('#btnSubmit').click();
				cy.get('.resetMsg')
					.contains('Password reset successfully.')
					.should('be.visible');
			});
			it('displays success message when password reset form is successfully submitted', () => {
				cy.intercept('GET', getResetURL, (req) => {
					req.reply({
						statusCode: 200,
						body: { isVerified: true },
					});
				});
				cy.intercept('GET', getUserURL, (req) => {
					req.reply({
						fixture: 'userData.json',
					});
				});
				cy.visit('/resetpw/exampleid/exampletoken');
				cy.intercept('POST', resetPwApiUrl, (req) => {
					req.reply({
						statusCode: 200,
						body: { pwUpdated: true },
					});
				});
				cy.get('#resetPassword').type('123456');
				cy.get('#resetRepeatPassword').type('123456');
				cy.get('#btnSubmit').click();
				cy.get('.resetMsg')
					.contains('Password reset successfully.')
					.should('be.visible');
			});
			it('displays user error message when password is same as old', () => {
				cy.intercept('GET', getResetURL, (req) => {
					req.reply({
						statusCode: 200,
						body: { isVerified: true },
					});
				});
				cy.intercept('GET', getUserURL, (req) => {
					req.reply({
						fixture: 'userData.json',
					});
				});
				cy.visit('/resetpw/exampleid/exampletoken');
				cy.intercept('POST', resetPwApiUrl, (req) => {
					req.reply({
						statusCode: 422,
						body: {
							errors: {
								password:
									'your new password cannot be the same as your current password.',
							},
						},
					});
				});
				cy.get('#resetPassword').type('123456');
				cy.get('#resetRepeatPassword').type('123456');
				cy.get('#btnSubmit').click();
				cy.get('.error')
					.contains(
						'your new password cannot be the same as your current password.'
					)
					.should('be.visible');
			});
			it('displays user error message when password fields do no match', () => {
				cy.intercept('GET', getResetURL, (req) => {
					req.reply({
						statusCode: 200,
						body: { isVerified: true },
					});
				});
				cy.intercept('GET', getUserURL, (req) => {
					req.reply({
						fixture: 'userData.json',
					});
				});
				cy.visit('/resetpw/exampleid/exampletoken');
				cy.intercept('POST', resetPwApiUrl, (req) => {
					req.reply({
						statusCode: 422,
						body: {
							errors: {
								password: 'password must match!',
							},
						},
					});
				});
				cy.get('#resetPassword').type('123456');
				cy.get('#resetRepeatPassword').type('12345623');
				cy.get('#btnSubmit').click();
				cy.get('.error').contains('password must match!').should('be.visible');
			});
			it('displays server error if password failed to be reset', () => {
				cy.intercept('GET', getResetURL, (req) => {
					req.reply({
						statusCode: 200,
						body: { isVerified: true },
					});
				});
				cy.intercept('GET', getUserURL, (req) => {
					req.reply({
						fixture: 'userData.json',
					});
				});
				cy.visit('/resetpw/exampleid/exampletoken');
				cy.intercept('POST', resetPwApiUrl, (req) => {
					req.reply({
						statusCode: 500,
						body: {
							errors: { message: 'An internal server error has occurred.' },
						},
					});
				});
				cy.get('#resetPassword').type('123456');
				cy.get('#resetRepeatPassword').type('123456');
				cy.get('#btnSubmit').click();
				cy.get('.error')
					.contains('Server error: could not send data.')
					.should('be.visible');
			});
		});
	});
});
