// set constants
const FPS = 60; // framerate
const FUDGE = 0; // collision fudger px
const KNOCK = 2; // collision knockback px
const ALLOW = 8; // collision allowance px
const PAC_SIZE = 16; // pacman radius px
const PAC_SPD = 150; // pacman speed modifier
const GLOBAL_SPD = 1; // global speed modifier
const WAKKA_SPD = 1.6; // wakka speed (lower = faster)
const GHOST_NUM = 3; // starting number of ghosts
const GHOST_SIZE = 16; // ghost radius px
const GHOST_SPD = 90; // ghost speed
const PEL_SIZE = 2.5; // pellet radius px
const PEL_DIST = 4; // pellet distance between px
const WALL_WIDTH = 16; // wall width px
const GAME_LIVES = 3; // starting number of lives
const TEXT_SIZE = 40; // text font-size / px
const POINTS_LEMON = 20; // points for collecting lemon
// const POINTS_CHERRY = 50; // points for collecting cherry unused
// const POINTS_GHOST = 100; // points for destroying ghost unused
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

var ghosts = [],
	pacman,
	startx = canv.width / 2,
	starty = canv.height / 2 + 60,
	walls = [],
	nodes = [],
	pellets = [],
	text,
	text2,
	lives,
	score,
	scoreHigh,
	keyDown,
	keyUp,
	wakka = Math.PI / 4,
	wakkaDir = 0,
	debug = false, // displays debug info
	started = false;

// initialise player character
pacman = {
	x: startx,
	y: starty,
	a: 0,
	isInvuln: false,
	isDead: false,
	xv: 0,
	yv: 0,
};

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
			}
			break;
		case 39: // right arrow
			if (!pacman.isDead) {
				pacman.a = 0;
				pacman.xv = PAC_SPD * GLOBAL_SPD;
				pacman.yv = 0;
			}
			break;
		case 40: // down arrow
			if (!pacman.isDead) {
				pacman.a = Math.PI / 2;
				pacman.yv = PAC_SPD * GLOBAL_SPD;
				pacman.xv = 0;
			}
			break;
	}
}

// game loop
setInterval(update, 1000 / FPS);

