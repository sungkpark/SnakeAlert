/* ESLint global variables information */
/* global Setup, Status, Messages, englishDict*/

/* basic constructor of game state */
function GameState(board, sb, socket){
  this.playerType = null;
  this.board = board;
  this.currentPosition = 0;
  this.statusBar = sb;

  var board = function(width, height){

  }


  var player = function(board, id, name, color){

  }

  this.getPlayerType = function(){
    return this.playerType;
  }

  this.setPlayerType = function(p) {
    console.assert(typeof p == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof p);
    this.playerType = p;
  }


  this.incPosition = function(){
    this.currentPosition = this.currentPosition +
  }



  (function setup(){
    var socket = new WebSocket(Setup.WEB_SOCKET_URL);

  })
}