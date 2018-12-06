function rollDice(){
  var numbers = [1,2,3,4,5,6];
  var number = numbers[Math.floor(Math.random()*numbers.length)];
  return number;
}

var cumDiceRolled = 0;

function changeImg(){
  var diceRolled = rollDice();
  // cumDiceRolled += diceRolled;
  // console.log('You rolled a ' + diceRolled);
  // console.log('cumDiceRolled: ' + cumDiceRolled);
  if(diceRolled===1){
    $("#dice").html('<img src="images/dice1.png" onclick="changeImg()" alt="diceImage" width="100" height="100">');
    move(1);
  }
  else if (diceRolled===2) {
    $("#dice").html('<img src="images/dice2.png" onclick="changeImg()" alt="diceImage" width="100" height="100">');
    move(2);
  }
  else if (diceRolled===3) {
    $("#dice").html('<img src="images/dice3.png" onclick="changeImg()" alt="diceImage" width="100" height="100">');
    move(3);
  }
  else if (diceRolled===4) {
    $("#dice").html('<img src="images/dice4.png" onclick="changeImg()" alt="diceImage" width="100" height="100">');
    move(4);
  }
  else if (diceRolled===5) {
    $("#dice").html('<img src="images/dice5.png" onclick="changeImg()" alt="diceImage" width="100" height="100">');
    move(5);
  }
  else if (diceRolled===6) {
    $("#dice").html('<img src="images/dice6.png" onclick="changeImg()" alt="diceImage" width="100" height="100">');
    move(6);
  }
  // console.log('current position: ' + currentPosition);
}
