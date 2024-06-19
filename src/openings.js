import { Chess } from 'chess.js';


const chess = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

const canvas = document.getElementById('chessboard');
const dpr = window.devicePixelRatio || 1;
canvas.style.width = canvas.width + 'px';
canvas.style.height = canvas.height + 'px';
canvas.width *= dpr;
canvas.height *= dpr;
const ctx = canvas.getContext('2d');
ctx.scale(dpr, dpr);
const moveInput = document.getElementById('moveInput');
moveInput.addEventListener('keypress', keyPressed);
document.getElementById('skip-button').onclick = skip;
const scoreElement = document.getElementById('score');
const selectionMenu = document.getElementById('selection-menu');
selectionMenu.addEventListener('change', function () {
	loadOpening(this.value);
});
let invert = false;
const moveAudio = new Audio('../res/move.mp3');
const captureAudio = new Audio('../res/capture.mp3');
const checkAudio = new Audio('../res/check.mp3');

let positions = [];
let openings;
let index = 0;
let canplay = true;
let score = 0;

const pieceImages = {}
function loadImage(path) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(null);
		img.src = path;
	});
}

async function loadPieces() {
	let arr = [];
	for (const c of ['b', 'w']) {
		for (const p of ['p', 'r', 'n', 'b', 'q', 'k']) {
			const imageSrc = '../pieces/' + c + p + '.png';
			arr.push(loadImage(imageSrc));
		}
	}
	arr = await Promise.all(arr);
	let index = 0;
	for (const c of ['b', 'w']) {
		for (const p of ['p', 'r', 'n', 'b', 'q', 'k']) {
			pieceImages[c + p] = arr[index];
			index++;
		}
	}
}

function skip() {
	canplay = false;
	const correctMove = openings[selectionMenu.value][positions[index]];
	const parsedMove = chess.move(correctMove);
	if (chess.inCheck()) {
		checkAudio.play();
	} else if (parsedMove.captured) {
		captureAudio.play();
	} else {
		moveAudio.play();
	}
	drawBoard();
	drawLastMove(parsedMove, 'green');
	drawPieces();
	setTimeout(() => {
		loadNextPosition();
		canplay = true;
	}, 1000);
}

function shuffle(array) {
	let currentIndex = array.length;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {

		// Pick a remaining element...
		let randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}
}

async function loadAllOpenings() {
	try {
		openings = await fetch('openings.json');
		openings = await openings.json();
	} catch (e) {
		console.log('failed to load openings');
		return;
	}
}

function loadOpening(opening) {
	const posDict = openings[opening];
	positions = Object.keys(posDict);
	shuffle(positions);
	index = 0;
}

function chessboardIndexToSquare(x, y) {
	var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	return files[x] + (8 - y);
}

function drawBoard() {
	const colors = ['#ebd2b7', '#a16f5a'];
	const tileSize = canvas.width / 8 / dpr;

	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			const color = colors[(i + j + invert) % 2];
			ctx.fillStyle = color;
			ctx.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
		}
	}
}

function drawPieces() {
	const tileSize = canvas.width / 8 / dpr;

	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			const piece = chess.get(chessboardIndexToSquare(i, j));

			if (piece) {
				const pieceImage = pieceImages[piece.color + piece.type];
				if (invert) {
					ctx.drawImage(pieceImage, (7 - i) * tileSize, (7 - j) * tileSize, tileSize, tileSize);
				} else {
					ctx.drawImage(pieceImage, i * tileSize, j * tileSize, tileSize, tileSize);
				}
			}
		}
	}
}

function drawLastMove(parsedMove, color) {
	const fromSquare = parsedMove.from;
	const toSquare = parsedMove.to;

	drawSquare(fromSquare[0], parseInt(fromSquare[1]), color);
	drawSquare(toSquare[0], parseInt(toSquare[1]), color);
}

function drawSquare(file, rank, color) {
	const fileToInt = {
		'a': 0,
		'b': 1,
		'c': 2,
		'd': 3,
		'e': 4,
		'f': 5,
		'g': 6,
		'h': 7
	};
	file = fileToInt[file];
	rank = 8 - rank;
	if (invert) rank = 7 - rank;
	if (invert) file = 7 - file;
	const tileSize = canvas.width / 8 / dpr;
	ctx.fillStyle = "#FEE258FF";
	if (color == 'red') {
		ctx.fillStyle = "#e83317ff";
	} else if (color == 'green') {
		ctx.fillStyle = "#35de62ff";
	}
	ctx.fillRect(file * tileSize, rank * tileSize, tileSize, tileSize);
}

async function keyPressed(event) {
	if (event.keyCode === 13) { // Enter
		attemptMove(moveInput.value);
		moveInput.value = '';
	}
}

async function attemptMove(move) {
	if (!canplay) return;
	if (!(move in chess.moves())) return;
	const correctMove = openings[selectionMenu.value][positions[index]];
	if (move == correctMove) {
		canplay = false;
		score++;
		scoreElement.textContent = 'Score: ' + score;
		const parsedMove = chess.move(move);
		if (chess.inCheck()) {
			checkAudio.play();
		} else if (parsedMove.captured) {
			captureAudio.play();
		} else {
			moveAudio.play();
		}
		drawBoard();
		drawLastMove(parsedMove, 'green');
		drawPieces();
		setTimeout(() => {
			loadNextPosition();
			canplay = true;
		}, 1000);
	} else {
		canplay = false;
		const parsedMove = chess.move(move);
		if (chess.inCheck()) {
			checkAudio.play();
		} else if (parsedMove.captured) {
			captureAudio.play();
		} else {
			moveAudio.play();
		}
		drawBoard();
		drawLastMove(parsedMove, 'red');
		drawPieces();
		chess.undo();
		setTimeout(() => {
			canplay = true;
			drawBoard();
			drawPieces();
		}, 1000);
	}
}

function loadNextPosition() {
	index++;
	chess.load(positions[index]);
	drawBoard();
	drawPieces();
}

async function main() {
	await loadPieces();
	await loadAllOpenings();
	loadOpening(selectionMenu.value);
	chess.load(positions[index]);
	drawBoard();
	drawPieces();
}

main();
