let currentPosition = [];

function moveOneGridBelow49(pNum, step, last){
  setTimeout(function() {
    currentPosition[pNum]++;
    movePlayer(pNum);

    if(last){
      checkForTrap(pNum);
    }
  }, step*100);
}

function moveOneGridAfter49(pNum, step, last){
  setTimeout(function() {
    currentPosition[pNum]--;
    movePlayer(pNum);

    if(last){
      checkForTrap(pNum);
    }
  }, step*100);
}

function move(pNum, numRolled){
    var before49 = true;
    var last = false;
    for(var i=0; i<numRolled; i++){
      if(i+1==numRolled){
        last = true;
      }
      if(before49){
        moveOneGridBelow49(pNum, i+1, last);
      }
      else{
        moveOneGridAfter49(pNum, i+1, last);
      }
      if((currentPosition[pNum]+i+1)===49){
        before49=false;
      }
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