function distBetweenPoints(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// initialise level
function createLevel() {
	// build walls
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
	walls = [];
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
	// create ghosts
	const ghost1 = {
		x: canv.width / 2,
		y: canv.height / 2 + 275,
		xv: 0,
		yv: 0,
		color: "red",
	};
	const ghost2 = {
		x: canv.width / 2 - 235,
		y: canv.height / 2 + 275,
		xv: 0,
		yv: 0,
		color: "orange",
	};
	const ghost3 = {
		x: canv.width / 2 + 235,
		y: canv.height / 2 + 275,
		xv: 0,
		yv: 0,
		color: "green",
	};
	ghosts = [];
	ghosts.push(ghost1, ghost2, ghost3);
	// create nodes for pathfinding and pellets
	nodes = [];
	nodes.push(
		{
			// 0
			x: canv.width / 2 - 261,
			y: canv.height / 2 - 238,
			connections: [58, 61],
		},
		{
			// 1
			x: canv.width / 2 - 261,
			y: canv.height / 2 + 275,
			connections: [2, 29],
		},
		{
			// 2
			x: canv.width / 2 - 27,
			y: canv.height / 2 + 275,
			connections: [1, 3, 26],
		},
		{
			// 3
			x: canv.width / 2 + 27,
			y: canv.height / 2 + 275,
			connections: [2, 4, 15],
		},
		{
			// 4
			x: canv.width / 2 + 261,
			y: canv.height / 2 + 275,
			connections: [3, 5],
		},
		{
			// 5
			x: canv.width / 2 + 261,
			y: canv.height / 2 + 221,
			connections: [4, 6],
		},
		{
			// 6
			x: canv.width / 2 + 215,
			y: canv.height / 2 + 221,
			connections: [5, 7, 12],
		},
		{
			// 7
			x: canv.width / 2 + 215,
			y: canv.height / 2 + 167,
			connections: [6, 8],
		},
		{
			// 8
			x: canv.width / 2 + 261,
			y: canv.height / 2 + 167,
			connections: [7, 9],
		},
		{
			// 9
			x: canv.width / 2 + 261,
			y: canv.height / 2 + 113,
			connections: [8, 10],
		},
		{
			// 10
			x: canv.width / 2 + 161,
			y: canv.height / 2 + 113,
			connections: [9, 11, 18, 38],
		},
		{
			// 11
			x: canv.width / 2 + 161,
			y: canv.height / 2 + 167,
			connections: [10, 12, 13],
		},
		{
			// 12
			x: canv.width / 2 + 161,
			y: canv.height / 2 + 221,
			connections: [6, 11],
		},
		{
			// 13
			x: canv.width / 2 + 107,
			y: canv.height / 2 + 167,
			connections: [11, 14, 16],
		},
		{
			// 14
			x: canv.width / 2 + 107,
			y: canv.height / 2 + 221,
			connections: [13, 15],
		},
		{
			// 15
			x: canv.width / 2 + 27,
			y: canv.height / 2 + 221,
			connections: [3, 14],
		},
		{
			// 16
			x: canv.width / 2 + 27,
			y: canv.height / 2 + 167,
			connections: [13, 17, 19],
		},
		{
			// 17
			x: canv.width / 2 + 27,
			y: canv.height / 2 + 113,
			connections: [16, 18],
		},
		{
			// 18
			x: canv.width / 2 + 107,
			y: canv.height / 2 + 113,
			connections: [10, 17, 36],
		},
		{
			// 19
			x: canv.width / 2 - 27,
			y: canv.height / 2 + 167,
			connections: [16, 20, 24],
		},
		{
			// 20
			x: canv.width / 2 - 27,
			y: canv.height / 2 + 113,
			connections: [19, 21],
		},
		{
			// 21
			x: canv.width / 2 - 107,
			y: canv.height / 2 + 113,
			connections: [20, 22, 35],
		},
		{
			// 22
			x: canv.width / 2 - 161,
			y: canv.height / 2 + 113,
			connections: [21, 23, 32, 33],
		},
		{
			// 23
			x: canv.width / 2 - 161,
			y: canv.height / 2 + 167,
			connections: [22, 24, 27],
		},
		{
			// 24
			x: canv.width / 2 - 107,
			y: canv.height / 2 + 167,
			connections: [19, 23, 25],
		},
		{
			// 25
			x: canv.width / 2 - 107,
			y: canv.height / 2 + 221,
			connections: [24, 26],
		},
		{
			// 26
			x: canv.width / 2 - 27,
			y: canv.height / 2 + 221,
			connections: [2, 25],
		},
		{
			// 27
			x: canv.width / 2 - 161,
			y: canv.height / 2 + 221,
			connections: [23, 28],
		},
		{
			// 28
			x: canv.width / 2 - 215,
			y: canv.height / 2 + 221,
			connections: [27, 29, 30],
		},
		{
			// 29
			x: canv.width / 2 - 261,
			y: canv.height / 2 + 221,
			connections: [1, 28],
		},
		{
			// 30
			x: canv.width / 2 - 215,
			y: canv.height / 2 + 167,
			connections: [28, 31],
		},
		{
			// 31
			x: canv.width / 2 - 261,
			y: canv.height / 2 + 167,
			connections: [30, 32],
		},
		{
			// 32
			x: canv.width / 2 - 261,
			y: canv.height / 2 + 113,
			connections: [22, 31],
		},
		{
			// 33
			x: canv.width / 2 - 161,
			y: canv.height / 2 + 3,
			connections: [22, 34, 63],
		},
		{
			// 34
			x: canv.width / 2 - 107,
			y: canv.height / 2 + 3,
			connections: [33, 35, 42],
		},
		{
			// 35
			x: canv.width / 2 - 107,
			y: canv.height / 2 + 59,
			connections: [34, 36],
		},
		{
			// 36
			x: canv.width / 2 + 107,
			y: canv.height / 2 + 59,
			connections: [35, 37],
		},
		{
			// 37
			x: canv.width / 2 + 107,
			y: canv.height / 2 + 3,
			connections: [36, 38, 39],
		},
		{
			// 38
			x: canv.width / 2 + 161,
			y: canv.height / 2 + 3,
			connections: [10, 37, 43],
		},
		{
			// 39
			x: canv.width / 2 + 107,
			y: canv.height / 2 - 60,
			connections: [37, 40],
		},
		{
			// 40
			x: canv.width / 2 + 27,
			y: canv.height / 2 - 60,
			connections: [39, 41, 53],
		},
		{
			// 41
			x: canv.width / 2 - 27,
			y: canv.height / 2 - 60,
			connections: [40, 42, 54],
		},
		{
			// 42
			x: canv.width / 2 - 107,
			y: canv.height / 2 - 60,
			connections: [34, 41],
		},
		//
		{
			// 43
			x: canv.width / 2 + 161,
			y: canv.height / 2 - 114,
			connections: [38, 44, 48],
		},
		{
			// 44
			x: canv.width / 2 + 261,
			y: canv.height / 2 - 114,
			connections: [43, 45],
		},
		{
			// 45
			x: canv.width / 2 + 261,
			y: canv.height / 2 - 168,
			connections: [44, 46, 48],
		},
		{
			// 46
			x: canv.width / 2 + 261,
			y: canv.height / 2 - 238,
			connections: [45, 47],
		},
		{
			// 47
			x: canv.width / 2 + 161,
			y: canv.height / 2 - 238,
			connections: [46, 48, 49],
		},
		{
			// 48
			x: canv.width / 2 + 161,
			y: canv.height / 2 - 168,
			connections: [43, 45, 47, 51],
		},
		{
			// 49
			x: canv.width / 2 + 27,
			y: canv.height / 2 - 238,
			connections: [47, 50],
		},
		{
			// 50
			x: canv.width / 2 + 27,
			y: canv.height / 2 - 168,
			connections: [49, 51, 56],
		},
		{
			// 51
			x: canv.width / 2 + 107,
			y: canv.height / 2 - 168,
			connections: [48, 50, 52],
		},
		{
			// 52
			x: canv.width / 2 + 107,
			y: canv.height / 2 - 114,
			connections: [51, 53],
		},
		{
			// 53
			x: canv.width / 2 + 27,
			y: canv.height / 2 - 114,
			connections: [40, 52],
		},
		//
		{
			// 54
			x: canv.width / 2 - 27,
			y: canv.height / 2 - 114,
			connections: [41, 55],
		},
		{
			// 55
			x: canv.width / 2 - 107,
			y: canv.height / 2 - 114,
			connections: [54, 59],
		},
		{
			// 56
			x: canv.width / 2 - 27,
			y: canv.height / 2 - 168,
			connections: [50, 57, 59],
		},
		{
			// 57
			x: canv.width / 2 - 27,
			y: canv.height / 2 - 238,
			connections: [56, 58],
		},
		{
			// 58
			x: canv.width / 2 - 161,
			y: canv.height / 2 - 238,
			connections: [0, 57, 60],
		},
		{
			// 59
			x: canv.width / 2 - 107,
			y: canv.height / 2 - 168,
			connections: [55, 56, 60],
		},
		{
			// 60
			x: canv.width / 2 - 161,
			y: canv.height / 2 - 168,
			connections: [58, 59, 61, 63],
		},
		{
			// 61
			x: canv.width / 2 - 261,
			y: canv.height / 2 - 168,
			connections: [0, 60, 62],
		},
		{
			// 62
			x: canv.width / 2 - 261,
			y: canv.height / 2 - 114,
			connections: [61, 63],
		},
		{
			// 63
			x: canv.width / 2 - 161,
			y: canv.height / 2 - 114,
			connections: [33, 60, 62],
		}
	);
	// use nodes to fill in pellets
	pellets = [];
	for (let i = 0; i < nodes.length; i++) {
		let x = nodes[i].x;
		let y = nodes[i].y;
		let connections = nodes[i].connections;
		for (let j = 0; j < connections.length; j++) {
			pellets.push({
				x: x,
				y: y,
			});
			let index = connections[j];
			if (index > i) {
				let x2 = nodes[index].x;
				let y2 = nodes[index].y;
				let distBetween = distBetweenPoints(x, y, x2, y2);
				let pellet_no = Math.floor(
					distBetween / (2 * (PEL_DIST + PEL_SIZE))
				);
				let xf = 0;
				let yf = 0;
				if (x > x2) {
					xf = -1;
				} else if (x2 > x) {
					xf = 1;
				}
				if (y > y2) {
					yf = -1;
				} else if (y2 > y) {
					yf = 1;
				}
				for (let k = 1; k < pellet_no; k++) {
					pellets.push({
						x: x + xf * k * (distBetween / pellet_no),
						y: y + yf * k * (distBetween / pellet_no),
					});
				}
			}
		}
	}
	// pellets creation leaves duplicates for some reason
	for (let l = 0; l < pellets.length; l++) {
		let x = pellets[l].x;
		let y = pellets[l].y;
		for (let m = 0; m < pellets.length; m++) {
			if (m != l) {
				let x2 = pellets[m].x;
				let y2 = pellets[m].y;
				if (x === x2 && y === y2) {
					pellets[l] = {};
				}
			}
		}
	}
}

// start game
const START_BUTTON = document.getElementById("start");
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
	START_BUTTON.onclick = "";
	started = true;
	createLevel();

	// get high score from local
	var scoreStr = localStorage.getItem(SAVE_KEY_SCORE);
	if (scoreStr == null) {
		scoreHigh = 0;
	} else {
		scoreHigh = parseInt(scoreStr);
	}
}

