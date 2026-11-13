import { Cloud } from "./cloud.js";
import { Plane } from "./plane.js";

export function initMainScreen() {
	Plane.createPlanes(6);
	Cloud.createClouds(5);
}

/**
 * @param {number} elapsed
 */
export function updateMainScreen(elapsed) {
	Cloud.upadateAll(elapsed);
	Plane.upadateAll(elapsed);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
export function renderMainScreen(ctx) {
	while (Plane.renderNext(ctx))
		Cloud.renderNext(ctx);
}
