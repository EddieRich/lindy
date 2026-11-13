import { GAME_WIDTH, GAME_HEIGHT, TWOPI } from "./constants.js";
import { loadImageAsset } from "./game.js";

export class Plane {
	// Static array storing all active Plane instances
	static allPlanes = [];
	static images = [];
	static renderIndex = 0;

	constructor() {
		// Initialize all randomized properties (image, speed, position)
		this.reset(true);

		// Register this instance in the static array
		Plane.allPlanes.push(this);
	}

	reset(placeOnScreen = false) {
		this.image = Plane.images[Math.floor(Math.random() * 1.8 + 0.1)];
		this.y = ((Math.random() * 0.8) + 0.1) * GAME_HEIGHT;
		const direction = Math.random() < 0.5 ? 1 : -1;
		this.speed = direction * GAME_WIDTH / ((Math.random() * 2) + 5);
		this.scale = (Math.random() * 0.03 + 0.02) * GAME_HEIGHT / this.image.height;

		if (placeOnScreen) {
			this.x = Math.random() * GAME_WIDTH;
		} else if (this.speed > 0) {
			this.x = -this.image.width;
		} else {
			this.x = GAME_WIDTH + this.image.width;
		}
	}

	update(elapsed) {
		this.x += this.speed * elapsed;

		// Check if the cloud has completely exited the opposite edge
		if (this.speed > 0 && this.x > GAME_WIDTH) {
			this.reset(false);
		} else if (this.speed < 0 && this.x + this.image.width < 0) {
			this.reset(false);
		}
	}

	render(ctx) {
		ctx.save();
		ctx.translate(this.x + ((this.speed > 0) ? this.image.width : 0), this.y);
		ctx.scale(this.scale * ((this.speed > 0) ? -1 : 1), this.scale);
		ctx.drawImage(this.image, 0, 0);
		ctx.restore();
	}

	static async createPlanes(count) {
		Plane.images = await Promise.all(["./assets/plane1.png", "./assets/plane2.png"].map(loadImageAsset));
		for (let i = 0; i < count; i++) {
			new Plane();
		}

		Plane.renderIndex = 0;
	}

	static upadateAll(elapsed) {
		for (const plane of Plane.allPlanes)
			plane.update(elapsed);

		Plane.renderIndex = 0;
	}

	static renderNext(ctx) {
		if (Plane.renderIndex >= this.allPlanes.length)
			return false

		Plane.allPlanes[Plane.renderIndex++].render(ctx);

		return (Plane.renderIndex < Plane.allPlanes.length)
	}
}
