import { Cloud } from "./cloud.js";

export function initMainScreen() {
	Cloud.spawnBatch(5);
}

/**
 * @param {number} elapsed
 */
export function updateMainScreen(elapsed) {
	Cloud.upadateAll(elapsed)
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
export function renderMainScreen(ctx) {
	Cloud.renderAll(ctx);
}
