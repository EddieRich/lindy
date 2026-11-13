import { GAME_WIDTH, GAME_HEIGHT, TWOPI } from "./constants.js";

export class Cloud {
	static allClouds = [];
	static renderIndex = 0;

	constructor() {
		this.reset(true);
		Cloud.allClouds.push(this);
	}

	reset(placeOnScreen = false) {
		const direction = Math.random() < 0.5 ? 1 : -1;
		this.radiusX = GAME_WIDTH / (4 + Math.random() * 2);
		this.radiusY = this.radiusX * (0.25 + Math.random() * 0.35);
		this.speed = direction * GAME_WIDTH / ((Math.random() * 10) + 20);
		this.segments = this.generateScallopedSegments();
		const buffer = this.radiusX + 25; // Accounts for radius + max outward puff
		this.y = ((Math.random() * 0.8) + 0.1) * GAME_HEIGHT;
		if (placeOnScreen) {
			this.x = Math.random() * GAME_WIDTH;
		} else if (this.speed > 0) {
			this.x = -buffer;
		} else {
			this.x = GAME_WIDTH + buffer;
		}
	}

	generateScallopedSegments() {
		const bumps = Math.floor(Math.random() * 5) + 8; // 8 to 12 bumps
		const angleStep = TWOPI / bumps;
		const points = [];

		// Create anchor points relative to (0, 0)
		for (let i = 0; i < bumps; i++) {
			const angle = i * angleStep;
			const jitter = 0.85 + Math.random() * 0.3;
			points.push({
				x: Math.cos(angle) * this.radiusX * jitter,
				y: Math.sin(angle) * this.radiusY * jitter,
				angle: angle
			});
		}

		// Pre-calculate quadratic curve control points
		const segments = [];
		for (let i = 0; i < points.length; i++) {
			const current = points[i];
			const next = points[(i + 1) % points.length];

			const midX = (current.x + next.x) / 2;
			const midY = (current.y + next.y) / 2;

			const midAngle = current.angle + angleStep / 2;
			const puffOutward = GAME_HEIGHT / ((Math.random() * 10) + 15);

			segments.push({
				cpX: midX + Math.cos(midAngle) * puffOutward,
				cpY: midY + Math.sin(midAngle) * puffOutward,
				endX: next.x,
				endY: next.y
			});
		}

		return segments;
	}

	update(elapsed) {
		this.x += this.speed * elapsed;
		const buffer = this.radiusX + 25;

		// Check if the cloud has completely exited the opposite edge
		if (this.speed > 0 && this.x - buffer > GAME_WIDTH) {
			this.reset(false);
		} else if (this.speed < 0 && this.x + buffer < 0) {
			this.reset(false);
		}
	}

	render(ctx) {
		if (this.segments.length === 0) return;

		ctx.save();
		ctx.translate(this.x, this.y);

		ctx.beginPath();
		const lastSeg = this.segments[this.segments.length - 1];
		ctx.moveTo(lastSeg.endX, lastSeg.endY);

		for (const seg of this.segments) {
			ctx.quadraticCurveTo(seg.cpX, seg.cpY, seg.endX, seg.endY);
		}

		ctx.closePath();

		ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		ctx.strokeStyle = "rgba(148, 163, 184, 0.6)";
		ctx.lineWidth = 2;
		ctx.fill();
		ctx.stroke();

		ctx.restore();
	}

	static createClouds(count) {
		for (let i = 0; i < count; i++)
			new Cloud();

		this.renderIndex = 0;
	}

	static upadateAll(elapsed) {
		for (const cloud of Cloud.allClouds)
			cloud.update(elapsed);

		this.renderIndex = 0;
	}

	static renderNext(ctx) {
		if (Cloud.renderIndex >= this.allClouds.length)
			return false

		Cloud.allClouds[Cloud.renderIndex++].render(ctx);

		return (Cloud.renderIndex < Cloud.allClouds.length)
	}
}
