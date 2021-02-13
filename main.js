// DATABASE STUFF
const database = firebase.database();
const scoreRef = database.ref('scores')
const scoreRefOrdered = database.ref('scores').orderByChild('score').limitToLast(5);
const scoreRefRecent = database.ref('scores').limitToLast(5);

scoreRefOrdered.on('value', (snapshot) => {
    const scores = []
    snapshot.forEach(d => {
        scores.unshift(d.val())
    })
    updateScores(scores)
})
scoreRefRecent.on('value', (snapshot) => {
    const scores = []
    snapshot.forEach(d => {
        scores.unshift(d.val())
    })
    updateRecentScores(scores)
})

const updateScores = (scores) => {
    while (scoreList.firstChild) {
        scoreList.removeChild(scoreList.firstChild);
    }
    scores.forEach(s => {
        var li = document.createElement('li');
        li.classList.add('pl-5', 'mx-auto', 'font-semibold')
        li.innerText = `${s.name}: ${s.score}`
        scoreList.appendChild(li)
    })
}

const updateRecentScores = (scores) => {
    const recentScoreList = document.querySelector("#recentScoreList")
    while (recentScoreList.firstChild) {
        recentScoreList.removeChild(recentScoreList.firstChild);
    }
    scores.forEach(s => {
        var li = document.createElement('li');
        li.classList.add('pl-5', 'mx-auto', 'font-semibold')
        li.innerText = `${s.name}: ${s.score}`
        recentScoreList.appendChild(li)
    })
}


// function gotData(data) {
//     var dataEntry = data.val();
//     var keys = Object.keys(dataEntry);

//     for (var i = 0; i < keys.length; i++) {
//         var k = keys[i];
//         var name = dataEntry[k].name;
//         var score = dataEntry[k].score;
//         var li = document.createElement('li');
//         li.classList.add('pl-5', 'mx-auto')
//         li.innerText = `${name}: ${score}`
//         scoreList.appendChild(li)
//     }
// }

// function getTopScores() {
//     scoreRef.orderBy('score').limit(5);

// }

function errData(err) {
    console.log('Error!');
    console.log(err);
}
var data = {
    name: '',
    score: 0
}
// END OF DATABASE STUFF

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var img = document.getElementById('can');
var img2 = document.getElementById('leaf');
var img3 = document.getElementById('biker');
var background = document.getElementById('background')
var score = document.getElementById('score');
var start = document.getElementById('startButton');

//howler sounds
var sound = new Howl({
    src: ['./game-sounds/dink-short.mp3']
});

var sound2 = new Howl({
    src: ['./game-sounds/floating-01.mp3']
});

var sound3 = new Howl({
    src: ['./game-sounds/buzz.mp3']
});

var backgroundMusic = new Howl({
    src: ['./game-sounds/Leaf_Catcher_Theme_F_1.mp3']
});
//Arrow keys defined with false values to start
var rightPressed = false;
var leftPressed = false;

//Biker position
var bikerX = -500;
var bikerY = 450;
var bikerMotionX = 5;

//Trash can dimensions
const canHeight = 80;
const canWidth = 120;

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

var interval;

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
    interval = setInterval(updateAll, 1000 / framesPerSecond);
}

//Controled by setInterval() on load for how often it is called per second
function updateAll() {
    draw();
    detection();
    updateScoreToScreen();
    loser();
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height); // clear canvas redraw
    context.drawImage(img, canX, canY);
    context.drawImage(img2, leafX, leafY);
    context.drawImage(img3, bikerX, bikerY)

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

function loser() {
    if (leafY > canvas.height) {
        clearInterval(interval);
        leafY = 0;
        sound3.play();

        data.name = prompt('Enter Your Name')
        if (!data.name) {
            data.name = "anon"
        }
        data.score = myScore;
        scoreRef.push(data);
        reset();
    }
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

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min);
}

function leafReset() {
    if (leafY >= 800) {
        leafX = randomInt(15, 785)
        leafY = 0;
        scoreDown();
        updateScoreToScreen();
    }
}

function reset() {
    myScore = 0;
    backgroundMusic.stop();
    bikerX = -500;
    canX = (canvas.width - canWidth) / 2;
    leftPressed = false;
    rightPressed = false;
    leafMotionY = 10;
}