import { SCENES } from "../../config";

export default class UIScene extends Phaser.Scene {
	constructor() {
		super(SCENES.UI);
	}

	preload() {
		this.add.text(0, 0, "UI Scene", {
			font: "36px gameFont",
			fill: "#000",
		});
	}
}
