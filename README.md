# Developer advocate Technical Test @ Dataiku

## Game API

This repository contains the source code of a small game similar to [Top Trumps card games](https://en.wikipedia.org/wiki/Top_Trumps).
You can register and get a starter deck of cards as a player. 
Each card represents a Marvel Universe hero with four characteristics: strength, skill, size, and popularity.

![Batman](./resources/batman.png) | Batman
------------ | -------------
Strength | 22
Skills | 17
Size | 5.7
Popularity | 9.8

To get new cards, you can fight against the computer with your cards.
Each deck of cards is ordered, and you fight with the first card of your deck.
You can look at it, decide which characteristic is the most promising, and challenge the computer with this characteristic.
If the computer card has a higher value than yours in this characteristic, you lose your card. 
But, if your card is better, the card from the computer is yours (and you keep your card).
In case of a draw, all players keep their cards.

If you are dissatisfied with your current card(s) or lost all your cards, you can buy one or more from the store.
The new cards are added to the top of your deck.

The code for this game and its API can be found in the following locations:
  - [server/server.js](https://github.com/dataiku/api-challenge/tree/master/server/server.js)
  - [server/game.js](https://github.com/dataiku/api-challenge/tree/master/server/game.js)

## Challenge

Your goal is to write:
 1. The documentation for the REST API of this small card game.
 1. Considering you have a client library (in the language of your choice), write a tutorial on a subject of your choice (using the client library).

Game on!

## Getting Started
Install a recent version of [nodeJS](https://nodejs.org/en/download/) and npm on your computer. Open a terminal and issue the following command to confirm they are properly installed (you don't need the exact same versions).
```sh
$ node -v
v22.9.0
$ npm -v
10.8.3
```

Now clone this repository and go to the corresponding directory
```sh
npm install
npm run start
```

Open your browser and go to [http://localhost:4000/ping](http://localhost:4000/ping).
If everything is set correctly your browser should display:
```
{"status":"OK"}
```

You can then launch a demonstration of the game with the following command.
```sh
npm run demo
```
The code for the demonstration is [client/client.js](https://github.com/dataiku/api-challenge/tree/master/client/client.js)


Batman icon, courtesy of [Vectoo](https://www.iconfinder.com/icons/2525034/batman_halloween_hero_super_hero_icon) under [CC BY-SA 3.0 license](https://creativecommons.org/licenses/by-sa/3.0/)
