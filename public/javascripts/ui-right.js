
function moveOneGridBelow49(pNum){
  currentPosition[pNum]++;
  setTimeout(function() {
    movePlayer(pNum);
  }, 100);
}

function moveOneGridAfter49(pNum){
  currentPosition[pNum]--;
  movePlayer(pNum);
}

function move(pNum, numRolled){
    var before49 = true;
    for(var i=0; i<numRolled; i++){
      if(before49){
        moveOneGridBelow49(pNum);
      }
      else{
        moveOneGridAfter49(pNum);
      }
      if(currentPosition[pNum]===49){
        before49=false;
      }
    }
    if(currentPosition[pNum]===49){
      cumDiceRolled[pNum]=0;
      currentPosition[pNum]=0;
      numOfDiceRolled[pNum]=0;
      alert("Congrats, somebody won!");
    }
}

function movePlayer(pNum){
  $('#player'+pNum).remove();
  $('#'+currentPosition[pNum]).append('<img id="player'+ pNum
   + '" src="images/player'+pNum+'.png" alt="player '+ pNum + '" height="30" width="20">');
}

function checkForTrap(pNum){
  let here = currentPosition[pNum];
  if(snakeHead.indexOf(currentPosition[pNum])!==-1){
    goDownSnake(pNum, here);
  }
  if(ladderStart.indexOf(currentPosition[pNum])!==-1){
    goUpLadder(pNum, here);
  }
}

function goDownSnake(pNum, a){
  for(let i=0; i<6; i++){
    if(snakeCoordinate[i][0]===a){
        currentPosition[pNum] = snakeCoordinate[i][1];
        break;
    }
  }
  movePlayer(pNum);
}

function goUpLadder(pNum, a){
  for(let i=0; i<4; i++){
    if(ladderCoordinate[i][0]===a){
        currentPosition[pNum] = ladderCoordinate[i][1];
        break;
    }
  }
  movePlayer(pNum);
}
