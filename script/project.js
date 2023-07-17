/* Christopher Wong | Final Project Assignment | Dice Game
Author: Christopher Wong A00847417
Date: 7/16/2023 
This is a dice game where the user rolls a set of dice against a CPU set of dice. 
The totals are added together and compared after 3 rounds declaring the winner.
*/ 

// path to images for dice feedback
const pathToImages = "images/dice-images/";

// Button elements for styling, user experience and user feedback
const startElem = document.getElementById('startButton');
const restartElem = document.getElementById('restartButton');
const stopAnimationElem = document.getElementById('stopAnimationButton');
const startAnimationElem = document.getElementById('startAnimationButton');
const ruleElem = document.getElementById('ruleToolHover');

// get elements from HTML for items that will be used during the sam
currentPlayerElement = document.getElementById("currentPlayerPoints"); //Current player points
currentCpuElement = document.getElementById("currentCpuPoints"); // Current CPU points
playerScoreElement = document.getElementById("playerPoints"); // Total player points
cpuScoreElement = document.getElementById("cpuPoints"); // Total cpu points
playerGameResultElement = document.getElementById("playerGameResult"); // Result of winner
cpuGameResultElement = document.getElementById("cpuGameResult"); // Result of winner
diceImgElem = document.getElementById("diceImg"); // Dice images
projectTitleElem = document.getElementById("projectTitle"); // Project Title

let playCount = 1;
let playerScore = 0;
let cpuScore = 0;
let timeoutID;
let animationFrameHandler;

// Dice constructor that will be used to create the dice, this was constructed from assignment #5
class Dice{
    constructor(){
        this.value = [1,2,3,4,5,6];
    }
    describeSelf(){
        let returnString = `<p>${this.value}`;
        return returnString;
    }
}

// Title for game
projectTitleElem.innerHTML = `DICE ROLL CHALLENGE`;

// This is a prototype to shuffle the variables of the dice. This one shuffles 1-6
// However we really only need to shuffle a single element of the dice array.
Dice.prototype.shuffle = function(){ 
    let j, x, i;
    //loop through the entire array
    for (i = this.value.length - 1; i > 0; i--) {
        // Math.random to generate a random value for dice between 1-6
        j = Math.floor(Math.random() * (i + 1));
        x = this.value[i];
        //resort dice
        this.value[i] = this.value[j];
        this.value[j] = x;
    }
    //return the randomly sorted array of dice numbers
    return this.value;       
}

// Construct a dice 1
const dice01 = new Dice();
dice01.shuffle();

// Construct a dice 2
const dice02 = new Dice();
dice02.shuffle();

// Construct dice value holder for player and cpu
const playerDice = new Dice();
const cpuDice = new Dice();

// All scores in game start @ 0
let totalScore = 0;

// Start the dice animation by default on page load
animationFrameHandler = requestAnimationFrame(frameUp);

// Disable the start button from being clicked while animation is already running
startAnimationElem.disabled = true;
$('#startAnimationButton').css({"background-color": "#bbbbbb"}); // some css feedback for disabled button

// Dice prototype to simulate the rolling of 2x dice (dice01 and dice02). The comparison logic is located in this protoype.
Dice.prototype.roll = function(){
    if(dice01.value[0] == 1 || dice02.value[0] == 1){ // If either of the dice roll '1', total score = 0
        totalScore = 0;
        console.log(`scored 1 = 0, dice 1 = ${dice01.value[0]}, dice 2 = ${dice02.value[0]}`);
        // If both dice roll same number and its not 1, then sum the dice and multiply by 2x
    } else if(dice01.value[0] == dice02.value[0] && dice01.value[0] !== 1 && dice02.value[0] !== 1) {
        totalScore = (dice01.value[0]+dice02.value[0])*2;
        console.log(`dice1 == dice2, total score = ${totalScore}`);
    } else {
        totalScore = dice01.value[0] + dice02.value[0]; // Else add the numbers together normally
        console.log(dice01.value[0])
        console.log(dice02.value[0])
        console.log(`${totalScore}`);
    }
    return totalScore;
}

