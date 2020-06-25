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
	private config: IButtonConfig;

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
		this.config = config;
		this.animateButton = config.image !== "";
		this.animateText = text !== "";

		let containerChildren = [];
		let zoneWidth = 0;
		let zoneHeight = 0;

		if (this.animateText) {
			this.buttonText = scene.add
				.text(0, config.offset_y || 0, text, {
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
			this.addEvents();
			//Pointer events
			this.buttonZone.on("pointerover", () => {
				if (clickOnce) {
					if (!this.canClick) return;
				}
				this.setButtonState(1);
			});

			this.buttonZone.on("pointerout", () => {
				if (clickOnce) {
					if (!this.canClick) return;
				}
				this.setButtonState(0);
			});

			this.buttonZone.on("pointerdown", () => {
				if (clickOnce) {
					if (!this.canClick) return;
					this.canClick = false;
				}
				this.setButtonState(2);
				Button.GEventEmitter.emit(GAME_EVENTS.buttonClick, this.id);
			});
		}
	}
	addEvents() {
		Button.GEventEmitter.addListener(
			GAME_EVENTS.renableButton,
			this.onRenableButton,
			this
		);
		Button.GEventEmitter.addListener(
			GAME_EVENTS.disableButton,
			this.onDisableButton,
			this
		);
	}

	onRenableButton(id: string | number) {
		if (this.id === id) {
			console.log("Renabled: " + this.id);
			this.setButtonState(0);
			this.canClick = true;
		}
	}
	onDisableButton(id: string | number) {
		if (this.id === id) {
			console.log("Disabled: " + this.id);
			this.canClick = false;
		}
	}

	setButtonState(state: number) {
		switch (state) {
			case 0: {
				//Check if text exists
				if (this.animateText) {
					this.buttonText.setFontSize(this.config.fontSize);
					if (this.config.animatedText) {
						this.buttonText.setFill(
							this.config.animatedText.normal
						);
					}
				}
				//Check if image exists
				if (this.animateButton) {
					this.buttonImage.setFrame(0);
				}
				break;
			}
			case 1: {
				//Check if text exists
				if (this.animateText) {
					this.buttonText.setFontSize(this.config.fontSize + 4);
					if (this.config.animatedText) {
						this.buttonText.setFill(
							this.config.animatedText.highlighted
						);
					}
				}
				//Check if image exists
				if (this.animateButton) {
					this.buttonImage.setFrame(1);
				}
				break;
			}
			case 2: {
				//Check if text exists
				if (this.animateText) {
					this.buttonText.setFontSize(this.config.fontSize + 2);
					if (this.config.animatedText) {
						this.buttonText.setFill(
							this.config.animatedText.pressed
						);
					}
				}
				//Check if image exists
				if (this.animateButton) {
					this.buttonImage.setFrame(2);
				}
				break;
			}
		}
	}
}
