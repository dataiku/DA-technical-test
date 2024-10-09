//'use strict';
const path = require('path');
const express = require('express');
const game = require('./game');

const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.set('port', 4000);

// Available methods

app.get('/ping', (req, res) => {
    res.json({status: "OK"});
});

app.post('/register', (req, res) => {
    // Body should contain { username, birthdate, email }
    game.register(res, req.body);
});

app.get('/profile', (req, res) => {
  game.profile(res, req.headers.playerid);
});

app.get('/buy-card', (req, res) => {
  game.buyCard(res, req.headers.playerid);
});

app.get('/next-card', (req, res) => {
  game.nextCard(res, req.headers.playerid);
});

app.post('/battle', (req, res) => {
  game.battleCard(res, req.headers.playerid, req.body.field);
});

app.get('/cards', (req, res) => {
  game.listCards(res, req.headers.playerid);
});

// Server bootstrap
const server = app.listen(app.get('port'), () => {
  game.initialize()
  console.log('********************');
  console.log('* Game initialized *');
  console.log('********************');
  console.log('Open the following url in your browser to test the server: http://localhost:'+ app.get('port')+'/ping');
});

module.exports = server;
