import { Chess } from 'chess.js'

const chess = new Chess()

const canvas = document.getElementById('chessboard');
const ctx = canvas.getContext('2d');

console.log('hi');

function chessboardIndexToSquare(x, y) {
	var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	return files[x] + (8 - y);
}

function drawBoard() {
	const colors = ['#a16f5a', '#ebd2b7'];
	const tileSize = canvas.width / 8;

	for(let i = 0; i < 8; i++) {
		for(let j = 0; j < 8; j++) {
			const color = colors[(i + j) % 2];
			ctx.fillStyle = color;
			ctx.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
		}
	}
}

drawBoard();