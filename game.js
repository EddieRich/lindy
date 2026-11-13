import { GAME_WIDTH, GAME_HEIGHT, Screen } from "./constants.js";
import { initMainScreen, updateMainScreen, renderMainScreen } from "./main_screen.js";

const ctx = document.querySelector("canvas").getContext("2d");
let lastTimestamp = 0;
ctx.canvas.width = GAME_WIDTH;
ctx.canvas.height = GAME_HEIGHT;
let screen = Screen.Main;

export function loadImageAsset(src) {
	return new Promise((resolve) => {
		const img = new Image();
		img.src = src;
		img.onload = () => resolve(img); // Only proceeds when finished
	});
}

function update(timestamp) {
	var elapsed = (timestamp - lastTimestamp) / 1000;
	lastTimestamp = timestamp;
	if (screen === Screen.Main)
		updateMainScreen(elapsed);
}

function render() {
	ctx.fillStyle = "skyblue";
	ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

	if (screen === Screen.Main)
		renderMainScreen(ctx);
}

function gameLoop(timestamp) {
	requestAnimationFrame((t) => gameLoop(t));
	update(timestamp);
	render();
}

initMainScreen();
requestAnimationFrame((t) => gameLoop(t));
