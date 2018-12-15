/*function rollDice(){
  var numbers = [1,2,3,4,5,6];
  var number = numbers[Math.floor(Math.random()*numbers.length)];
  return number;
}*/

var cumDiceRolled = [0,0,0,0];
var numOfDiceRolled = [0,0,0,0];

function changeImg(pNum, diceRolled){
  cumDiceRolled[pNum] += diceRolled;
  numOfDiceRolled[pNum]++;
  console.log('number of dice rolled: ' + numOfDiceRolled[pNum]);
  console.log('You rolled a ' + diceRolled);
  console.log('cumDiceRolled: ' + cumDiceRolled[pNum]);
  $("[alt='diceImage']").attr('src', 'images/dice' + diceRolled + '.png');
  move(pNum, diceRolled);

  console.log('current position: ' + currentPosition[pNum]);
}
