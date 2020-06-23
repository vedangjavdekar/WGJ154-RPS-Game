import IButtonConfig from "./IButtonConfig";
import GameEventEmitter, { GAME_EVENTS } from "../GameEvents";
// Custom Button Class
export default class Button extends Phaser.GameObjects.Container {
	private static GEventEmitter: GameEventEmitter;
	private buttonImage: Phaser.GameObjects.Sprite;
	private buttonText: Phaser.GameObjects.Text;
	private buttonZone: Phaser.GameObjects.Zone;
	private animateButton: boolean;
	private animateText: boolean;
	private canClick: boolean;
	private id: string | number;
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		button_id: string | number,
		text: string,
		config: IButtonConfig,
		clickOnce = false
	) {
		if (!Button.GEventEmitter) {
			Button.GEventEmitter = GameEventEmitter.getInstance();
		}
		super(scene, x, y);

		this.id = button_id;
		this.canClick = true;
		this.animateButton = config.image !== "";
		this.animateText = text !== "";

		let containerChildren = [];
		let zoneWidth = 0;
		let zoneHeight = 0;

		if (this.animateText) {
			this.buttonText = scene.add
				.text(0, 0, text, {
					font: `${config.fontSize}px gameFont`,
					fill: config.fontColor,
				})
				.setOrigin(0.5);
		}

		if (this.animateButton) {
			this.buttonImage = scene.add.sprite(0, 0, config.image, 0);
			containerChildren.push(this.buttonImage);
			zoneWidth = this.buttonImage.displayWidth;
			zoneHeight = this.buttonImage.displayHeight;
		} else if (this.animateText) {
			zoneWidth = this.buttonText.displayWidth;
			zoneHeight = this.buttonText.displayHeight;
		}

		if (zoneWidth !== 0 && zoneHeight !== 0) {
			this.buttonZone = scene.add
				.zone(0, 0, zoneWidth, zoneHeight)
				.setOrigin(0.5)
				.setInteractive();
			containerChildren.push(this.buttonZone);
		}
		if (this.animateText) {
			containerChildren.push(this.buttonText);
		}

		if (containerChildren.length > 0) {
			this.add(containerChildren);
			scene.add.existing(this);

			//Pointer events
			this.buttonZone.on("pointerover", () => {
				if (clickOnce) {
					if (!this.canClick) return;
				}
				//Check if text exists
				if (this.animateText) {
					this.buttonText.setFontSize(config.fontSize + 4);
				}
				//Check if image exists
				if (this.animateButton) {
					this.buttonImage.setFrame(1);
				}
			});

			this.buttonZone.on("pointerout", () => {
				if (clickOnce) {
					if (!this.canClick) return;
				}
				//Check if text exists
				if (this.animateText) {
					this.buttonText.setFontSize(config.fontSize);
				}
				//Check if image exists
				if (this.animateButton) {
					this.buttonImage.setFrame(0);
				}
			});

			this.buttonZone.on("pointerdown", () => {
				if (clickOnce) {
					if (!this.canClick) return;
					this.canClick = false;
				}
				//Check if text exists
				if (this.animateText) {
					this.buttonText.setFontSize(config.fontSize + 2);
				}
				//Check if image exists
				if (this.animateButton) {
					this.buttonImage.setFrame(2);
				}
				Button.GEventEmitter.emit(GAME_EVENTS.buttonClick, this.id);
			});
		}
	}
}
