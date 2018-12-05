/* --------------------------------- Importing modules ------------------------------------------------ */
var express = require("express");
var http = require("http");
var websocket = require("ws");
var fs = require('fs');

var port = process.argv[2];
var app = express();

/* ---------- Setting up variables ---------- */
var players = {};         //Object with all players/connections
var games = {};           //Object with all games

//Stats variables
var playersConnected = 0; 
var gamesStarted = 0;     
var gamesCompleted = 0;    

/* --------------------------------- Setting up express server ---------------------------------------- */
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.get('/', function(req,res){
  res.render('splash.ejs', {playersOnline: playersConnected, gamesStarted: gamesStarted, gamesCompleted: gamesCompleted});
})

var server = http.createServer(app);

/* --------------------------------- WebSockets ------------------------------------------------------ */
const wss = new websocket.Server({clientTracking: false, server});

wss.on("connection", function(ws) {
    //Keep track of client
    ws.id = Math.random().toString(36).substr(2, 9);
    players[ws.id] = ws;
    playersConnected++;

    ws.on("message", function incoming(message) {
        const data = JSON.parse(message);

        switch(data.action){
          case "GET_STATS":
            const stats = {action: "UPDATE_STATS", pConnected: playersConnected, 
                            gStarted: gamesStarted, gCompleted: gamesCompleted};
            const json = JSON.stringify(stats);
            ws.send(json);
            break;

          case "CREATE_GAME":
            const gameID = Math.random().toString(36).substr(2, 9);
            games[gameID] = {status: "WAITING", nPlayers: data.players, players:[]};
            games[gameID].players[0] = {id: ws.id, name: data.name};

            fs.readFile('./public/gamebody.html', "utf8", function(err, html) {
              const stats = {action: "UPDATE_PAGE", nHTML: html, gID: gameID, 
                            players: games[gameID].players, nPlayers: games[gameID].nPlayers};
              const json = JSON.stringify(stats);
              ws.send(json);
            });
            break;

          case "JOIN_GAME":
            const cGameID = data.gameID;
            const game = games[cGameID];
            if (typeof game !== 'undefined' &&
              game.status == "WAITING") {
              game.players[game.players.length] = {id: ws.id, name: data.name};
              
              for(let i = 0; i < game.players.length - 1; i++){
                const stats = {action: "UPDATE_PLAYERS", players: game.players, 
                              nPlayers: game.nPlayers};
                const json = JSON.stringify(stats);
                players[game.players[i].id].send(json);
              }

              fs.readFile('./public/gamebody.html', "utf8", function(err, html) {
                const stats = {action: "UPDATE_PAGE", nHTML: html, gID: cGameID, 
                              players: game.players, nPlayers: game.nPlayers};
                const json = JSON.stringify(stats);
                ws.send(json);
              });
            }
            break;
        }
    });

    ws.on('close', function () {
      delete playersConnected[ws.id];
      playersConnected--;
    })
});

server.listen(port);
