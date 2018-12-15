/* ESLint global variables information */
/* global Setup, Status, Messages, englishDict*/

let currentPosition = [];


/* basic constructor of game state */

this.getPlayerType = function(){
  return this.playerType;
}

this.setPlayerType = function(p) {
  console.assert(typeof p == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof p);
  this.playerType = p;
}

(function setup(){
  var socket = new WebSocket(Setup.WEB_SOCKET_URL);

})
