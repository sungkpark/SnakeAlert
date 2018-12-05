function rollDice(){
  var numbers = [1,2,3,4,5,6];
  var number = numbers[Math.floor(Math.random()*numbers.length)];
  return number;
}

var cumDiceRolled = 0;

function changeImg(){
  var diceRolled = rollDice();
  cumDiceRolled += diceRolled;
  console.log('You rolled a ' + diceRolled);
  console.log('cumDiceRolled: ' + cumDiceRolled);

  if(diceRolled===1){
    $("#dice").html('<img src="images/dice1.png" onclick="changeImg()" alt="diceImage" width="100" height="100">');
    if(currentPosition<48){
      moveOneGridBelow49();
    }
    else if(currentPosition===48){
      alert("Congrats, you won!");
    }
  }
  else if (diceRolled===2) {
    $("#dice").html('<img src="images/dice2.png" onclick="changeImg()" alt="diceImage" width="100" height="100">');
    if(currentPosition<47){
      for(var i=0; i<2; i++){
        moveOneGridBelow49();
      }
    }
    else if(currentPosition===47){
      alert("Congrats, you won!");
    }
    else {
      moveOneGridBelow49();
      moveOneGridAfter49();
    }
  }
  else if (diceRolled===3) {
    $("#dice").html('<img src="images/dice3.png" onclick="changeImg()" alt="diceImage" width="100" height="100">');
    if(currentPosition<46){
      for(var i=0; i<3; i++){
        moveOneGridBelow49();
      }
    }
    else if(currentPosition===46){
      alert("Congrats, you won!");
    }
    else {
      var temp = currentPosition;
      for(var i=0; i<49-temp; i++){
        moveOneGridBelow49();
      }
      for(var i=0; i<3-(49-temp); i++){
        moveOneGridAfter49();
      }
    }
  }
  else if (diceRolled===4) {
    $("#dice").html('<img src="images/dice4.png" onclick="changeImg()" alt="diceImage" width="100" height="100">');
    if(currentPosition<45){
      for(var i=0; i<4; i++){
        moveOneGridBelow49();
      }
    }
    else if(currentPosition===45){
      alert("Congrats, you won!");
    }
    else {
      var temp = currentPosition;
      for(var i=0; i<49-temp; i++){
        moveOneGridBelow49();
      }
      for(var i=0; i<4-(49-temp); i++){
        moveOneGridAfter49();
      }
    }
  }
  else if (diceRolled===5) {
    $("#dice").html('<img src="images/dice5.png" onclick="changeImg()" alt="diceImage" width="100" height="100">');
    if(currentPosition<44){
      for(var i=0; i<5; i++){
        moveOneGridBelow49();
      }
    }
    else if(currentPosition===44){
      alert("Congrats, you won!");
    }
    else {
      var temp = currentPosition;
      for(var i=0; i<49-temp; i++){
        moveOneGridBelow49();
      }
      for(var i=0; i<5-(49-temp); i++){
        moveOneGridAfter49();
      }
    }
  }
  else if (diceRolled===6) {
    $("#dice").html('<img src="images/dice6.png" onclick="changeImg()" alt="diceImage" width="100" height="100">');
    if(currentPosition<43){
      for(var i=0; i<6; i++){
        moveOneGridBelow49();
      }
    }
    else if(currentPosition===43){
      alert("Congrats, you won!");
    }
    else {
      var temp = currentPosition;
      for(var i=0; i<49-temp; i++){
        moveOneGridBelow49();
      }
      for(var i=0; i<6-(49-temp); i++){
        moveOneGridAfter49();
      }
    }
  }
  console.log('current position: ' + currentPosition);
}
