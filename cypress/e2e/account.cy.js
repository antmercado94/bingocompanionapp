describe('account page functionality', () => {
	const getUserURL = '/api/get_user';
	const updateUserURL = '/api/update-user';
	const logoutURL = '/api/logout';
	const eraseRecordsURL = '/api/erase_records';
	const deleteUsersURL = '/api/delete_user';

	beforeEach(() => {
		cy.apiCheckUser(true);
		cy.setCookie('jwt', 'example');
		cy.intercept('GET', getUserURL, (req) => {
			req.reply({
				fixture: 'userData.json',
			});
		});
	});

	describe('user data', () => {
		/** overview */
		it('displays user data within overview page', () => {
			cy.visit('/myaccount/overview');
			cy.get('[data-testid="userDataName"]')
				.contains('exampleuser1', { matchCase: false })
				.should('be.visible');
		});
		/** game records */
		it('displays user data within game records page', () => {
			cy.visit('/myaccount/saved');
			cy.get('.records__item').should('have.length', 12);
		});
		/** settings */
		it('displays user data within settings page', () => {
			cy.visit('/myaccount/settings');
			cy.get('[placeholder="ExampleUser1"]').should('be.visible');
		});
	});

	describe('records page functionality', () => {
		it('displays records data info when records item is hovered', () => {
			cy.visit('/myaccount/saved');
			cy.get('.records__item:first-child').trigger('mouseover');
			cy.get('.numbers__circle').should('have.length', 36);
		});
		it('displays records pagination functionality', () => {
			cy.visit('/myaccount/saved');
			cy.get('.pagination__next').click();
			cy.get('.records__item').should('have.length', 12);
			cy.get('.pagination__previous').should('be.visible');
			cy.get('.pagination__previous').click();
			cy.get('.pagination__previous').should('not.be.visible');
			cy.get('.records__item').should('have.length', 12);
			cy.get('.pagination__next').should('be.visible');
		});
		it('displays record game data pagination functionality', () => {
			cy.visit('/myaccount/saved');
			cy.get('.records__item:first-child').trigger('mouseover');
			cy.get('span.pagination__circle').eq(1).click();
			cy.get('.numbers__circle').should('have.length', 36);
			cy.get('span.pagination__circle').eq(2).click();
			cy.get('.numbers__circle').should('have.length', 28);
			cy.get('span.pagination__circle').eq(0).click();
			cy.get('.numbers__circle').should('have.length', 36);
		});
	});

	describe('settings page functionality', () => {
		/* name/email */
		describe('update name and email', () => {
			/** name */
			it("displays successful update of user's name", () => {
				cy.visit('/myaccount/settings');
				cy.intercept('PUT', updateUserURL, (req) => {
					req.reply({
						statusCode: 200,
						body: { nameUpdated: true },
					});
				});
				cy.get('button[data-input="name"]').click();
				cy.get('input[name="name"]')
					.type('NewExampleUser1')
					.then(($input) => {
						$input.blur();
					});
				cy.get('[placeholder="NewExampleUser1"]').should('be.visible');
				cy.contains('Name has been updated successfully.').should('be.visible');
				/** check updated name in overview */
				cy.get('[data-value="overview"]').click();
				cy.get('[data-testid="userDataName"]')
					.contains('NewExampleUser1', { matchCase: false })
					.should('be.visible');
			});
			it("displays error if unable to update user's name", () => {
				cy.visit('/myaccount/settings');
				cy.intercept('PUT', updateUserURL, (req) => {
					req.reply({
						statusCode: 404,
						body: {
							errors: {
								message: 'An error has occurred: could not update data.',
							},
						},
					});
				});
				cy.get('button[data-input="name"]').click();
				cy.get('input[name="name"]')
					.type('NewExampleUser1')
					.then(($input) => {
						$input.blur();
					});
				cy.contains('An error has occurred: could not update data.').should(
					'be.visible'
				);
			});
			it('displays server error if unable to access api', () => {
				cy.visit('/myaccount/settings');
				cy.intercept('PUT', updateUserURL, (req) => {
					req.reply({
						statusCode: 500,
						body: {
							errors: { message: 'An internal server error has occurred.' },
						},
					});
				});
				cy.get('button[data-input="name"]').click();
				cy.get('input[name="name"]')
					.type('NewExampleUser1')
					.then(($input) => {
						$input.blur();
					});
				cy.contains('Server error: could not send data.').should('be.visible');
			});
			/** email */
			it("displays successful update of user's email", () => {
				cy.visit('/myaccount/settings');
				cy.intercept('PUT', updateUserURL, (req) => {
					req.reply({
						statusCode: 200,
						body: { emailUpdated: true },
					});
				});
				cy.get('button[data-input="email"]').click();
				cy.get('input[name="email"]')
					.type('NewExampleUser1@exampleuser1.com')
					.then(($input) => {
						$input.blur();
					});
				cy.get('[placeholder="NewExampleUser1@exampleuser1.com"]').should(
					'be.visible'
				);
				cy.contains('Email has been updated successfully.').should(
					'be.visible'
				);
			});
			it("displays error if unable to update user's email", () => {
				cy.visit('/myaccount/settings');
				cy.intercept('PUT', updateUserURL, (req) => {
					req.reply({
						statusCode: 404,
						body: {
							errors: {
								message: 'An error has occurred: could not update data.',
							},
						},
					});
				});
				cy.get('button[data-input="email"]').click();
				cy.get('input[name="email"]')
					.type('NewExampleUser1@exampleuser1.com')
					.then(($input) => {
						$input.blur();
					});
				cy.contains('An error has occurred: could not update data.').should(
					'be.visible'
				);
			});
			it('displays server error if unable to access api', () => {
				cy.visit('/myaccount/settings');
				cy.intercept('PUT', updateUserURL, (req) => {
					req.reply({
						statusCode: 500,
						body: {
							errors: { message: 'An internal server error has occurred.' },
						},
					});
				});
				cy.get('button[data-input="email"]').click();
				cy.get('input[name="email"]')
					.type('NewExampleUser1@exampleuser1.com')
					.then(($input) => {
						$input.blur();
					});
				cy.contains('Server error: could not send data.').should('be.visible');
			});
		});

		/* erase records */
		describe('erase records functionality', () => {
			it('displays no records after all records have been successfully erased', () => {
				cy.visit('/myaccount/settings');
				cy.intercept('DELETE', eraseRecordsURL, (req) => {
					req.reply({
						statusCode: 200,
						body: { recordsErased: true },
					});
				});
				cy.get('#btnErase').click();
				cy.contains('Records have been removed successfully.').should(
					'be.visible'
				);
				cy.get('[data-value="saved"]').click();
				cy.get('.records__item').should('not.exist');
			});
			it('displays error when records cannot be erased', () => {
				cy.visit('/myaccount/settings');
				cy.intercept('DELETE', eraseRecordsURL, (req) => {
					req.reply({
						statusCode: 404,
						body: {
							errors: {
								message: 'An error has occurred: could not remove data.',
							},
						},
					});
				});
				cy.get('#btnErase').click();
				cy.contains('An error has occurred: could not remove data.').should(
					'be.visible'
				);
			});
			it('displays server error if unable to access api', () => {
				cy.visit('/myaccount/settings');
				cy.intercept('DELETE', eraseRecordsURL, (req) => {
					req.reply({
						statusCode: 500,
						body: {
							errors: { message: 'An internal server error has occurred.' },
						},
					});
				});
				cy.get('#btnErase').click();
				cy.contains('Server error: could not send data.').should('be.visible');
			});
		});

		/* delete account */
		describe('delete account functionality', () => {
			it('displays success message in login pagen when user was successfully deleted', () => {
				cy.visit('/myaccount/settings');
				cy.intercept('DELETE', deleteUsersURL, (req) => {
					req.reply({
						statusCode: 200,
						body: { userDeleted: true },
					});
				});
				cy.clearCookies();
				cy.get('#btnDelete').click();
				cy.contains('Account has been deleted successfully.').should(
					'be.visible'
				);
			});
			it('displays error when user cannot be deleted', () => {
				cy.visit('/myaccount/settings');
				cy.intercept('DELETE', deleteUsersURL, (req) => {
					req.reply({
						statusCode: 404,
						body: {
							errors: {
								message: 'An error has occurred: could not delete user.',
							},
						},
					});
				});
				cy.get('#btnDelete').click();
				cy.contains('An error has occurred: could not delete user.').should(
					'be.visible'
				);
			});
			it('displays server error if unable to access api', () => {
				cy.visit('/myaccount/settings');
				cy.intercept('DELETE', deleteUsersURL, (req) => {
					req.reply({
						statusCode: 500,
						body: {
							errors: { message: 'An internal server error has occurred.' },
						},
					});
				});
				cy.get('#btnDelete').click();
				cy.contains('Server error: could not send data.').should('be.visible');
			});
		});
	});

	/* logout */
	describe('logout', () => {
		it('displays root page when logged out successfully', () => {
			cy.visit('/myaccount/saved');
			cy.intercept('GET', logoutURL, (req) => {
				req.reply({
					statusCode: 200,
					body: { isCleared: true },
				});
			});
			cy.get('.pane__link').click();
			cy.clearCookies();
			cy.get('main.selection').should('be.visible');
			cy.get('.nav__link').contains('my account').should('not.exist');
			cy.get('.nav__link').contains('saved games').should('not.exist');
		});
	});
});
