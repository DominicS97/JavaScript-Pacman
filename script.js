// set constants
const FPS = 60; // framerate
const FUDGE = 0; // collision fudger px
const KNOCK = 1; // collision knockback px
const PAC_SIZE = 16; // pacman radius px
const PAC_SPD = 150; // pacman speed modifier
const GLOBAL_SPD = 1; // global speed modifier
const WAKKA_SPD = 1.6; // wakka speed (lower = faster)
const GHOST_NUM = 3; // starting number of ghosts
const GHOST_SIZE = 30; // ghost radius px
const WALL_WIDTH = 16; // wall width px
const GAME_LIVES = 3; // start no lives
const SHOW_BOUNDING = false; // show collision
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
		this.dir = dir; // true = vertical, false = horizontal
	}
}

var level,
	ghosts = [],
	pacman,
	startx = canv.width / 2,
	starty = canv.height / 2 + 60,
	lives,
	walls = [],
	nodes = [],
	text,
	text2,
	textAlpha,
	lives,
	score,
	scoreHigh,
	keyDown,
	keyUp,
	wakka = Math.PI / 4,
	wakkaDir = 0;

pacman = {
	x: startx,
	y: starty,
	a: 0,
	isInvuln: false,
	isDead: false,
	xv: 0,
	yv: 0,
};
newGame();

// event handler
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(/** @type {KeyboardEvent} */ ev) {
	switch (ev.keyCode) {
		case 32: // space || reset
			if (pacman.isDead) {
				newGame();
			}
			break;
		case 37: // left arrow
			if (!pacman.isDead) {
				pacman.a = Math.PI;
				pacman.xv = -PAC_SPD * GLOBAL_SPD;
				pacman.yv = 0;
			}
			break;
		case 38: // up arrow
			if (!pacman.isDead) {
				pacman.a = (3 * Math.PI) / 2;
				pacman.yv = -PAC_SPD * GLOBAL_SPD;
				pacman.xv = 0;
				break;
			}
		case 39: // right arrow
			if (!pacman.isDead) {
				pacman.a = 0;
				pacman.xv = PAC_SPD * GLOBAL_SPD;
				pacman.yv = 0;
				break;
			}
		case 40: // down arrow
			if (!pacman.isDead) {
				pacman.a = Math.PI / 2;
				pacman.yv = PAC_SPD * GLOBAL_SPD;
				pacman.xv = 0;
				break;
			}
	}
}

// game loop
setInterval(update, 1000 / FPS);

