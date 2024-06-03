// set constants
const FPS = 60; // framerate
const PAC_SIZE = 30; // pacman radius px
const GHOST_NUM = 3; // starting number of ghosts
const GHOST_SIZE = 30; // ghost radius px
const GAME_LIVES = 3; // start no lives
const SHOW_BOUNDING = false; // show collision
const TEXT_FADE = 2.5; // text fade time / s
const TEXT_SIZE = 40; // text font-size / px
const POINTS_LEMON = 20; // points for collecting lemon
const POINTS_CHERRY = 50; // points for collecting cherry
const POINTS_GHOST = 100; // points for destroying ghost
const SAVE_KEY_SCORE = "highscore"; // save key for local storage of high score

/** @type {HTMLCanvasElement} */
var canv = document.getElementById("gameCanvas");
var ctx = canv.getContext("2d");

// set up game parameters
var level, ghosts, pacman, text, textAlpha, lives, score, scoreHigh;
newGame();

// event handler
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// game loop
setInterval(update, 1000 / FPS);

function distBetweenPoints(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function newGame() {
	score = 0;
	lives = GAME_LIVES;

	// get high score from local
	var scoreStr = localStorage.getItem(SAVE_KEY_SCORE);
	if (scoreStr == null) {
		scoreHigh = 0;
	} else {
		scoreHigh = parseInt(scoreStr);
	}
}

// draw game text
if (textAlpha >= 0) {
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "rgba(255, 255, 255, " + textAlpha + ")";
	ctx.font = "small-caps " + TEXT_SIZE + "px dejavu sans mono";
	ctx.fillText(text, canv.width / 2, canv.height * 0.75);
	textAlpha -= 1.0 / TEXT_FADE / FPS;
}

// draw score
ctx.textAlign = "right";
ctx.textBaseline = "middle";
ctx.fillStyle = "white";
ctx.font = TEXT_SIZE + "px dejavu sans mono";
ctx.fillText(score, canv.width - PAC_SIZE / 2, PAC_SIZE);

// draw high score
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillStyle = "white";
ctx.font = TEXT_SIZE * 0.75 + "px dejavu sans mono";
ctx.fillText("BEST: " + scoreHigh, canv.width / 2, PAC_SIZE);
