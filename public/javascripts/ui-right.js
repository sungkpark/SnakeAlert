
function rollDice(){
  var div = document.getElementsByClassNameByClass("dice")[0];
}

function movePlayerByOneGrid(){
  if(this.currentPosition++ !== 49){
    this.currentPosition++;
  }
  else if(this.currentPosition++ === 49){}
}

function iterateMove() {

}

/*
 * Object representing the status bar.
 */



console.log(rollDice());
