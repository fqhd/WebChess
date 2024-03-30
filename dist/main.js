/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("const TILE_SIZE = 64;\r\n\r\nlet bb;\r\nlet bk;\r\nlet bn;\r\nlet bp;\r\nlet bq;\r\nlet br;\r\nlet wb;\r\nlet wk;\r\nlet wn;\r\nlet wp;\r\nlet wq;\r\nlet wr;\r\nlet inputBox;\r\nlet sendButton;\r\n\r\nfunction preload() {\r\n\tbb = loadImage('pieces/bb.png');\r\n\tbk = loadImage('pieces/bk.png');\r\n\tbn = loadImage('pieces/bn.png');\r\n\tbp = loadImage('pieces/bp.png');\r\n\tbq = loadImage('pieces/bq.png');\r\n\tbr = loadImage('pieces/br.png');\r\n\r\n\twb = loadImage('pieces/wb.png');\r\n\twk = loadImage('pieces/wk.png');\r\n\twn = loadImage('pieces/wn.png');\r\n\twp = loadImage('pieces/wp.png');\r\n\twq = loadImage('pieces/wq.png');\r\n\twr = loadImage('pieces/wr.png');\r\n}\r\n\r\nfunction setup() {\r\n\tcreateCanvas(TILE_SIZE*8, TILE_SIZE*8);\r\n\tinputBox = createInput();\r\n\tsendButton = createButton('Send');\r\n}\r\n\r\nfunction drawBackground() {\r\n\tnoStroke();\r\n\tfor (let i = 0; i < 8; i++) {\r\n\t\tfor (let j = 0; j < 8; j++) {\r\n\r\n\t\t\tif ((i + j) % 2) {\r\n\t\t\t\tfill(161, 111, 90);\r\n\t\t\t}\r\n\t\t\telse {\r\n\t\t\t\tfill(235, 210, 183);\r\n\t\t\t}\r\n\r\n\t\t\trect(j*TILE_SIZE, i*TILE_SIZE, TILE_SIZE, TILE_SIZE);\r\n\t\t}\r\n\t}\r\n}\r\n\r\n\r\nfunction draw() {\r\n\tdrawBackground();\r\n}\n\n//# sourceURL=webpack://webchess/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;