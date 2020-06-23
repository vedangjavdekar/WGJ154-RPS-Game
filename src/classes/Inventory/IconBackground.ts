import GameEventEmitter, { GAME_EVENTS } from "../GameEvents";
import InventoryManager from "./Inventorymanager";

class Icons extends Phaser.GameObjects.Container {
	protected static GEventEmitter: GameEventEmitter;
	protected buttonImage: Phaser.GameObjects.Sprite;
	protected buttonZone: Phaser.GameObjects.Zone;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		if (!Icons.GEventEmitter) {
			Icons.GEventEmitter = GameEventEmitter.getInstance();
		}
		super(scene, x, y);
		this.buttonImage = scene.add.sprite(0, 0, "c_inventoryicon", 0);
		this.buttonZone = scene.add
			.zone(0, 0, this.buttonImage.width, this.buttonImage.height)
			.setOrigin(0.5);

		this.add([this.buttonImage, this.buttonZone]);
		scene.add.existing(this);
	}

	enablePointerInteraction() {
		this.buttonZone.setInteractive();
		this.buttonZone.on("pointerover", () => {
			this.buttonImage.setFrame(1);
		});

		this.buttonZone.on("pointerout", () => {
			this.buttonImage.setFrame(0);
		});
	}
}

export class IconBackground extends Icons {
	public static selectedIndex: number = -1;

	private id: number;
	constructor(scene: Phaser.Scene, x: number, y: number, id: number) {
		super(scene, x, y);
		this.id = id;
		this.buttonImage.setTexture("c_inventoryicon", 0);
		Icons.GEventEmitter.addListener(
			GAME_EVENTS.c_changeSelection,
			this.onchangeSelection,
			this
		);
		this.setPointerCallbacks();
	}
	setPointerCallbacks() {
		this.buttonZone.on("pointerover", () => {
			if (IconBackground.selectedIndex !== this.id) {
				this.buttonImage.setFrame(1);
			}
		});

		this.buttonZone.on("pointerout", () => {
			if (IconBackground.selectedIndex !== this.id) {
				this.buttonImage.setFrame(0);
			}
		});

		this.buttonZone.on("pointerdown", () => {
			IconBackground.selectedIndex = this.id;
			this.buttonImage.setFrame(2);
			Icons.GEventEmitter.emit(GAME_EVENTS.c_changeSelection, this.id);
			console.log("selected index: " + this.id);
		});
	}
	enablePointerInteraction() {
		this.buttonZone.setInteractive();
	}

	disablePointerInteractive() {
		this.buttonZone.disableInteractive();
	}

	onchangeSelection(id: number) {
		if (IconBackground.selectedIndex !== this.id) {
			this.buttonImage.setFrame(0);
		}
	}
}
export class CrafingIconBackground extends Icons {
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y);
		this.buttonImage.setTexture("c_crafticon", 0);
	}
}
