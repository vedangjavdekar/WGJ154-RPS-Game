import { SCENES } from "../../config";

export default class GameScene extends Phaser.Scene {
	constructor() {
		super(SCENES.GAME);
	}

	preload() {
		this.add.text(0, 0, "Game Scene", {
			font: "36px gameFont",
			fill: "#000",
		});
	}
}
