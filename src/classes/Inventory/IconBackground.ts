import GameEventEmitter, { GAME_EVENTS } from "../GameEvents";
import CraftingUIScene from "../../scenes/Crafting/CraftingUIScene";
import { SOUNDS } from "../../sounds";

export class Icon extends Phaser.GameObjects.Container {
	static GEventEmitter: GameEventEmitter;
	protected buttonImage: Phaser.GameObjects.Sprite;
	protected buttonZone: Phaser.GameObjects.Zone;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		if (!Icon.GEventEmitter) {
			Icon.GEventEmitter = GameEventEmitter.getInstance();
		}
		super(scene, x, y);
		this.buttonImage = scene.add.sprite(0, 0, "c_inventoryicon", 0);
		this.buttonZone = scene.add
			.zone(0, 0, this.buttonImage.width, this.buttonImage.height)
			.setOrigin(0.5);

		this.add([this.buttonImage, this.buttonZone]);
		scene.add.existing(this);
	}
}

export class IconBackground extends Icon {
	public static selectedIndex: number = -1;
	public static iconDragged: boolean = false;
	private id: number;
	constructor(scene: Phaser.Scene, x: number, y: number, id: number) {
		super(scene, x, y);
		this.id = id;
		this.buttonImage.setTexture("c_inventoryicon", 0);
		Icon.GEventEmitter.addListener(
			GAME_EVENTS.c_changeSelection,
			this.onchangeSelection,
			this
		);
		this.setPointerCallbacks();
	}
	setPointerCallbacks() {
		this.buttonZone.on("pointerover", () => {
			if (CraftingUIScene.disableInventory) return;
			if (IconBackground.iconDragged) return;
			if (IconBackground.selectedIndex !== this.id) {
				this.buttonImage.setFrame(1);
			}
		});

		this.buttonZone.on("pointerout", () => {
			if (CraftingUIScene.disableInventory) return;
			if (IconBackground.iconDragged) return;
			if (IconBackground.selectedIndex !== this.id) {
				this.buttonImage.setFrame(0);
			}
		});

		this.buttonZone.on("pointerdown", () => {
			if (CraftingUIScene.disableInventory) return;
			Icon.GEventEmitter.emit(GAME_EVENTS.sfx_playSound, SOUNDS.BUTTON);
			IconBackground.iconDragged = true;
			Icon.GEventEmitter.emit(GAME_EVENTS.c_dragIconPointerDown, this.id);
			if (IconBackground.selectedIndex !== this.id) {
				IconBackground.selectedIndex = this.id;
				Icon.GEventEmitter.emit(GAME_EVENTS.c_changeSelection, this.id);
			}
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
		} else {
			this.buttonImage.setFrame(2);
		}
	}
}
export class CrafingIconBackground extends Icon {
	id: string | number;
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		id: string | number
	) {
		super(scene, x, y);
		this.id = id;
		this.buttonImage.setTexture("c_crafticon", 0);
	}

	setPointerCallbacks() {
		this.buttonZone.setInteractive();
		this.buttonZone.on("pointerover", () => {
			if (CraftingUIScene.disableInventory) return;
			if (IconBackground.iconDragged) {
				this.buttonImage.setFrame(1);
				Icon.GEventEmitter.emit(
					GAME_EVENTS.c_craftingIconPointerOver,
					this.id
				);
			}
		});

		this.buttonZone.on("pointerout", () => {
			if (CraftingUIScene.disableInventory) return;
			this.buttonImage.setFrame(0);
			Icon.GEventEmitter.emit(
				GAME_EVENTS.c_craftingIconPointerOut,
				this.id
			);
		});
	}

	iconPlaced() {
		this.buttonImage.setFrame(0);
	}
}

export class BattleIconBackground extends Icon {
	public static selectedIndex: number = -1;
	public static selectedCategory: number = -1;
	public static iconDragged: boolean = false;

	id: number;
	category: number;
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		id: number,
		category: number = 0
	) {
		super(scene, x, y);
		this.id = id;
		this.category = category;
		this.buttonImage.setTexture("b_ui_button", 0);
		Icon.GEventEmitter.addListener(
			GAME_EVENTS.sb_changeSelection,
			this.onchangeSelection,
			this
		);
		this.setPointerCallbacks();
	}
	setPointerCallbacks() {
		this.buttonZone.on("pointerover", () => {
			if (CraftingUIScene.disableInventory) return;
			if (BattleIconBackground.iconDragged) return;
			if (BattleIconBackground.selectedIndex !== this.id) {
				this.buttonImage.setFrame(1);
			}
		});

		this.buttonZone.on("pointerout", () => {
			if (CraftingUIScene.disableInventory) return;
			if (BattleIconBackground.iconDragged) return;
			if (BattleIconBackground.selectedIndex !== this.id) {
				this.buttonImage.setFrame(0);
			}
		});

		this.buttonZone.on("pointerdown", () => {
			if (CraftingUIScene.disableInventory) return;
			Icon.GEventEmitter.emit(GAME_EVENTS.sfx_playSound, SOUNDS.BUTTON);
			BattleIconBackground.iconDragged = true;
			Icon.GEventEmitter.emit(GAME_EVENTS.c_dragIconPointerDown, this.id);
			if (BattleIconBackground.selectedIndex !== this.id) {
				BattleIconBackground.selectedIndex = this.id;
				Icon.GEventEmitter.emit(GAME_EVENTS.c_changeSelection, this.id);
			}
		});
	}
	enablePointerInteraction() {
		this.buttonZone.setInteractive();
	}

	disablePointerInteractive() {
		this.buttonZone.disableInteractive();
	}

	onchangeSelection(id: number) {
		if (
			BattleIconBackground.selectedIndex !== this.id &&
			BattleIconBackground.selectedCategory !== this.category
		) {
			this.buttonImage.setFrame(0);
		} else {
			this.buttonImage.setFrame(2);
		}
	}
}
