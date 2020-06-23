import { SCENES, gameScreen } from "../config";
import { ASSET_PATHS } from "../assetpaths";

export default class BootScene extends Phaser.Scene {
	constructor() {
		super(SCENES.BOOT);
	}

	preload() {
		//Load the preloader images
		this.load.spritesheet("loadingbar", ASSET_PATHS.SPRITES.LOADINGBAR, {
			frameWidth: 64,
			frameHeight: 16,
		});
	}

	create() {
		gameScreen.width = this.game.canvas.width;
		gameScreen.height = this.game.canvas.height;
		this.scene.start(SCENES.LOAD);
	}
}
