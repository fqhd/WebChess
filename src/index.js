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
const button = document.getElementById('sendButton');
button.onclick = playMove;
const message = document.getElementById('messageLabel');
let canplay = true;

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

function chessboardIndexToSquare(x, y) {
	var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	return files[x] + (8 - y);
}

function drawBoard() {
	const colors = ['#a16f5a', '#ebd2b7'];
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

function decode(text) {
	const encoder = new TextEncoder();
	const uint8Array = encoder.encode(text);

	// Decode the Uint8Array using TextDecoder
	const decoder = new TextDecoder('utf-8');
	const decodedText = decoder.decode(uint8Array);
	return decodedText;
}

async function playMove() {
	if (!canplay) {
		return;
	}
	canplay = false;
	const move = moveInput.value;
	if (chess.moves().includes(move)) {
		chess.move(move);
		drawBoard();
		drawPieces();
		message.textContent = '';
		let botMove = await fetch('https:/api.whoisfahd.dev:5000/chessbot', {
			method: 'GET',
			headers: {
				'fen': chess.fen(),
				'depth': '3'
			}
		});
		botMove = await botMove.text();
		botMove = botMove.slice(0, -2);
		chess.move(botMove);
		drawBoard();
		drawPieces();
		canplay = true;
	} else {
		message.innerHTML += 'invalid move<br>';
		canplay = true;
	}
}

async function main() {
	await loadPieces();
	drawBoard();
	drawPieces();
}

main();
