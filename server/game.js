//'use strict';
//const uuid = require('uuid');
const { v4: uuidv4 } = require('uuid');

// Player cards dictionary
// Key: player username (string)
// Value: Array of cards {id (string), name (string), strength (number), skill (number), size (number), popularity (number)}
var playerCards = {};

// Players username/ID dictionary
// Key: player username (string)
// Value: player ID (string)
var players = {};

// Players ID/details dictionary
// Key: player ID (string)
// Value: Object { username (string), birthdate (Date), email (string) }
var playersDetails = {};

var birthdateRegex = RegExp('[0-9]{4}-[0-9]{2}-[0-9]{2}')

var heroes = ["Wolverine","Spider-Man","Thor","Iron Man","Hulk","Captain America","Daredevil","Punisher","Deadpool","Silver Surfer","Gambit","Cyclops","Mr. Fantastic","Nightcrawler","Nick Fury","Human Torch","Iceman","Professor X","Colossus","Bucky Barnes","Doctor Strange","Storm","Jean Grey","Rogue","Elektra","Emma Frost","Thing","Black Bolt","She-Hulk","Invisible Woman","Namor","Black Panther","Beast","Kitty Pryde","Sentry","Hawkeye","Luke Cage","Iron Fist","Scarlet Witch","Cable","Hercules","X-23","Hank Pym","Moon Knight","Angel","Psylocke","War Machine","Carol Danvers","Black Cat","Captain Marvel","Warpath","Madrox","Quicksilver","Spider-Woman","Domino","Vision","Black Widow","Blade","Speedball","Morph","Nova","Wasp","Wonder Man","Beta Ray Bill","Falcon","Tigra","Mimic","Captain Britai","Songbird","Quasar","Shang-Chi","Strong Guy","Ka-Zar","Havok","Rick Jones","Amadeus Cho","Dagger","Cloak","Adam Warlock","Molly Hayes","Jessica Jones","Howard the Duck","Squirrel Girl","Wiccan","Cannonball","Longshot","Magik","Jubilee","Hulkling","Machine Man","Black Knight","Northstar","Rachel Grey","Firestar","Layla Miller","Nico Minoru","Eric O'Grady","Ben Reilly","Spectrum","Dazzler"];

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function newCard() {
  return {
      id: uuidv4(),
      name: heroes[randomInt(heroes.length)],
      strength: randomInt(50),
      skill: randomInt(30),
      size: 5 + randomInt(60)/10,
      popularity: randomInt(100)/10
    };
};

module.exports = {
  initialize() {
    playerCards = {};

    let computerCards = [];
    for (let i = 0; i < 7; i++) {
      computerCards.push(newCard());
    }
    playerCards["computer"] = computerCards;
  },

    register(res, player) {
    if (player.username === undefined || player.username == "") {
      res.status(400).json({errorCode: 4, message: "Missing or empty username"});
      return;
    }
    if (player.username in players) {
      res.status(400).json({errorCode: 1, message: "Player already registered"});
      return;
    }
    if (player.birthdate === undefined || !birthdateRegex.test(player.birthdate)) {
      res.status(400).json({errorCode: 5, message: "Invalid or missing birthdate. Expected format is YYYY-MM-DD."});
      return;
    }
    if (player.email === undefined || !validateEmail(player.email)) {
      res.status(400).json({errorCode: 6, message: "Invalid or missing email."});
      return;
    }

    // Register player
    let playerID = uuidv4();
    players[player.username] = playerID;
    playersDetails[playerID] = {
      username: player.username,
      birthdate: player.birthdate,
      email: player.email
    }

    // Generate initial card deck
    let card = newCard();
    let cards = [];
    for (let i = 0; i < 7; i++) {
      cards.push(newCard());
    }
    playerCards[playerID] = cards;
    res.json({
      playerID: playerID,
      cards: cards
    });
  },

  profile(res, playerID) {
    if (!(playerID in playersDetails)) {
      res.status(400).json({errorCode: 2, message: "Unknown player ID: " + playerID});
      return;
    }
    res.json(playersDetails[playerID]);
  },

  buyCard(res, playerID) {
    if (!(playerID in playersDetails)) {
      res.status(400).json({errorCode: 2, message: "Unknown player ID: " + playerID});
      return;
    }
    let card = newCard();
    playerCards[playerID].unshift(card);
    res.json(card);
  },

  listCards(res, playerID) {
    if (!(playerID in playersDetails)) {
      res.status(400).json({errorCode: 2, message: "Unknown player ID: " + playerID});
      return;
    }
    res.json(playerCards[playerID]);
  },

  nextCard(res, playerID) {
    if (!(playerID in playersDetails)) {
      res.status(400).json({errorCode: 2, message: "Unknown player ID: " + playerID});
      return;
    }
    let cards = playerCards[playerID];
    if (cards.length == 0) {
      res.status(400).json({errorCode: 3, message: "No more cards. Buy more cards to keep playing."});
      return;
    }
    res.json(cards[0]);
  },

  battleCard(res, playerID, field) {
    if (!(playerID in playersDetails)) {
      res.status(400).json({errorCode: 2, message: "Unknown player ID: " + playerID});
      return;
    }
    let computerCards = playerCards["computer"];
    while (computerCards.length < 7) {
      computerCards.push(newCard());
    }
    let computerCard = computerCards.shift();
    let computerCardValue = computerCard[field];

    let cards = playerCards[playerID];
    if (cards.length == 0) {
      res.status(400).json({errorCode: 3, message: "No more cards. Buy more cards to keep playing."});
      return;
    }
    let playerCard = cards.shift();
    let playerCardValue = playerCard[field];
    if (playerCardValue == computerCardValue) {
      // Draw: players keep their card
      cards.push(playerCard);
      res.json({ outcome: "draw", card: playerCard, opponentCard: computerCard });
    } else if (playerCardValue > computerCardValue) {
      // Win: players wins computer card
      cards.push(playerCard);
      cards.push(computerCard);
      res.json({ outcome: "win", card: playerCard, opponentCard: computerCard });
    } else {
      // Loss: players loose their card
      res.json({ outcome: "loss", card: playerCard, opponentCard: computerCard });
    }
  }
};
