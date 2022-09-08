# **Bingo Companion App**

This project was developed for the purposes of being a part of my web portfolio. **[See it in action here](https://bingocompanionapp.netlify.app/)**.

- [Description](#description)
- [Requirements](#requirements)
- [Installation and setup](#installation-and-setup)
  - [Install](#install)
  - [Development](#development)
  - [Production](#production)
- [How to use](#how-to-use)
  - [Game Types](#game-types)
  - [Pause Game](#pause-game)
  - [Winning](#winning)
  - [Bingo Card Generator](#bingo-card-generator)
  - [Saved Game Records](#saved-game-records)
- [Tests](#tests)
- [License](#license)

## **Description**

Front-end [React](https://reactjs.org/) application developed to be used as a simplistic way to host a 75-ball bingo game session. The web app provides all of the necessary elements for conducting a single bingo game with a large group, including the ability to randomly generate printable bingo cards.

Records of each game played, including the date and winner's name, can be saved and properly viewed by creating an account and visiting the [account panel](#saved-game-records).

## **Requirements**

The application requires an accompanied REST API for proper usage. You can find the repo along with its own setup instructions [here](https://github.com/antmercado94/bingocompanionapp-api).

## **Installation and setup**

This project uses [Parcel](https://parceljs.org/) to build the web application for production as well as running a local development server.

### **Install**

- [Download zip](https://github.com/antmercado94/bingocompanionapp/archive/refs/heads/main.zip) or clone: `git clone https://github.com/antmercado94/bingocompanionapp.git`
- Install dependencies using npm: `npm install`

### **Development**

Run a development server using npm script:

```
npm run dev
```

Or using the Parcel command itself:

```
npx parcel index.html
```

### **Production**

Build application for production using npm script:

```
npm run build
```

Or using the Parcel command itself:

```
npx parcel build index.html
```

Location of all build files will be placed into the [dist](https://github.com/antmercado94/bingocompanionapp/tree/main/dist) folder.

## **How to use**

### **Game Types**

Upon visiting the root page of the project you will have the option of selecting between two game types: **_No-grid_** and **_Grid_**.

1. **No-grid** - easily keeps track of every called number by displaying them all within a large container, until a [winner](#winning) is called or all possible numbers have been exhausted.

1. **Grid** - displays a playable 75-ball grid (or _card_, if you prefer) that will match with corresponding numbers until a match of five occurs or another [winner](#winning) is called.

| ![Image Example with link](/Assets/screenshots/no-grid.png) | ![Image Example with link](/Assets/screenshots/grid.png) |
| :---------------------------------------------------------: | :------------------------------------------------------: |
|                 <small>No-grid Type<small>                  |                 <small>Grid Type<small>                  |

### **Pause Game**

While a game is being played, a user may click on the purple "PAUSE" button located to the upper-left of the main game area. This will effectively pause the game until the user selects either "NEW GAME" or "CONTINUE".

Be aware that because game data is temporarily saved to local storage when pause is active, clearing the app's site data from the browser ("offline website data" in FireFox) will remove the current game being played.

<figure>

![Image Example with link](/Assets/screenshots/paused.png)

<p align="center"><small>Paused Grid game.</small></p>
</figure>

### **Winning**

A winner is decided when the "BINGO!" button is clicked and confirmed. This will result in a lightbox element appearing that allows the user to properly save the results of the completed game.

The same winning functionality happens automatically if a match of five (across/down/diagonally) occurs when using the [Grid game type](#game-types).

<figure>

![Image Example with link](/Assets/screenshots/winner.png)

<p align="center"><small>A winner is decided.</small></p>
</figure>

### **Bingo Card Generator**

Generate a PDF file containing randomly generated bingo cards by clicking the circular cards icon located towards the lower-right of the game area. This was developed as an optional way to produce a large quantity of playable cards (via print) if a user has no cards available.

Specify the amount of cards to generate within the number input field (maximum of 50 at a time).

<figure>

![Image Example with link](/Assets/screenshots/generate.png)

<p align="center"><small>Generating PDF bingo cards.</small></p>
</figure>

### **Saved Game Records**

A user with an account will be able to keep track of data related to each game. After successful sign-in, the _game records_ tab can be accessed to view each game the user has saved.

Each record contains information such as the date saved, the winner, the game type (depicted by the icon on the record itself), and all the numbers that were called up until a winner was decided.

Records can be completely erased from a user's account by accessing the _settings_ tab within the panel.

<figure>

![Image Example with link](/Assets/screenshots/records.png)

<p align="center"><small>Viewing saved game records.</small></p>
</figure>

## **Tests**

End-to-end testing of the application was done using [Cypress](https://www.cypress.io/) and can be ran via the Cypress GUI or CLI.

Open Cypress testing GUI:

```
npm run cypress:open
```

Run Cypress in CLI:

```
npm run cy:run
```

The URL that points Cypress towards visiting is set to the root of `localhost:3000` but can be changed by editing the `baseUrl` value within [cypress.config.js](https://github.com/antmercado94/bingocompanionapp/blob/main/cypress.config.js).

```js
module.exports = {
  e2e: {
    baseUrl: 'http://localhost:3000/',
  },
};
```

## **License**

Code released under [the MIT license](https://github.com/antmercado94/bingocompanionapp/blob/main/LICENSE).
