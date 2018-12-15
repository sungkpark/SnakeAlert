/* --------------------------------- Importing modules ------------------------------------------------ */
var express = require("express");
var http = require("http");
var websocket = require("ws");
let ejs = require('ejs');

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
  res.render('splash.ejs', {
    playersOnline: playersConnected,
    gamesStarted: gamesStarted,
    gamesCompleted: gamesCompleted
  });
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
        let game;
        let gameID;

        switch(data.action){
          case "GET_STATS":
            const stats = {
              action: "UPDATE_STATS",
              pConnected: playersConnected,
              gStarted: gamesStarted,
              gCompleted: gamesCompleted
            };
            const json = JSON.stringify(stats);
            ws.send(json);
            break;

          case "CREATE_GAME":
            gameID = Math.random().toString(36).substr(2, 9);

            game = {
              status: "WAITING",
              nPlayers: data.players,
              players:[],
              turn: 0
            };
            games[gameID] = game;

            game.players[0] = {
              id: ws.id,
              name: data.name
            };
            ws.gameID = gameID;

            ejs.renderFile(
              'views/game.ejs',
              {
                gameID: gameID,
                pConnected: game.players.length,
                playerInformation: generatePlayerInformation(game.nPlayers, game.players)
              },
              function(err, html) {
                const stats = {
                  action: "UPDATE_PAGE",
                  nHTML: html, gID: gameID,
                  players: game.players,
                  nPlayers: game.nPlayers
                };
                const json = JSON.stringify(stats);
                ws.send(json);
            });
            break;

          case "JOIN_GAME":
            gameID = data.gameID;
            game = games[gameID];
            if (typeof game !== 'undefined' &&
              game.status == "WAITING") {
                game.players[game.players.length] = {
                  id: ws.id,
                  name: data.name
                };
                ws.gameID = gameID;

                for(let i = 0; i < game.players.length - 1; i++){
                  const stats = {
                    action: "UPDATE_PLAYERS",
                    players: game.players,
                    nPlayers: game.nPlayers
                  };
                  const json = JSON.stringify(stats);
                  players[game.players[i].id].send(json);
                }

                ejs.renderFile(
                  'views/game.ejs',
                  {
                    gameID: gameID,
                    pConnected: game.players.length,
                    playerInformation: generatePlayerInformation(game.nPlayers, game.players)
                  },
                    function(err, html) {
                      const stats = {
                        action: "UPDATE_PAGE",
                        nHTML: html,
                        gID: gameID,
                        players: game.players,
                        nPlayers: game.nPlayers
                      };
                    const json = JSON.stringify(stats);
                    ws.send(json);
                });

                if(game.players.length == game.nPlayers){
                  game.status = "PLAYING";
                  sendEachPlayer(game, {action: "START_GAME", nPlayers: game.nPlayers});
                }
              }
              break;

            case "DICEROLL":
              gameID = ws.gameID;
              game = games[gameID];
              if(game.players[game.turn].id == ws.id && game.status == "PLAYING"){
                let numRoll = Math.floor(Math.random() * 6) + 1;
                sendEachPlayer(game, {action: "DICEROLL", numRoll: numRoll, player: game.turn});
                console.log(numRoll);
                if(++game.turn == game.nPlayers){
                  game.turn = 0;
                }
              }
              break;
        }
    });

    ws.on('close', function () {
      let gameID = ws.gameID;
      let game = games[gameID];

      if(typeof game != 'undefined'){
        console.log("Aborting " + gameID);
        for(let i = 0; i < game.players.length; i++){
          if(ws.id != game.players[i].id){
            const request = {action: "ABORT_GAME"};
            const json = JSON.stringify(request);
            players[game.players[i].id].send(json);
          }
        }
        delete games[gameID];
      }

      delete playersConnected[ws.id];
      playersConnected--;
    })
});

server.listen(port);

function generatePlayerInformation(nPlayers, players){
  let html = "";
  for(let i = 1; i <= nPlayers; i++){
    if(i <= players.length){
      html += '<p id="player' + i + '">Player ' + i +': ' + players[i-1].name + '</p>';
    }else{
      html += '<p id="player' + i + '">...</p>';
    }
  }
  return html;
}

function sendEachPlayer(game, data){
  for(let i = 0; i < game.players.length; i++){
    const json = JSON.stringify(data);
    players[game.players[i].id].send(json);
  }
}
