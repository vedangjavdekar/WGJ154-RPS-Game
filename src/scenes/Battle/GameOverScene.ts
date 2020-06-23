import { SCENES } from "../../config";

export default class GameOverScene extends Phaser.Scene {
	constructor() {
		super(SCENES.GAME_OVER);
	}

	preload() {
		this.add.text(0, 0, "Game Over Scene", {
			font: "36px gameFont",
			fill: "#000",
		});
	}
}
