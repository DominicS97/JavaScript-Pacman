// set constants
const FPS = 60; // framerate
const PAC_SIZE = 16; // pacman radius px
const PAC_SPD = 180; // pacman speed modifier
const GLOBAL_SPD = 1; // global speed modifier
const WAKKA_SPD = 1.6; // wakka speed (lower = faster)
const GHOST_NUM = 3; // starting number of ghosts
const GHOST_SIZE = 30; // ghost radius px
const WALL_WIDTH = 16; // wall width px
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
class Wall {
	constructor(x, y, dim, dir) {
		this.x = x;
		this.y = y;
		this.dim = dim; // long dimension
		this.dir = dir; // 1 = vertical, 0 = horizontal
	}
}

var level,
	ghosts,
	pacman,
	walls = [],
	text,
	textAlpha,
	lives,
	score,
	scoreHigh,
	keyDown,
	keyUp,
	wakka = Math.PI / 4,
	wakkaDir = 0;
newGame();

// event handler
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(/** @type {KeyboardEvent} */ ev) {
	switch (ev.keyCode) {
		case 32: // space || reset
			pacman.a = 0;
			pacman.x = canv.width / 2;
			pacman.y = canv.height / 2;
			pacman.xv = 0;
			pacman.yv = 0;
			break;
		case 37: // left arrow
			pacman.a = Math.PI;
			pacman.xv = -PAC_SPD * GLOBAL_SPD;
			pacman.yv = 0;
			break;
		case 38: // up arrow
			pacman.a = (3 * Math.PI) / 2;
			pacman.yv = -PAC_SPD * GLOBAL_SPD;
			pacman.xv = 0;
			break;
		case 39: // right arrow
			pacman.a = 0;
			pacman.xv = PAC_SPD * GLOBAL_SPD;
			pacman.yv = 0;
			break;
		case 40: // down arrow
			pacman.a = Math.PI / 2;
			pacman.yv = PAC_SPD * GLOBAL_SPD;
			pacman.xv = 0;
			break;
	}
}

// game loop
setInterval(update, 1000 / FPS);

function distBetweenPoints(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function createLevel() {
	const wall1 = new Wall(canv.width / 2 - 40, canv.height / 2, 60, 1);
	const wall2 = new Wall(canv.width / 2, canv.height / 2 + 40, 60, 0);
	walls.push(wall1, wall2);
}

function newGame() {
	score = 0;
	lives = GAME_LIVES;
	createLevel();

	// get high score from local
	var scoreStr = localStorage.getItem(SAVE_KEY_SCORE);
	if (scoreStr == null) {
		scoreHigh = 0;
	} else {
		scoreHigh = parseInt(scoreStr);
	}
}

pacman = {
	x: canv.width / 2,
	y: canv.height / 2,
	a: 0,
	isInvuln: false,
	xv: 0,
	yv: 0,
};

// draw game
function update() {
	// cycle wakka
	if (wakkaDir === 0 && wakka > 0) {
		wakka = wakka - Math.PI / (WAKKA_SPD * FPS);
	} else if (wakka <= 0) {
		wakka = wakka + Math.PI / (WAKKA_SPD * FPS);
		wakkaDir = 1;
	} else if (wakkaDir === 1 && wakka < Math.PI / 4) {
		wakka = wakka + Math.PI / (WAKKA_SPD * FPS);
	} else {
		wakka = wakka - Math.PI / (WAKKA_SPD * FPS);
		wakkaDir = 0;
	}

	// move pacman
	// collision
	function pacMover() {
		for (let i = 0; i < walls.length; i++) {
			let wall = walls[i];
			if (wall.dir === 1) {
				// test vertical wall
				if (
					wall.x + WALL_WIDTH / 2 >= pacman.x - PAC_SIZE &&
					wall.x - WALL_WIDTH / 2 <= pacman.x + PAC_SIZE
				) {
					// test x-axis
					pacman.xv = 0;
				}
				if (
					wall.y - wall.dim / 2 >= pacman.y - PAC_SIZE &&
					wall.y + wall.dim / 2 <= pacman.y + PAC_SIZE
				) {
					// text y-axis
					pacman.yv = 0;
				}
				break;
			} else {
				// test horizontal wall
				if (
					wall.x + wall.dim / 2 >= pacman.x - PAC_SIZE &&
					wall.x - wall.dim / 2 <= pacman.x + PAC_SIZE
				) {
					// test x-axis
					pacman.xv = 0;
				}
				if (
					wall.y - WALL_WIDTH / 2 >= pacman.y - PAC_SIZE &&
					wall.y + WALL_WIDTH / 2 <= pacman.y + PAC_SIZE
				) {
					// text y-axis
					pacman.yv = 0;
				}
				break;
			}
		}
		pacman.x += pacman.xv / FPS;
		pacman.y += pacman.yv / FPS;
	}
	pacMover();

	// handle edge of screen
	if (pacman.x <= 0) {
		pacman.x = canv.width;
	} else if (pacman.x >= canv.width) {
		pacman.x = 0;
	}
	if (pacman.y <= 0) {
		pacman.y = canv.height;
	} else if (pacman.y >= canv.height) {
		pacman.y = 0;
	}

	// draw background
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canv.width, canv.height);

	// draw pacman
	ctx.fillStyle = "yellow";
	ctx.beginPath();
	ctx.arc(
		pacman.x,
		pacman.y,
		PAC_SIZE,
		Math.PI / 2 + pacman.a,
		(3 * Math.PI) / 2 + pacman.a
	);
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(pacman.x, pacman.y);
	ctx.lineTo(pacman.x, pacman.y - Math.cos(pacman.a) * PAC_SIZE);
	ctx.arc(
		pacman.x,
		pacman.y,
		PAC_SIZE,
		(3 * Math.PI) / 2 + pacman.a,
		2 * Math.PI - wakka + pacman.a
	);
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(pacman.x, pacman.y);
	ctx.lineTo(pacman.x, pacman.y + Math.cos(pacman.a) * PAC_SIZE);
	ctx.arc(
		pacman.x,
		pacman.y,
		PAC_SIZE,
		Math.PI / 2 + pacman.a,
		wakka + pacman.a,
		true
	);
	ctx.fill();

	// draw walls
	for (let i = 0; i < walls.length; i++) {
		let wall = walls[i];
		ctx.fillStyle = "blue";
		if (wall.dir === 1) {
			ctx.beginPath();
			ctx.moveTo(wall.x - WALL_WIDTH / 2, wall.y + wall.dim / 2);
			ctx.lineTo(wall.x - WALL_WIDTH / 2, wall.y - wall.dim / 2);
			ctx.lineTo(wall.x + WALL_WIDTH / 2, wall.y - wall.dim / 2);
			ctx.lineTo(wall.x + WALL_WIDTH / 2, wall.y + wall.dim / 2);
			ctx.lineTo(wall.x - WALL_WIDTH / 2, wall.y + wall.dim / 2);
			ctx.fill();
		} else {
			ctx.beginPath();
			ctx.moveTo(wall.x - wall.dim / 2, wall.y + WALL_WIDTH / 2);
			ctx.lineTo(wall.x - wall.dim / 2, wall.y - WALL_WIDTH / 2);
			ctx.lineTo(wall.x + wall.dim / 2, wall.y - WALL_WIDTH / 2);
			ctx.lineTo(wall.x + wall.dim / 2, wall.y + WALL_WIDTH / 2);
			ctx.lineTo(wall.x - wall.dim / 2, wall.y + WALL_WIDTH / 2);
			ctx.fill();
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
}