function distBetweenPoints(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// total width of passage = 38px // true = vertical, false = horizontal
function createLevel() {
	const wall1 = new Wall(
		canv.width / 2 - 80,
		canv.height / 2 - 0.5,
		81,
		true
	);
	const wall2 = new Wall(canv.width / 2, canv.height / 2 + 32, 160, false);
	const wall3 = new Wall(
		canv.width / 2 + 80,
		canv.height / 2 - 0.5,
		81,
		true
	);
	const wall4 = new Wall(canv.width / 2, canv.height / 2 - 33, 160, false);
	const wall5 = new Wall(canv.width / 2, canv.height / 2 + 86, 176, false);
	const wall6 = new Wall(
		canv.width / 2 - 134,
		canv.height / 2 + 58,
		72,
		true
	);
	const wall7 = new Wall(
		canv.width / 2 - 188,
		canv.height / 2 + 58,
		72,
		true
	);
	const wall8 = new Wall(
		canv.width / 2 - 246,
		canv.height / 2 + 30,
		100,
		false
	);
	const wall9 = new Wall(
		canv.width / 2 - 246,
		canv.height / 2 - 24,
		100,
		false
	);
	const wall10 = new Wall(
		canv.width / 2 - 246,
		canv.height / 2 + 86,
		100,
		false
	);
	const wall11 = new Wall(canv.width / 2, canv.height / 2 + 116, 64, true);
	const wall12 = new Wall(
		canv.width / 2 - 188,
		canv.height / 2 + 167,
		70,
		true
	);
	const wall13 = new Wall(
		canv.width / 2 - 94,
		canv.height / 2 + 140,
		96,
		false
	);
	const wall14 = new Wall(
		canv.width / 2 - 215,
		canv.height / 2 + 140,
		54,
		false
	);
	const wall15 = new Wall(
		canv.width / 2 - 265,
		canv.height / 2 + 194,
		62,
		false
	);
	const wall16 = new Wall(
		canv.width / 2 - 134,
		canv.height / 2 + 221,
		68,
		true
	);
	const wall17 = new Wall(
		canv.width / 2 - 144,
		canv.height / 2 + 248,
		196,
		false
	);
	const wall18 = new Wall(canv.width / 2, canv.height / 2 + 302, 592, false);
	const wall19 = new Wall(
		canv.width / 2 - 288,
		canv.height / 2 + 194,
		200,
		true
	);
	const wall20 = new Wall(
		canv.width / 2 + 288,
		canv.height / 2 + 194,
		200,
		true
	);
	const wall21 = new Wall(
		canv.width / 2 + 246,
		canv.height / 2 + 30,
		100,
		false
	);
	const wall22 = new Wall(
		canv.width / 2 + 246,
		canv.height / 2 - 24,
		100,
		false
	);
	const wall23 = new Wall(
		canv.width / 2 + 246,
		canv.height / 2 + 86,
		100,
		false
	);
	const wall24 = new Wall(
		canv.width / 2 + 134,
		canv.height / 2 + 58,
		72,
		true
	);
	const wall25 = new Wall(
		canv.width / 2 + 188,
		canv.height / 2 + 58,
		72,
		true
	);
	const wall26 = new Wall(
		canv.width / 2 + 188,
		canv.height / 2 + 167,
		70,
		true
	);
	const wall27 = new Wall(
		canv.width / 2 + 94,
		canv.height / 2 + 140,
		96,
		false
	);
	const wall28 = new Wall(
		canv.width / 2 + 215,
		canv.height / 2 + 140,
		54,
		false
	);
	const wall29 = new Wall(
		canv.width / 2 + 265,
		canv.height / 2 + 194,
		62,
		false
	);
	const wall30 = new Wall(
		canv.width / 2 + 134,
		canv.height / 2 + 221,
		68,
		true
	);
	const wall31 = new Wall(
		canv.width / 2 + 144,
		canv.height / 2 + 248,
		196,
		false
	);
	const wall32 = new Wall(canv.width / 2, canv.height / 2 + 195, 176, false);
	const wall33 = new Wall(canv.width / 2, canv.height / 2 + 224, 64, true);
	const wall34 = new Wall(
		canv.width / 2 - 188,
		canv.height / 2 - 55.5,
		79,
		true
	);
	const wall35 = new Wall(
		canv.width / 2 - 246,
		canv.height / 2 - 87,
		100,
		false
	);
	const wall36 = new Wall(
		canv.width / 2 - 134,
		canv.height / 2 - 82.5,
		133,
		true
	);
	const wall37 = new Wall(
		canv.width / 2 - 94,
		canv.height / 2 - 87,
		96,
		false
	);
	const wall38 = new Wall(
		canv.width / 2 - 211,
		canv.height / 2 - 141,
		62,
		false
	);
	const wall39 = new Wall(
		canv.width / 2 - 211,
		canv.height / 2 - 211,
		62,
		false
	);
	const wall40 = new Wall(
		canv.width / 2 - 211,
		canv.height / 2 - 195,
		62,
		false
	);
	const wall41 = new Wall(
		canv.width / 2 - 288,
		canv.height / 2 - 172,
		186,
		true
	);
	const wall42 = new Wall(
		canv.width / 2 - 94,
		canv.height / 2 - 211,
		96,
		false
	);
	const wall43 = new Wall(
		canv.width / 2 - 94,
		canv.height / 2 - 195,
		96,
		false
	);
	const wall44 = new Wall(
		canv.width / 2 + 188,
		canv.height / 2 - 55.5,
		79,
		true
	);
	const wall45 = new Wall(
		canv.width / 2 + 246,
		canv.height / 2 - 87,
		100,
		false
	);
	const wall46 = new Wall(
		canv.width / 2 + 134,
		canv.height / 2 - 82.5,
		133,
		true
	);
	const wall47 = new Wall(
		canv.width / 2 + 94,
		canv.height / 2 - 87,
		96,
		false
	);
	const wall48 = new Wall(
		canv.width / 2 + 211,
		canv.height / 2 - 141,
		62,
		false
	);
	const wall49 = new Wall(
		canv.width / 2 + 211,
		canv.height / 2 - 211,
		62,
		false
	);
	const wall50 = new Wall(
		canv.width / 2 + 211,
		canv.height / 2 - 195,
		62,
		false
	);
	const wall51 = new Wall(
		canv.width / 2 + 288,
		canv.height / 2 - 172,
		186,
		true
	);
	const wall52 = new Wall(
		canv.width / 2 + 94,
		canv.height / 2 - 211,
		96,
		false
	);
	const wall53 = new Wall(
		canv.width / 2 + 94,
		canv.height / 2 - 195,
		96,
		false
	);
	const wall54 = new Wall(canv.width / 2, canv.height / 2 - 141, 176, false);
	const wall55 = new Wall(canv.width / 2, canv.height / 2 - 111.5, 65, true);
	const wall56 = new Wall(canv.width / 2, canv.height / 2 - 227, 80, true);
	const wall57 = new Wall(canv.width / 2, canv.height / 2 - 265, 592, false);
	walls.push(
		wall1,
		wall2,
		wall3,
		wall4,
		wall5,
		wall6,
		wall7,
		wall8,
		wall9,
		wall10,
		wall11,
		wall12,
		wall13,
		wall14,
		wall15,
		wall16,
		wall17,
		wall18,
		wall19,
		wall20,
		wall21,
		wall22,
		wall23,
		wall24,
		wall25,
		wall26,
		wall27,
		wall28,
		wall29,
		wall30,
		wall31,
		wall32,
		wall33,
		wall34,
		wall35,
		wall36,
		wall37,
		wall38,
		wall39,
		wall40,
		wall41,
		wall42,
		wall43,
		wall44,
		wall45,
		wall46,
		wall47,
		wall48,
		wall49,
		wall50,
		wall51,
		wall52,
		wall53,
		wall54,
		wall55,
		wall56,
		wall57
	);
	const ghost1 = {
		x: canv.width / 2,
		y: canv.height / 2 - 60,
		xv: 0,
		yv: 0,
		color: "red",
	};
	const ghost2 = {
		x: canv.width / 2 - 161,
		y: canv.height / 2 - 238,
		xv: 0,
		yv: 0,
		color: "orange",
	};
	const ghost3 = {
		x: canv.width / 2 + 161,
		y: canv.height / 2 - 238,
		xv: 0,
		yv: 0,
		color: "green",
	};
	ghosts.push(ghost1, ghost2, ghost3);
	nodes.push(
		{
			x: canv.width / 2 - 107,
			y: canv.height / 2 + 59,
			connections: [1, 3],
		},
		{
			x: canv.width / 2 + 107,
			y: canv.height / 2 + 59,
			connections: [0, 2],
		},
		{
			x: canv.width / 2 + 107,
			y: canv.height / 2 - 60,
			connections: [1, 3],
		},
		{
			x: canv.width / 2 - 107,
			y: canv.height / 2 - 60,
			connections: [0, 2],
		}
	);
}

function newGame() {
	score = 0;
	lives = GAME_LIVES;
	text = "";
	text2 = "";
	pacman.a = 0;
	pacman.x = startx;
	pacman.y = starty;
	pacman.xv = 0;
	pacman.yv = 0;
	pacman.isDead = false;
	pacman.isInvuln = false;
	createLevel();

	// get high score from local
	var scoreStr = localStorage.getItem(SAVE_KEY_SCORE);
	if (scoreStr == null) {
		scoreHigh = 0;
	} else {
		scoreHigh = parseInt(scoreStr);
	}
}

function killPacman() {
	lives--;
	if (lives === 0) {
		text = "GAME OVER";
		text2 = "SPACE TO RESET";
		pacman.isDead = true;
	}
}

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
		// set variables for convenience
		const uppery = pacman.y - PAC_SIZE;
		const lowery = pacman.y + PAC_SIZE;
		const rightx = pacman.x + PAC_SIZE;
		const leftx = pacman.x - PAC_SIZE;
		var walluppery, walllowery, wallrightx, wallleftx;
		// loop over every wall
		for (let i = 0; i < walls.length; i++) {
			let wall = walls[i];
			// generalise for both wall types
			if (wall.dir) {
				walluppery = wall.y - wall.dim / 2;
				walllowery = wall.y + wall.dim / 2;
				wallrightx = wall.x + WALL_WIDTH / 2;
				wallleftx = wall.x - WALL_WIDTH / 2;
			} else {
				walluppery = wall.y - WALL_WIDTH / 2;
				walllowery = wall.y + WALL_WIDTH / 2;
				wallrightx = wall.x + wall.dim / 2;
				wallleftx = wall.x - wall.dim / 2;
			}
			// quadrants for  knockback dir
			let m1 = (walllowery - walluppery) / (wallrightx - wallleftx);
			let c1 = walluppery - wallleftx * m1;
			let x1 = (pacman.y - c1) / m1;
			let m2 = (walluppery - walllowery) / (wallrightx - wallleftx);
			let c2 = walllowery - wallleftx * m2;
			let x2 = (pacman.y - c2) / m2;
			// check if vertical face falls within range
			if (walllowery + FUDGE >= uppery && walluppery - FUDGE <= lowery) {
				// check if horizontal face falls within range
				if (
					wallleftx + FUDGE <= rightx &&
					wallrightx + FUDGE >= leftx
				) {
					// determine knockback dir
					if (pacman.x > x1 && pacman.x > x2) {
						pacman.x += KNOCK;
					} else if (pacman.x > x1 && pacman.x < x2) {
						pacman.y -= KNOCK;
					} else if (pacman.x < x1 && pacman.x > x2) {
						pacman.y += KNOCK;
					} else {
						pacman.x -= KNOCK;
					}
					pacman.xv = 0;
					pacman.yv = 0;
					break;
				}
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

	// ghost collision
	for (let i = 0; i < ghosts.length; i++) {
		// set variables for convenience
		const uppery = pacman.y - PAC_SIZE;
		const lowery = pacman.y + PAC_SIZE;
		const rightx = pacman.x + PAC_SIZE;
		const leftx = pacman.x - PAC_SIZE;
		let ghost = ghosts[i];
		// check if vertical falls within range
		if (
			ghost.y + PAC_SIZE + FUDGE >= uppery &&
			ghost.y - PAC_SIZE - FUDGE <= lowery
		) {
			// check if horizontal falls within range
			if (
				ghost.x - PAC_SIZE - FUDGE <= rightx &&
				ghost.x + PAC_SIZE + FUDGE >= leftx
			) {
				pacman.x = startx;
				pacman.y = starty;
				pacman.xv = 0;
				pacman.yv = 0;
				killPacman();
			}
		}
	}

	// draw pacman
	if (!pacman.isDead) {
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
	}

	// draw ghosts
	for (let i = 0; i < ghosts.length; i++) {
		let x = ghosts[i].x;
		let y = ghosts[i].y;
		let color = ghosts[i].color;

		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, PAC_SIZE, Math.PI, Math.PI * 2);
		ctx.fill();
		ctx.moveTo(x - PAC_SIZE, y);
		ctx.lineTo(x - PAC_SIZE, y + PAC_SIZE);
		ctx.lineTo(x - PAC_SIZE / 2, y + PAC_SIZE / 3);
		ctx.lineTo(x, y + PAC_SIZE);
		ctx.lineTo(x + PAC_SIZE / 2, y + PAC_SIZE / 3);
		ctx.lineTo(x + PAC_SIZE, y + PAC_SIZE);
		ctx.lineTo(x + PAC_SIZE, y);
		ctx.fill();
	}

	// draw nodes
	for (let i = 0; i < nodes.length; i++) {
		let x = nodes[i].x;
		let y = nodes[i].y;
		let connections = nodes[i].connections;
		ctx.fillStyle = "pink";
		ctx.beginPath();
		ctx.arc(x, y, PAC_SIZE / 4, 0, Math.PI * 2);
		ctx.fill();
		for (let j = 0; j < connections.length; j++) {
			let index = connections[j];
			if (index > i) {
				let x2 = nodes[index].x;
				let y2 = nodes[index].y;
				ctx.strokeStyle = "pink";
				ctx.moveTo(x, y);
				ctx.lineTo(x2, y2);
				ctx.stroke();
			}
		}
	}

	// draw walls
	for (let i = 0; i < walls.length; i++) {
		let wall = walls[i];
		ctx.fillStyle = "blue";
		if (wall.dir) {
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
	if (text) {
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "white";
		ctx.font = "small-caps " + TEXT_SIZE + "px dejavu sans mono";
		ctx.fillText(text, canv.width / 2, canv.height * 0.75);
		ctx.fillText(text2, canv.width / 2, canv.height * 0.75 + TEXT_SIZE);
	}

	// draw score
	ctx.textAlign = "right";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "white";
	ctx.font = TEXT_SIZE + "px dejavu sans mono";
	ctx.fillText(score, canv.width - PAC_SIZE / 2, 1.5 * PAC_SIZE);

	// draw high score
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "white";
	ctx.font = TEXT_SIZE * 0.75 + "px dejavu sans mono";
	ctx.fillText("BEST: " + scoreHigh, canv.width / 2, 1.5 * PAC_SIZE);

	// draw lives
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "white";
	ctx.font = TEXT_SIZE * 0.75 + "px dejavu sans mono";
	ctx.fillText("LIVES: " + lives, PAC_SIZE, 1.5 * PAC_SIZE);
}