// This is an event listener the user will click to enable the dice shuffle, provide html feedback of score, images etc.
startElem.addEventListener(`click`, function() {
    dice01.shuffle(); // Shuffle the dice 1 & 2
    dice02.shuffle();
    currentPlayerElement.innerHTML += `Round:${playCount}<br><img src=${pathToImages}dice_${dice01.value[0]}.png alt=DiceValue${dice01.value[0]}></img>`;
    currentPlayerElement.innerHTML += `<img src=${pathToImages}dice_${dice02.value[0]}.png alt=DiceValue${dice02.value[0]}></img><br>`;
    playerScore += playerDice.roll(); // The current player score sum added after the roll function is invoked
    console.log(`Player Score Total:${playerScore}`); // Console feedback for player score
    dice01.shuffle(); // Shuffle the dice 1 & 2 before the CPU roll
    dice02.shuffle();
    currentCpuElement.innerHTML += `Round:${playCount}<br><img src=${pathToImages}dice_${dice01.value[0]}.png alt=CPUDiceValue${dice01.value[0]}></img>`;
    currentCpuElement.innerHTML += `<img src=${pathToImages}dice_${dice02.value[0]}.png alt=CPUDiceValue${dice02.value[0]}></img><br>`;
    cpuScore += cpuDice.roll(); // The current CPU score sum after the roll function is invoked
    console.log(`Cpu Score Total: ${cpuScore}`);
    playerScoreElement.innerHTML = `Player Score: ${playerScore}`; // Total player score
    cpuScoreElement.innerHTML = `CPU Score: ${cpuScore}`; // Total cpu score so far
    playCount++; // Increment the play count since game ends after 3 rolls
    // if statement to stop the game and call out the winner after 3 rounds
    if(playCount > 3) {
        console.log(`End of Game 3 play limit met`);
        startElem.disabled = true; // Stop the user from double painting from the start button
        $('#startButton').css({ "background-color": "#bbbbbb"}); // Some CSS feedback for the botton
        if (playerScore > cpuScore) {
            playerGameResultElement.innerHTML = `Player Win`;
        } else if (playerScore == cpuScore) {
            playerGameResultElement.innerHTML = `Tie game! Play again`;
            cpuGameResultElement.innerHTML = `Tie game! Play again`;
        } else {
            cpuGameResultElement.innerHTML = `CPU Win`;
        }
    }
})

// This is an event listener for the reset button. It re-enables the start button and clears HTML content to start new slate
restartElem.addEventListener(`click`,function() {
    playCount = 1; // reset play counter
    startElem.disabled = false; // re-enable the start button
    $('#startButton').css({"background-color": "#5f8190"}); // Start button color feedback
    currentPlayerElement.innerHTML = ''; // clear the html content
    currentCpuElement.innerHTML = '';
    playerScoreElement.innerHTML = '';
    cpuScoreElement.innerHTML = '';
    playerScore = 0; // reset player score
    cpuScore = 0; // reset cpu score
    playerGameResultElement.innerHTML = ''; // reset game result
    cpuGameResultElement.innerHTML = ''; // reset game result
})

// This is an event listener that stops the default dice animation from incrementing frames
stopAnimationElem.addEventListener(`click`,function() {
    cancelAnimationFrame(animationFrameHandler);
    clearTimeout(timeoutID);
    startAnimationElem.disabled = false; // Disable the start animation button to prevent double painting
    $('#stopAnimationButton').css({"background-color": "#bbbbbb"});
    $('#startAnimationButton').css({"background-color": "#5f8190"});
})

// This is an event listener that starts the animation after the user has clicked 'stop animation'
startAnimationElem.addEventListener(`click`, function() {
    animationFrameHandler = requestAnimationFrame(frameUp);
    startAnimationElem.disabled = true;
    $('#startAnimationButton').css({"background-color": "#bbbbbb"}); // Color feedback for disabled buttons
    $('#stopAnimationButton').css({"background-color": "#5f8190"});
})

// this is a function put together during assignment05 for incrementing frames and providing image feedback from /images/ for dice
counter = 0; // Start counter @ 0
function frameUp() {
    counter++;
    if (counter > 6){ // 6 counters for 6 dice and 6 images of dice to roll frames through
        counter = 1;
    }
    timeoutID = setTimeout(function(){
        $("#defaultImage").attr("src",`./images/dice-images/dice_${counter}.png`);
        $("#defaultImage2").attr("src",`./images/dice-images/dice_${counter}.png`);
        animationFrameHandler = requestAnimationFrame(frameUp)
    }, 300); // 300ms delay between the dice frames
}

const buttonIdElem = document.getElementById("ruleToolButton");
const hoverIdElem = document.getElementById("ruleToolHover");

let isClicked = 0;
buttonIdElem.addEventListener("click", function(e){
    if (isClicked == 0) {
        hoverIdElem.style.display = "block";
        isClicked = 1;
    } else {
        hoverIdElem.style.display = "none";
        isClicked = 0;
    }
});

// THIS PORTION IS SOME LONG BOX OF TEXT FOR HOW TO PLAY THE GAME
// IF THERE IS A BETTER WAY OF ADDING TEXT TO HTML PLEAST LET ME KNOW THANKS!
ruleElem.innerHTML = `Instructions and Rules: <br><br> <strong>Instructions:</strong><br>Press 'Start' to roll (2) dice for yourself and the CPU
<br><br> Press 'Restart' to restart the game at any point
<br><br> 'Stop Animation' & 'Start Animation' are just buttons to start/stop the frame animation sequence.
<br><br><strong>Rules:</strong><br>
1- If any of the 2 dice rolled is a '1' then your score is automatically 0 for that round.<br><br>
2- If both of your rolled dice result in the same number and is not '1' then you will have the sum of the value multiplied by 2x<br><br>
3- After 3 rounds the score is added up and the winner is presented.<br><br>
NOW TEST YOUR LUCK AGAINST THE COMPUTER RANDOM NUMBER GENERATOR <br><br>
Author: Christopher Wong | A00847417`;