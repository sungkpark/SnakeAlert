
function moveOneGridBelow49(){
  currentPosition++;
  setTimeout(function() {
    movePlayer();
  }, 100);
}

function moveOneGridAfter49(){
  currentPosition--;
  movePlayer();
}

function move(numRolled){
    var before49 = true;
    for(var i=0; i<numRolled; i++){
      if(before49){
        moveOneGridBelow49();
      }
      else{
        moveOneGridAfter49();
      }
      if(currentPosition===49){
        before49=false;
      }
    }
    if(currentPosition===49){
      cumDiceRolled=0;
      currentPosition=0;
      numOfDiceRolled=0;
      alert("Congrats, you won!");
    }
}

function movePlayer(){
  $('#player1').remove();
  $('#'+currentPosition).append('<img id="player1" src="images/playerRed.png" alt="player 1" height="30" width="20">');
}

function checkForTrap(){
  let here = currentPosition;
  if(snakeHead.indexOf(currentPosition)!==-1){
    goDownSnake(here);
  }
  if(ladderStart.indexOf(currentPosition)!==-1){
    goUpLadder(here);
  }
}

function goDownSnake(a){
  for(let i=0; i<6; i++){
    if(snakeCoordinate[i][0]===a){
        currentPosition = snakeCoordinate[i][1];
        break;
    }
  }
  movePlayer();
}

function goUpLadder(a){
  for(let i=0; i<6; i++){
    if(ladderCoordinate[i][0]===a){
        currentPosition = ladderCoordinate[i][1];
        break;
    }
  }
  movePlayer();
}

/*
 * Object representing the status bar.
 */
