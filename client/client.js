import got from 'got';

//var request = require("got");

var request = got;

const serverUrl = "http://localhost:4000";
const fields = ["strength", "skill", "size", "popularity"]

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

(async() => {
	// Check server status
    let serverStatus = await got(serverUrl + "/ping").json();
    if (serverStatus === undefined || serverStatus.status != "OK") {
	return console.error("Game server returned an invalid status: " + serverStatus)
    }

    try {
	// Register a new player
	let playerUsername = "player" + randomInt(25);
	let player = { username: playerUsername, email: playerUsername + "@gmail.com", "birthdate": "1999-02-13"};
	let registration = await got(serverUrl + "/register", {method: "POST", json: player}).json();
	let playerID = registration.playerID;
	console.log("Registered player. PlayerID=" + playerID);

	// Check out profile
	let playerInfo = await got(serverUrl + "/profile", {method: "GET", headers: { playerID: playerID }}).json();
	console.log("Player profile: username=" + playerInfo.email + " / email=" + playerInfo.email + " / birthdate=" + playerInfo.birthdate);

	// Let's play!
	console.log("");
	console.log("Let's start playing!");
	for (let i = 0; i < 5; i++) {
	    let nextCard = await got(serverUrl + "/next-card", {headers: { playerID: playerID }}).json();
	    console.log("Next card is " + nextCard.name);
	    console.log("  Strength: " + nextCard.strength);
	    console.log("  Skill: " + nextCard.skill);
	    console.log("  Size: " + nextCard.size);
	    console.log("  Popularity: " + nextCard.popularity);

	    let battleField = fields[randomInt(4)];
	    console.log("Battling on field: " + battleField);
            let battleJ = { field: battleField };
	    let battle = await got(serverUrl + "/battle", { method: "POST", json: battleJ , headers: { playerID: playerID }}).json();
	    console.log("Battle outcome: " + battle.outcome + " (" + nextCard[battleField] + " vs. " + battle.opponentCard[battleField] + ")");

	    let cards = await got(serverUrl + "/cards",{headers: { playerID: playerID }}).json();
	    console.log("We now have " + cards.length + " cards.");

	    console.log("");

	}

	// Let's buy a card!
	console.log("Buying a new card...");
	let newCard = await got(serverUrl + "/buy-card", {headers: { playerID: playerID }}).json();
	console.log("We got " + newCard.name);
	console.log("  Strength: " + newCard.strength);
	console.log("  Skill: " + newCard.skill);
	console.log("  Size: " + newCard.size);
	console.log("  Popularity: " + newCard.popularity);

	let cards = await got(serverUrl + "/cards", {headers: { playerID: playerID }}).json();
        console.log("We now have " + cards.length + " cards.");
    } catch (error) {
        let err = JSON.parse(error.response.body);
	if (err.errorCode) {
	    return console.error("ERROR: " + err.message);
	} else {
	    return console.error("ERROR: Game server returned error code " + error);
	}
    }

})();
