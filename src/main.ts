import "phaser";

export default class Demo extends Phaser.Scene {
	constructor() {
		super("demo");
	}

	preload() {}

	create() {
		const logo = this.add.text(400, 70, "logo", {
			font: "20px monospace",
			fill: "#232323",
		});
	}
}

const config = {
	type: Phaser.AUTO,
	backgroundColor: "#cdcdcd",
	width: 800,
	height: 600,
	scene: Demo,
};

const game = new Phaser.Game(config);
