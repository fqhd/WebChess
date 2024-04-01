import { Chess } from 'chess.js'

const chess = new Chess();

const canvas = document.getElementById('chessboard');
const dpr = window.devicePixelRatio || 1;
canvas.style.width = canvas.width + 'px';
canvas.style.height = canvas.height + 'px';
canvas.width *= dpr;
canvas.height *= dpr;
const ctx = canvas.getContext('2d');
ctx.scale(dpr, dpr);
const moveInput = document.getElementById('moveInput');
moveInput.addEventListener('keypress', moveSent);
const history = document.getElementById('history');
const depth_input = document.getElementById('search-depth');
depth_input.addEventListener('blur', depth_changed);
document.getElementById('back-button').onclick = takeBack;
let moveNumber = 1;
let canplay = true;
let depth = 5;

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
	for(const c of ['b', 'w']) {
		for(const p of ['p', 'r', 'n', 'b', 'q', 'k']) {
			const imageSrc = './pieces/' + c + p + '.png';
			pieceImages[c + p] = await loadImage(imageSrc);
		}
	}
}

function depth_changed() {
	const value = parseInt(depth_input.value);

    if (isNaN(value) || value < 0) {
        depth_input.value = '0';
		depth = 0;
    }
    else if (value > 9) {
        depth_input.value = '9';
		depth = 9;
    }else{
		depth_input.value = value;
		depth = value;
	}
}

function takeBack() {
	if (canplay && history.hasChildNodes()) {
		chess.undo();
		chess.undo();
		history.removeChild(history.lastChild);
		history.removeChild(history.lastChild);
		drawBoard();
		drawPieces();
	}
}

function chessboardIndexToSquare(x, y) {
	var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	return files[x] + (8 - y);
}

function drawBoard() {
	const colors = ['#ebd2b7', '#a16f5a'];
	const tileSize = canvas.width / 8 / dpr;

	for(let i = 0; i < 8; i++) {
		for(let j = 0; j < 8; j++) {
			const color = colors[(i + j) % 2];
			ctx.fillStyle = color;
			ctx.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
		}
	}
}

function drawPieces() {
	const tileSize = canvas.width / 8 / dpr;

	for(let i = 0; i < 8; i++) {
		for(let j = 0; j < 8; j++) {
			const piece = chess.get(chessboardIndexToSquare(i, j));
			
			if (piece) {
				const pieceImage = pieceImages[piece.color + piece.type];
				ctx.drawImage(pieceImage, i * tileSize, j * tileSize, tileSize, tileSize);
			}

		}
	}
}

function drawSquare(file, rank) {
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
	const tileSize = canvas.width / 8 / dpr;
	ctx.fillStyle = "#FEE258FF";
	ctx.fillRect(file * tileSize, rank * tileSize, tileSize, tileSize);
}

function drawLastMove(parsedMove) {
	const fromSquare = parsedMove.from;
	const toSquare = parsedMove.to;

	drawSquare(fromSquare[0], parseInt(fromSquare[1]));
	drawSquare(toSquare[0], parseInt(toSquare[1]));
}

async function moveSent(event) {
	if (event.keyCode === 13) {
		playMove(moveInput.value);
		moveInput.value = '';
	}
}

function addMoveToHistory(move) {
	const p = document.createElement('p');
	p.textContent = moveNumber + '. ' + move;
	moveNumber += 1;
	history.appendChild(p);
}

async function playMove(move) {
	if (!canplay) {
		return;
	}
	canplay = false;
	if (chess.moves().includes(move)) {
		let parsedMove = chess.move(move);
		drawBoard();
		drawLastMove(parsedMove);
		addMoveToHistory(move);
		drawPieces();
		let botMove = await fetch('https://api.whoisfahd.dev/chessbot', {
			method: 'GET',
			headers: {
				'fen': chess.fen(),
				'depth': depth
			}
		});
		botMove = await botMove.text();
		botMove = botMove.trim();
		parsedMove = chess.move(botMove);
		drawBoard();
		drawLastMove(parsedMove);
		addMoveToHistory(botMove);
		drawPieces();
		canplay = true;
	} else {
		canplay = true;
	}
}

async function main() {
	await loadPieces();
	drawBoard();
	drawPieces();
}

main();
