var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var img = document.getElementById('can');
var img2 = document.getElementById('leaf');
var img3 = document.getElementById('biker');
var background = document.getElementById('background')
var score = document.getElementById('score');
var start = document.getElementById('startButton');

//Arrow keys defined with false values to start
var rightPressed = false;
var leftPressed = false;

//Biker position
var bikerX = -500;
var bikerY = 450;
var bikerMotionX = 5;

//Trash can dimensions
const canHeight = 70;
const canWidth = 50;

//Leaf Dimensions
const leafHeight = 50;
const leafWidth = 20;

//canX starting place of the can in the middle of the x axis
var canX = (canvas.width - canWidth) / 2;
//canY = starting place of the can at the bottom of the canvas
var canY = canvas.height - canHeight;

//leafX and leafY determine starting point of the leaf on the canvas. In this case top left (0,0)
var leafX = 350;
var leafY = 0;

//leafMotionY's value is used to deterimne the speed at which the leaf falls
var leafMotionY = 10;
var leafMotionX = 25;

var score = document.getElementById('score');
var number = score.innerHTML;
var myScore = 0;

var canSpeed = 25;
window.onload = function () {
    //General must haves for canvas interaction
    canvas = document.getElementById('myCanvas');
    canvasContext = canvas.getContext('2d');

    //Listening for arrow key's to be pressed
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
};

function startGame() {
    //FPS
    var framesPerSecond = 30;
    var interval = setInterval(updateAll, 1000 / framesPerSecond);
}

//Controled by setInterval() on load for how often it is called per second
function updateAll() {
    draw();
    moveAll();
    detection();
    updateScoreToScreen();
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height); // clear canvas redraw
    context.drawImage(img, canX, canY);
    context.drawImage(img2, leafX, leafY);
    context.drawImage(img3, bikerX, bikerY)

}

// function stopInterval() {
//     clearInterval(interval)
// }

function moveAll() {
    leafY += leafMotionY;

    leafX += leafMotionX;

    bikerX += bikerMotionX;

    //biker repeat code
    if (bikerX > canvas.width + 500) {
        bikerX = -500
    }

    //arrow key functionality and limitations of can movement within the canvas
    if (rightPressed) {
        canX += canSpeed;

        if (canX + canWidth >= canvas.width) {
            canX = canvas.width - canWidth;
        }
    } else if (leftPressed) {
        canX -= canSpeed;
        if (canX < 0) {
            canX = 0;
        }
    }

    //keep leaf in on left and right side to allow for random x motion
    if (leafX > canvas.width || leafX < 0) {
        leafMotionX *= -1
        // leafX = 0 has them come out the other side of the canvas maybe use for something

    }


}

function detection() {
    //can detection with leaf
    if (leafX < canX + canWidth && leafX + leafWidth > canX &&
        leafY < canY + canHeight && leafY + leafHeight > canY) {
        leafX = Math.floor(Math.random() * 800) + 1;
        leafY = 0;
        scoreUp();
        updateScoreToScreen();
        sound.play();
    }

    if (leafY >= canvas.height) {
        // alert(`GAME OVER,\nScore:${myScore}`)
        sound3.play()
        clearInterval(interval); //Needed for chrome to end game

        // document.location.reload();
    }
}

function leafReset() {
    if (leafY >= 800) {
        leafX = randomInt(15, 785)
        leafY = 0;
        scoreDown();
        updateScoreToScreen();
    }
}

//Scoring Functions
function updateScoreToScreen() {
    score.innerHTML = myScore
}

function scoreUp() {
    // canSpeed++
    myScore++
    leafMotionY++
}

function scoreDown() {
    leafMotionY++
    sound3.play();
}

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min);
}

//right left are for IE support
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") {
        leftPressed = false;
    }
}