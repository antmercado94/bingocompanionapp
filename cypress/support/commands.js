// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('apiCheckUser', (authEnabled) => {
	cy.intercept(
		'GET',
		'/api/check_user',
		!authEnabled
			? { statusCode: 204 }
			: { statusCode: 200, body: { isUser: true } }
	);
});

Cypress.Commands.add('apiGetCells', (isOk) => {
	cy.intercept(
		'GET',
		'/api/cells',
		!isOk
			? { statusCode: 504 }
			: (req) => {
					req.reply({
						fixture: 'cells.json',
					});
			  }
	);
});

Cypress.Commands.add('apiGetNonPlayableCells', () => {
	cy.intercept('GET', '/api/cells', (req) => {
		req.reply({
			statusCode: 200,
			fixture: 'failCells.json',
		});
	});
});

Cypress.Commands.add('apiGetWinCells', (cellsType) => {
	let cellsData;
	switch (cellsType) {
		case 'column':
			cellsData = 'winCellsColumn.json';
			break;
		case 'row':
			cellsData = 'winCellsRow.json';
			break;
		case 'diagonal':
			cellsData = 'winCellsDiagonal.json';
			break;
		default:
			break;
	}
	cy.intercept('GET', '/api/cells', (req) => {
		req.reply({
			statusCode: 200,
			fixture: cellsData,
		});
	});
});

Cypress.Commands.add('apiGetNumbers', (isOk) => {
	cy.intercept(
		'GET',
		'/api/numbers',
		!isOk
			? { statusCode: 504 }
			: (req) => {
					req.reply({
						fixture: 'numbers.json',
					});
			  }
	);
});

Cypress.Commands.add('apiGetFixedNumbers', () => {
	cy.intercept('GET', '/api/numbers', (req) => {
		req.reply({
			fixture: 'fixedNumbers.json',
		});
	});
});

Cypress.Commands.add('apiGetWinNumbersColumn', (numberType) => {
	let numbersData;
	switch (numberType) {
		case 1:
			numbersData = 'winNumbersColumn-1.json';
			break;
		case 2:
			numbersData = 'winNumbersColumn-2.json';
			break;
		case 3:
			numbersData = 'winNumbersColumn-3.json';
			break;
		case 4:
			numbersData = 'winNumbersColumn-4.json';
			break;
		case 5:
			numbersData = 'winNumbersColumn-5.json';
			break;
		default:
			break;
	}
	cy.intercept('GET', '/api/numbers', (req) => {
		req.reply({
			fixture: `/winNumbers/${numbersData}`,
		});
	});
});

Cypress.Commands.add('apiGetWinNumbersRow', (numberType) => {
	let numbersData;
	switch (numberType) {
		case 1:
			numbersData = 'winNumbersRow-1.json';
			break;
		case 2:
			numbersData = 'winNumbersRow-2.json';
			break;
		case 3:
			numbersData = 'winNumbersRow-3.json';
			break;
		case 4:
			numbersData = 'winNumbersRow-4.json';
			break;
		case 5:
			numbersData = 'winNumbersRow-5.json';
			break;
		default:
			break;
	}
	cy.intercept('GET', '/api/numbers', (req) => {
		req.reply({
			fixture: `/winNumbers/${numbersData}`,
		});
	});
});

Cypress.Commands.add('apiGetWinNumbersDia', (numberType) => {
	let numbersData;
	switch (numberType) {
		case 1:
			numbersData = 'winNumbersDia-1.json';
			break;
		case 2:
			numbersData = 'winNumbersDia-2.json';
			break;
		default:
			break;
	}
	cy.intercept('GET', '/api/numbers', (req) => {
		req.reply({
			fixture: `/winNumbers/${numbersData}`,
		});
	});
});

Cypress.Commands.add('matchCalledEls', (els) => {
	const el1Ltr = els[0].children[0];
	const el1Num = els[0].children[1];
	const el2Ltr = els[1].children[0];
	const el2Num = els[1].children[1];
	cy.get(el1Ltr).should(($el) => {
		expect($el[0].textContent).to.eq(el2Ltr.textContent);
	});
	cy.get(el1Num).should(($el) => {
		expect($el[0].textContent).to.eq(el2Num.textContent);
	});
});

Cypress.Commands.add('resetUserDataWinGame', () => {
	cy.readFile('cypress/fixtures/userDataWinGame.json', (err, data) => {
		if (err) {
			return console.error(err);
		}
	}).then((data) => {
		data.userData.completedGames = 1;
		data.userData.savedGames = 1;
		data.games = [
			{
				_id: '62c620f5ead9b7ec2c724978',
				dateSaved: '2022-07-06T23:55:33.327Z',
				winner: 'Example Winner 1',
				calledNumbers: [
					[0, 16],
					[2, 11],
					[1, 3],
					[1, 5],
				],
				withGrid: true,
				userId: '62abc54f513f637e97b54b89',
				__v: 0,
			},
		];
		cy.writeFile('cypress/fixtures/userDataWinGame.json', JSON.stringify(data));
	});
});

Cypress.Commands.add('updateUserDataWinGame', () => {
	cy.readFile('cypress/fixtures/userDataWinGame.json', (err, data) => {
		if (err) {
			return console.error(err);
		}
	}).then((data) => {
		data.userData.completedGames = data.userData.completedGames + 1;
		data.userData.savedGames = data.userData.savedGames + 1;
		data.userData.games = [
			{
				_id: '62c620f5ead9b7ec2c724978',
				dateSaved: '2022-07-06T23:55:33.327Z',
				winner: 'Example Winner 1',
				calledNumbers: [
					[0, 16],
					[2, 11],
					[1, 3],
					[1, 5],
				],
				withGrid: true,
				userId: '62abc54f513f637e97b54b89',
				__v: 0,
			},
			{
				_id: '62c620f5ead9b7ec2c724978',
				dateSaved: '2022-07-06T23:55:33.327Z',
				winner: 'Example Winner 2',
				calledNumbers: [
					[0, 16],
					[2, 11],
					[1, 3],
					[1, 5],
				],
				withGrid: true,
				userId: '62abc54f513f637e97b54b89',
				__v: 0,
			},
		];
		cy.writeFile('cypress/fixtures/userDataWinGame.json', JSON.stringify(data));
	});
});
