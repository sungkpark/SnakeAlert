var status = "SPLASH";

var socket = new WebSocket("ws://" + window.location.hostname + ":3000");
socket.onmessage = function(event){
    const data = JSON.parse(event.data);
    switch(data.action){
        case "UPDATE_STATS":
            $("#connected").html("Players online: " + data.pConnected);
            $("#started").html("Number of games started: " + data.gStarted);
            $("#completed").html("Number of games completed: " + data.gCompleted);
            break;

        case "UPDATE_PAGE":
            $('head').append('<link rel="stylesheet" type="text/css" href="stylesheets/game.css">');
            $(document.body).html(data.nHTML);
            $("#gameID").html("Game ID: " + data.gID);

        case "UPDATE_PLAYERS":
            $("#playerConnected").html("Players connected: " + data.players.length + "/" + data.nPlayers);
            for(var i = 0; i < data.nPlayers; i++){
                var playerString = "#player" + (i + 1) + "name";
                if(typeof data.players[i] !== 'undefined') {
                    $(playerString).html("Player" + (i + 1) + ": " + data.players[i].name);
                }else{
                    $(playerString).html("Player" + (i + 1) + ": " +"...");
                }
            }
            break;

        case "START_GAME":
            for(let i = 0; i < data.nPlayers; i++){
                currentPosition[i] = 0;
                movePlayer(i);
            }
            break;

        case "ABORT_GAME":
            alert("Someone left, this game is aborted. Goodbye motherfucker.");
            $(document.body).html("Some fucker aborted the game, refresh the page please.");
            break;

        case "DICEROLL":
            changeImg(data.player, data.numRoll);
            console.log(data.numRoll);
            console.log(data.player);
            break;
    }
}
socket.onopen = function(){
    getStats();
};

function getStats(){
    const message = {action: "GET_STATS"};
    const json = JSON.stringify(message);
    socket.send(json);
}

function createGame(){
    var nPlayers = 2;
    if($("#radio3").prop('checked')){
        nPlayers = 3;
    }else if($("#radio4").prop('checked')){
        nPlayers = 4;
    }
    const pName = $("#pName").val();
    const request = {action: "CREATE_GAME", players: nPlayers, name: pName};
    const json = JSON.stringify(request);
    socket.send(json);
}

function joinGame(){
    const pName = $("#pName").val();
    const request = {action: "JOIN_GAME", name: pName, gameID: $("#gameID").val()};
    const json = JSON.stringify(request);
    socket.send(json);
}

function roll(){
    console.log("JEP");
    const message = {action: "DICEROLL"};
    const json = JSON.stringify(message);
    socket.send(json);
}

// Get live statistics updates every second while in splash
setInterval(function() {
    if(status=="SPLASH"){
        getStats();
    }else{
        clearInterval();
    }
}, 1000);

// Create a random name
$(document).ready(function(){
    const rNumber = Math.floor((Math.random() * 10000) + 1);
    $("#pName").attr("value", "Guest" + rNumber);
});
