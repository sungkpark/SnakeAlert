/* --------------------------------- Importing modules ------------------------------------------------ */
var express = require("express");
var cookieParser = require('cookie-parser');
var http = require("http");
var websocket = require("ws");
let ejs = require('ejs');

var port = process.argv[2];
var app = express();
app.use(cookieParser());

/* ---------- Setting up variables ---------- */
var players = {};         //Object with all players/connections
var games = {};           //Object with all games
var board = {4: 18, 13: 28, 15: 1, 24: 39, 26: 12, 35: 10, 40: 25, 45: 29, 42: 44, 48: 34};

//Stats variables
var playersConnected = 0;
var gamesStarted = 0;
var gamesCompleted = 0;

/* --------------------------------- Setting up express server ---------------------------------------- */
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.get('/*', function(req,res){
  let timesVisited = 1;
  if(req.cookies.visited !== undefined){
    timesVisited = parseInt(req.cookies.visited) + 1;
  }
  res.cookie('visited', timesVisited, { maxAge: 365*24*60*60*1000, httpOnly: false });
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
              name: data.name,
              position: 0
            };
            ws.gameID = gameID;

            ejs.renderFile(
              'views/game.ejs',
              {
                gameID: gameID,
                pConnected: game.players.length,
                playerInformation: generatePlayerInformation(game.nPlayers, game.players, game.players.length)
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
                  name: data.name,
                  position: 0
                };
                ws.gameID = gameID;

                for(let i = 0; i < game.players.length; i++){
                  const stats = {
                    action: "UPDATE_PLAYERS",
                    players: game.players,
                    nPlayers: game.nPlayers,
                    me: i
                  };
                  const json = JSON.stringify(stats);
                  players[game.players[i].id].send(json);
                }

                ejs.renderFile(
                  'views/game.ejs',
                  {
                    gameID: gameID,
                    pConnected: game.players.length,
                    playerInformation: generatePlayerInformation(game.nPlayers, game.players, game.players.length)
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
                  gamesStarted++;
                }
              }
              break;

            case "DICEROLL":
              gameID = ws.gameID;
              game = games[gameID];
              player = game.players[game.turn];
              if(player.id == ws.id && game.status == "PLAYING"){
                //roll the dice
                let numRoll = Math.floor(Math.random() * 6) + 1;
                sendEachPlayer(game, {action: "DICEROLL", numRoll: numRoll, player: game.turn, players: game.players, nPlayers: game.nPlayers});
                //update player position
                player.position += numRoll;
                if(typeof board[player.position] !== 'undefined'){                                //check for ladders/snakes
                  player.position = board[player.position];
                }else if(player.position == 49){
                  console.log("GAME END");                                                 //game won
                  gamesCompleted++;
                  let ms = 1000;                                                      //1 second + animation
                  setTimeout(function(){                                                          //insures animation plays out first
                    sendEachPlayer(game, {action: "WON_GAME", winnerName: player.name});         
                    delete games[gameID];
                  }, ms);
                }
                //update game turn
                if(++game.turn == game.nPlayers){
                  game.turn = 0;
                }
                console.log(player.position);
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

function generatePlayerInformation(nPlayers, players, me){
  let html = "";
  for(let i = 1; i <= nPlayers; i++){
    if(i <= players.length){
      if(i == me){
        html += '<strong><p id="player' + i + 'name">' + i +': ' + players[i-1].name + '</p></strong>';
      }else{
        html += '<p id="player' + i + 'name">' + i +': ' + players[i-1].name + '</p>';
      }
    }else{
      html += '<p id="player' + i + 'name">...</p>';
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
