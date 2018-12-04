function rollDice(){
  var numbers = [1,2,3,4,5,6];
  var number = numbers[Math.floor(Math.random()*numbers.length)];
  return number;
}

function changeImg(){
  var dice = document.getElementByClassName("dice");
  if(rollDice()===1){
    dice.src = "images/dice1.png";
  }
  else if (rollDice()===2) {
    dice.src = "images/dice2.png";
  }
  else if (rollDice()===3) {
    dice.src = "images/dice3.png";
  }
  else if (rollDice()===4) {
    dice.src = "images/dice4.png";
  }
  else if (rollDice()===5) {
    dice.src = "images/dice5.png";
  }
  else if (rollDice()===6) {
    dice.src = "images/dice6.png";
  }
}

console.log(rollDice());
