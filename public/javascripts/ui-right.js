
function moveOneGridBelow49(){
  currentPosition++;
}

function moveOneGridAfter49(){
  currentPosition--;
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
      alert("Congrats, you won!");
    }
}

/*
 * Object representing the status bar.
 */