// toggle debug features
function toggleDebug() {
	if (debug) {
		debug = false;
	} else {
		debug = true;
	}
}

// death function
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
	if (started) {
		// cycle pacman mouth
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
			var allow = false;
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
				if (
					walllowery + FUDGE >= uppery &&
					walluppery - FUDGE <= lowery
				) {
					// check if horizontal face falls within range
					if (
						wallleftx + FUDGE <= rightx &&
						wallrightx + FUDGE >= leftx
					) {
						// allow close collisions for movement feel
						if (
							(pacman.x > x1 && pacman.x < x2) ||
							(pacman.x < x1 && pacman.x > x2)
						) {
							if (
								wallrightx - leftx <= ALLOW &&
								wallrightx - leftx > 0
							) {
								pacman.x += wallrightx - leftx + KNOCK;
								allow = true;
							} else if (
								rightx - wallleftx <= ALLOW &&
								rightx - wallleftx > 0
							) {
								pacman.x -= rightx - wallleftx + KNOCK;
								allow = true;
							}
						} else if (
							(pacman.x > x1 && pacman.x > x2) ||
							(pacman.x < x1 && pacman.x < x2)
						) {
							if (
								walllowery - uppery <= ALLOW &&
								walllowery - uppery > 0
							) {
								pacman.y += walllowery - uppery + KNOCK;
								allow = true;
							} else if (
								lowery - walluppery <= ALLOW &&
								lowery - walluppery > 0
							) {
								pacman.y -= lowery - walluppery + KNOCK;
								allow = true;
							}
						}

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
						if (allow === false) {
							pacman.xv = 0;
							pacman.yv = 0;
							break;
						}
					}
				}
			}
			pacman.x += pacman.xv / FPS;
			pacman.y += pacman.yv / FPS;
			if (allow) {
				pacman.x += pacman.xv / FPS;
				pacman.y += pacman.yv / FPS;
			}
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

		// check pellet collision
		for (let i = 0; i < pellets.length; i++) {
			let x = pacman.x;
			let y = pacman.y;
			let x2 = pellets[i].x;
			let y2 = pellets[i].y;
			if (distBetweenPoints(x, y, x2, y2) < PAC_SIZE + PEL_SIZE) {
				pellets[i] = {};
				score += POINTS_LEMON;
				if (score > scoreHigh) {
					scoreHigh = score;
					localStorage.setItem(SAVE_KEY_SCORE, scoreHigh);
				}
			}
		}

		// draw pellets
		if (!debug) {
			for (let i = 0; i < pellets.length; i++) {
				let x = pellets[i].x;
				let y = pellets[i].y;
				ctx.fillStyle = "pink";
				ctx.beginPath();
				ctx.arc(x, y, PEL_SIZE, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		// alternative debug feature
		// draw nodes
		// if (debug) {
		// 	for (let i = 0; i < nodes.length; i++) {
		// 		let x = nodes[i].x;
		// 		let y = nodes[i].y;
		// 		let connections = nodes[i].connections;
		// 		ctx.fillStyle = "pink";
		// 		ctx.beginPath();
		// 		ctx.arc(x, y, PEL_SIZE, 0, Math.PI * 2);
		// 		ctx.fill();
		// 		for (let j = 0; j < connections.length; j++) {
		// 			let index = connections[j];
		// 			// if (index > i) {
		// 			let x2 = nodes[index].x;
		// 			let y2 = nodes[index].y;
		// 			ctx.strokeStyle = "pink";
		// 			ctx.moveTo(x, y);
		// 			ctx.lineTo(x2, y2);
		// 			ctx.stroke();
		// 			//}
		// 		}
		// 	}
		// }

		// find pacman closest node
		let pacnode1;
		let pacnode_dist1;
		let pacnode2;
		let pacnode_dist2;
		let pacnode_backup = 0;
		let pacnode_backupdist = distBetweenPoints(
			pacman.x,
			pacman.y,
			nodes[0].x,
			nodes[0].y
		);
		let subnodes_xpac = nodes.slice();
		let subnodes_ypac = nodes.slice();
		for (let i = 0; i < nodes.length; i++) {
			let node_dist = distBetweenPoints(
				pacman.x,
				pacman.y,
				nodes[i].x,
				nodes[i].y
			);
			if (node_dist < pacnode_backupdist) {
				pacnode_backup = i;
				pacnode_backupdist = node_dist;
			}
			// autocorrect to node when close
			if (
				Math.abs(nodes[i].x - pacman.x) < 5 &&
				Math.abs(nodes[i].y - pacman.y) < 5
			) {
				pacnode1 = i;
				pacnode2 = i;
				pacnode_dist1 = 0;
				pacnode_dist2 = 0;
				// find nodes on the pacman axis
			} else if (
				Math.abs(nodes[i].x - pacman.x) >= 5 &&
				Math.abs(nodes[i].y - pacman.y) >= 5
			) {
				subnodes_xpac[i] = [];
				subnodes_ypac[i] = [];
			} else if (
				Math.abs(nodes[i].x - pacman.x) < 5 &&
				Math.abs(nodes[i].y - pacman.y) >= 5
			) {
				subnodes_ypac[i] = [];
			} else if (
				Math.abs(nodes[i].x - pacman.x) >= 5 &&
				Math.abs(nodes[i].y - pacman.y) < 5
			) {
				subnodes_xpac[i] = [];
			}
		}
		// iterate over nodes with same x
		for (let i = 0; i < subnodes_xpac.length; i++) {
			let connections = subnodes_xpac[i].connections;
			if (connections) {
				for (let k = 0; k < connections.length; k++) {
					let index = connections[k];
					let connections2 = subnodes_xpac[index].connections;
					if (connections2) {
						for (let l = 0; l < connections2.length; l++) {
							if (connections2[l] === i) {
								if (
									(pacman.y < subnodes_xpac[i].y &&
										pacman.y > subnodes_xpac[index].y) ||
									(pacman.y > subnodes_xpac[i].y &&
										pacman.y < subnodes_xpac[index].y)
								) {
									let dist1 = distBetweenPoints(
										pacman.x,
										pacman.y,
										subnodes_xpac[i].x,
										subnodes_xpac[i].y
									);
									let dist2 = distBetweenPoints(
										pacman.x,
										pacman.y,
										subnodes_xpac[index].x,
										subnodes_xpac[index].y
									);
									if (
										dist1 < pacnode_dist1 ||
										dist2 < pacnode_dist1 ||
										!pacnode_dist1
									) {
										pacnode1 = i;
										pacnode2 = index;
										pacnode_dist1 = dist1;
										pacnode_dist2 = dist2;
									}
								}
							}
						}
					}
				}
			}
		}
		// iterate over nodes with same y
		for (let i = 0; i < subnodes_ypac.length; i++) {
			let connections = subnodes_ypac[i].connections;
			if (connections) {
				for (let k = 0; k < connections.length; k++) {
					let index = connections[k];
					let connections2 = subnodes_ypac[index].connections;
					if (connections2) {
						for (let l = 0; l < connections2.length; l++) {
							if (connections2[l] === i) {
								if (
									(pacman.x < subnodes_ypac[i].x &&
										pacman.x > subnodes_ypac[index].x) ||
									(pacman.x > subnodes_ypac[i].x &&
										pacman.x < subnodes_ypac[index].x)
								) {
									let dist1 = distBetweenPoints(
										pacman.x,
										pacman.y,
										subnodes_ypac[i].x,
										subnodes_ypac[i].y
									);
									let dist2 = distBetweenPoints(
										pacman.x,
										pacman.y,
										subnodes_ypac[index].x,
										subnodes_ypac[index].y
									);
									if (
										dist1 < pacnode_dist1 ||
										dist2 < pacnode_dist1 ||
										!pacnode_dist1
									) {
										pacnode1 = i;
										pacnode2 = index;
										pacnode_dist1 = dist1;
										pacnode_dist2 = dist2;
									}
								}
							}
						}
					}
				}
			}
		}
		if (!pacnode_dist1) {
			pacnode1 = pacnode_backup;
			pacnode2 = pacnode_backup;
			pacnode_dist1 = pacnode_backupdist;
			pacnode_dist2 = pacnode_backupdist;
		}

		// move ghosts
		if (pacman.isDead === false) {
			for (let i = 0; i < ghosts.length; i++) {
				let ghostnode1;
				let ghostnode2;
				let ghostnode_dist1;
				let ghostnode_dist2;
				let ghostnode_backup = 0;
				let ghostnode_backupdist = distBetweenPoints(
					ghosts[i].x,
					ghosts[i].y,
					nodes[0].x,
					nodes[0].y
				);
				let subnodes_x = nodes.slice();
				let subnodes_y = nodes.slice();
				for (let j = 0; j < nodes.length; j++) {
					let node_dist = distBetweenPoints(
						ghosts[i].x,
						ghosts[i].y,
						nodes[j].x,
						nodes[j].y
					);
					if (node_dist < ghostnode_backupdist) {
						ghostnode_backup = j;
						ghostnode_backupdist = node_dist;
					}

					// autocorrect to node when close
					if (
						Math.abs(nodes[j].x - ghosts[i].x) < 2 &&
						Math.abs(nodes[j].y - ghosts[i].y) < 2
					) {
						ghostnode1 = j;
						ghostnode2 = j;
						ghostnode_dist1 = 0;
						ghostnode_dist2 = 0;
						// find nodes on the ghost axis
					} else if (
						Math.abs(nodes[j].x - ghosts[i].x) >= 2 &&
						Math.abs(nodes[j].y - ghosts[i].y) >= 2
					) {
						subnodes_x[j] = [];
						subnodes_y[j] = [];
					} else if (
						Math.abs(nodes[j].x - ghosts[i].x) < 2 &&
						Math.abs(nodes[j].y - ghosts[i].y) >= 2
					) {
						subnodes_y[j] = [];
					} else if (
						Math.abs(nodes[j].x - ghosts[i].x) >= 2 &&
						Math.abs(nodes[j].y - ghosts[i].y) < 2
					) {
						subnodes_x[j] = [];
					}
				}
				// iterate over nodes with same x
				for (let j = 0; j < subnodes_x.length; j++) {
					let connections = subnodes_x[j].connections;
					if (connections) {
						for (let k = 0; k < connections.length; k++) {
							let index = connections[k];
							let connections2 = subnodes_x[index].connections;
							if (connections2) {
								for (let l = 0; l < connections2.length; l++) {
									if (connections2[l] === j) {
										if (
											(ghosts[i].y < subnodes_x[j].y &&
												ghosts[i].y >
													subnodes_x[index].y) ||
											(ghosts[i].y > subnodes_x[j].y &&
												ghosts[i].y <
													subnodes_x[index].y)
										) {
											let dist1 = distBetweenPoints(
												ghosts[i].x,
												ghosts[i].y,
												subnodes_x[index].x,
												subnodes_x[index].y
											);
											let dist2 = distBetweenPoints(
												ghosts[i].x,
												ghosts[i].y,
												subnodes_x[index].x,
												subnodes_x[index].y
											);
											if (
												dist1 < ghostnode_dist1 ||
												dist2 < ghostnode_dist1 ||
												!ghostnode_dist1
											) {
												ghostnode1 = i;
												ghostnode2 = index;
												ghostnode_dist1 = dist1;
												ghostnode_dist2 = dist2;
											}
										}
									}
								}
							}
						}
					}
				}
				// iterate over nodes with same y
				for (let j = 0; j < subnodes_y.length; j++) {
					let connections = subnodes_y[j].connections;
					if (connections) {
						for (let k = 0; k < connections.length; k++) {
							let index = connections[k];
							let connections2 = subnodes_y[index].connections;
							if (connections2) {
								for (let l = 0; l < connections2.length; l++) {
									if (connections2[l] === j) {
										if (
											(ghosts[i].x < subnodes_y[j].x &&
												ghosts[i].x >
													subnodes_y[index].x) ||
											(ghosts[i].x > subnodes_y[j].x &&
												ghosts[i].x <
													subnodes_y[index].x)
										) {
											let dist1 = distBetweenPoints(
												ghosts[i].x,
												ghosts[i].y,
												subnodes_y[index].x,
												subnodes_y[index].y
											);
											let dist2 = distBetweenPoints(
												ghosts[i].x,
												ghosts[i].y,
												subnodes_y[index].x,
												subnodes_y[index].y
											);
											if (
												dist1 < ghostnode_dist1 ||
												dist2 < ghostnode_dist1 ||
												!ghostnode_dist1
											) {
												ghostnode1 = i;
												ghostnode2 = index;
												ghostnode_dist1 = dist1;
												ghostnode_dist2 = dist2;
											}
										}
									}
								}
							}
						}
					}
				}
				if (!ghostnode_dist1) {
					ghostnode1 = ghostnode_backup;
					ghostnode2 = ghostnode_backup;
					ghostnode_dist1 = ghostnode_backupdist;
					ghostnode_dist2 = ghostnode_backupdist;
				}

				// shortest path
				// ghostnode1, ghostnode2 = closest nodes to ghost
				// ghostnode_dist1, ghostnode_dist2 = distance from ghost to closest nodes
				// pacnode1, pacnode2 = closest nodes to pacman
				// pacnode_dist1, pacnode_dist2 = distance from pacman to closest nodes
				let distance_array = nodes.slice();
				for (let j = 0; j < distance_array.length; j++) {
					distance_array[j] = {
						visited: false,
						dist: 100000,
						path: [],
					};
				}
				distance_array[ghostnode1].visited = true;
				distance_array[ghostnode1].dist = ghostnode_dist1;
				let subarray = nodes[ghostnode1].connections;
				for (let j = 0; j < subarray.length; j++) {
					let working_node = subarray[j];
					distance_array[working_node].dist =
						distance_array[ghostnode1].dist +
						distBetweenPoints(
							nodes[ghostnode1].x,
							nodes[ghostnode1].y,
							nodes[working_node].x,
							nodes[working_node].y
						);
					distance_array[working_node].path = [ghostnode1];
				}
				distance_array[ghostnode2].visited = true;
				distance_array[ghostnode2].dist = ghostnode_dist1;
				subarray = nodes[ghostnode2].connections;
				for (let j = 0; j < subarray.length; j++) {
					let working_node = subarray[j];
					let working_dist =
						distance_array[ghostnode2].dist +
						distBetweenPoints(
							nodes[ghostnode2].x,
							nodes[ghostnode2].y,
							nodes[working_node].x,
							nodes[working_node].y
						);
					if (working_dist < distance_array[working_node].dist) {
						distance_array[working_node].dist = working_dist;
						distance_array[working_node].path = [ghostnode2];
					}
				}
				// takes in distance_array and updates it
				for (let j = 1; j < distance_array.length; j++) {
					let shortest_id = 0;
					let shortest_dist = 100000;
					for (let k = 0; k < distance_array.length; k++) {
						if (!distance_array[k].visited) {
							if (distance_array[k].dist < shortest_dist) {
								shortest_id = k;
								shortest_dist = distance_array[k].dist;
							}
						}
					}
					let shortest_subarray = nodes[shortest_id].connections;
					for (let k = 0; k < shortest_subarray.length; k++) {
						let working_node = shortest_subarray[k];
						let working_dist =
							distance_array[shortest_id].dist +
							distBetweenPoints(
								nodes[shortest_id].x,
								nodes[shortest_id].y,
								nodes[working_node].x,
								nodes[working_node].y
							);
						if (working_dist < distance_array[working_node].dist) {
							distance_array[working_node].dist = working_dist;
							distance_array[working_node].path =
								distance_array[shortest_id].path.slice();
							distance_array[working_node].path.push(shortest_id);
						}
					}
					distance_array[shortest_id].visited = true;
				}

				let final_dist1 = distance_array[pacnode1].dist + pacnode_dist1;
				let final_dist2 = distance_array[pacnode2].dist + pacnode_dist2;
				if (final_dist1 < final_dist2) {
					node_final = pacnode1;
				} else {
					node_final = pacnode2;
				}

				let node_first = distance_array[node_final].path[0];
				let node_second = distance_array[node_final].path[1];
				let node_id = node_first;

				if (node_second) {
					if (
						distBetweenPoints(
							ghosts[i].x,
							ghosts[i].y,
							nodes[node_second].x,
							nodes[node_second].y
						) -
							0.01 <
						distBetweenPoints(
							nodes[node_first].x,
							nodes[node_first].y,
							nodes[node_second].x,
							nodes[node_second].y
						)
					) {
						node_id = node_second;
					}
				} else {
					node_id = node_final;
				}

				// alternative debug feature
				// if (debug) {
				// 	ctx.fillStyle = ghosts[i].color;
				// 	ctx.beginPath();
				// 	ctx.arc(
				// 		nodes[node_id].x,
				// 		nodes[node_id].y,
				// 		GHOST_SIZE / 2,
				// 		0,
				// 		Math.PI * 2
				// 	);
				// 	ctx.fill();
				// 	ctx.fillStyle = "yellow";
				// 	ctx.beginPath();
				// 	ctx.arc(
				// 		nodes[node_final].x,
				// 		nodes[node_final].y,
				// 		GHOST_SIZE / 2,
				// 		0,
				// 		Math.PI * 2
				// 	);
				// 	ctx.fill();
				// }

				if (debug) {
					for (
						let j = 0;
						j < distance_array[node_final].path.length;
						j++
					) {
						let n = distance_array[node_final].path[j];
						let x = nodes[n].x;
						let y = nodes[n].y;
						ctx.fillStyle = ghosts[i].color;
						ctx.beginPath();
						ctx.arc(x, y, PEL_SIZE, 0, Math.PI * 2);
						ctx.fill();
						if (j === distance_array[node_final].path.length - 1) {
							ctx.strokeStyle = ghosts[i].color;
							ctx.moveTo(x, y);
							ctx.lineTo(pacman.x, pacman.y);
							ctx.stroke();
						} else {
							let k = j + 1;
							let m = distance_array[node_final].path[k];
							let x2 = nodes[m].x;
							let y2 = nodes[m].y;
							ctx.strokeStyle = ghosts[i].color;
							ctx.moveTo(x, y);
							ctx.lineTo(x2, y2);
							ctx.stroke();
						}
					}
				}

				// move towards closest node
				if (node_id) {
					if (nodes[node_id].x - ghosts[i].x != 0) {
						ghosts[i].xv =
							(GHOST_SPD *
								GLOBAL_SPD *
								Math.abs(nodes[node_id].x - ghosts[i].x)) /
							(nodes[node_id].x - ghosts[i].x);
					}
					if (nodes[node_id].y - ghosts[i].y != 0) {
						ghosts[i].yv =
							(GHOST_SPD *
								GLOBAL_SPD *
								Math.abs(nodes[node_id].y - ghosts[i].y)) /
							(nodes[node_id].y - ghosts[i].y);
					}
				}

				ghosts[i].x += ghosts[i].xv / FPS;
				ghosts[i].y += ghosts[i].yv / FPS;

				// detect ghost collisions
				for (let j = 0; j < ghosts.length; j++) {
					if (j === i) {
					} else if (
						distBetweenPoints(
							ghosts[i].x,
							ghosts[i].y,
							ghosts[j].x,
							ghosts[j].y
						) <
						2 * GHOST_SIZE
					) {
						console.log(
							distBetweenPoints(
								ghosts[i].x,
								ghosts[i].y,
								ghosts[j].x,
								ghosts[j].y
							)
						);
						ghosts[i].x -= (2 * ghosts[i].xv) / FPS;
						ghosts[i].y -= (2 * ghosts[i].yv) / FPS;
					}
				}
			}
		}

		// draw ghosts
		for (let i = 0; i < ghosts.length; i++) {
			let x = ghosts[i].x;
			let y = ghosts[i].y;
			let color = ghosts[i].color;

			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(x, y, GHOST_SIZE, Math.PI, Math.PI * 2);
			ctx.fill();
			ctx.moveTo(x - GHOST_SIZE, y);
			ctx.lineTo(x - GHOST_SIZE, y + GHOST_SIZE);
			ctx.lineTo(x - GHOST_SIZE / 2, y + GHOST_SIZE / 3);
			ctx.lineTo(x, y + GHOST_SIZE);
			ctx.lineTo(x + GHOST_SIZE / 2, y + GHOST_SIZE / 3);
			ctx.lineTo(x + GHOST_SIZE, y + GHOST_SIZE);
			ctx.lineTo(x + GHOST_SIZE, y);
			ctx.fill();
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
}
