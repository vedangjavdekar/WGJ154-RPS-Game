import SB_IconBackground from "./SB_IconBackground";
import GameEventEmitter, { GAME_EVENTS } from "../GameEvents";
import UIScene from "../../scenes/Battle/UIScene";

export const ScrollBarIds = {
	attack: "sb_attack",
	defense: "sb_defense",
};

const ARROW_DISTANCE = 16;
const TILESIZE = 64;
const SPEARTION_X = 0;
const ICONSCALE = 1.5;
const ITEMS_VISIBLE = 5;

export default class SB_ScrollBar extends Phaser.GameObjects.Container {
	static GEventEmitter: GameEventEmitter;

	id: string | number;

	//components
	/**
	 * 2 arrow buttons
	 * background image
	 * geometric mask
	 * items container
	 * icon backgrounds
	 * item icons
	 */
	private arrowLeft: Phaser.GameObjects.Image;
	private arrowRight: Phaser.GameObjects.Image;

	private background: Phaser.GameObjects.Image;
	private items: Phaser.GameObjects.Container;

	tweenInProgress: boolean;
	selectedIndex: number;
	activeParent: boolean;
	scrollOffset: number;
	private itemArray: Array<number>;
	public static scrollbarsEnabled: boolean = true;
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		id: string | number,
		itemArray: Array<number>
	) {
		super(scene, x, y);

		this.id = id;
		this.scrollOffset = 0;
		this.selectedIndex = -1;
		//this.itemArray = itemArray;
		this.background = scene.add.image(0, 0, "b_ui_cardspanel");

		//This will come from user/////
		this.itemArray = [0, 2, 3, 4, 1, 1, 3, 5];
		//////////////////////////////
		this.items = scene.add.container(
			-this.background.width / 2 + TILESIZE / 2,
			0
		);
		for (let i = 0; i < this.itemArray.length; i++) {
			const tempContainer = scene.add.container(
				i * (TILESIZE + SPEARTION_X),
				0
			);
			const iconbackground = new SB_IconBackground(scene, 0, 0, i, this);
			if (i < this.scrollOffset + ITEMS_VISIBLE) {
				iconbackground.enablePointerInteraction();
			} else {
				iconbackground.disablePointerInteractive();
			}
			const icon = scene.add
				.sprite(0, 0, "gameobjects", this.itemArray[i])
				.setScale(ICONSCALE);
			tempContainer.add([iconbackground, icon]);
			this.items.add(tempContainer);
		}
		const shape1 = scene.make
			.graphics({})
			.fillRect(
				this.x - this.background.width / 2,
				this.y - this.background.height / 2,
				this.background.width,
				this.background.height
			);
		const geomask1 = shape1.createGeometryMask();
		this.items.setMask(geomask1);

		//////////// ARROWs \\\\\\\\\\\\\\\
		this.arrowLeft = scene.add
			.image(
				-(this.background.width / 2 + ARROW_DISTANCE),
				0,
				"b_ui_arrowbutton"
			)
			.setFlipX(true);
		this.arrowRight = scene.add.image(
			this.background.width / 2 + ARROW_DISTANCE,
			0,
			"b_ui_arrowbutton"
		);
		this.arrowLeft.setInteractive();
		this.arrowRight.setInteractive();
		this.changeOffset(0);
		this.arrowLeft
			.on("pointerover", () => {
				if (!SB_ScrollBar.scrollbarsEnabled) return;
				this.arrowLeft.setScale(1.1);
			})
			.on("pointerout", () => {
				if (!SB_ScrollBar.scrollbarsEnabled) return;
				this.arrowLeft.setScale(1);
			})
			.on("pointerdown", () => {
				if (!SB_ScrollBar.scrollbarsEnabled) return;
				if (this.tweenInProgress) return;
				this.tweenInProgress = true;
				this.selectedIndex = -1;
				SB_ScrollBar.GEventEmitter.emit(
					GAME_EVENTS.sb_changeSelection,
					this.id
				);
				this.arrowLeft.setScale(1.05);
				this.changeOffset(-1);
			});

		this.arrowRight
			.on("pointerover", () => {
				if (!SB_ScrollBar.scrollbarsEnabled) return;
				this.arrowRight.setScale(1.1);
			})
			.on("pointerout", () => {
				if (!SB_ScrollBar.scrollbarsEnabled) return;
				this.arrowRight.setScale(1);
			})
			.on("pointerdown", () => {
				if (!SB_ScrollBar.scrollbarsEnabled) return;
				if (this.tweenInProgress) return;
				this.tweenInProgress = true;
				this.selectedIndex = -1;
				SB_ScrollBar.GEventEmitter.emit(
					GAME_EVENTS.sb_changeSelection,
					this.id
				);
				this.arrowRight.setScale(1.05);
				this.changeOffset(1);
			});

		this.add([
			this.background,
			this.arrowLeft,
			this.arrowRight,
			this.items,
		]);
		scene.add.existing(this);
		this.addEvents();
	}
	public static clearEvents() {
		if (!SB_ScrollBar.GEventEmitter) {
			SB_ScrollBar.GEventEmitter = GameEventEmitter.getInstance();
		}
		SB_ScrollBar.GEventEmitter.clearEvent(GAME_EVENTS.gamePause);
		SB_ScrollBar.GEventEmitter.clearEvent(GAME_EVENTS.sb_changeSelection);
		SB_ScrollBar.GEventEmitter.clearEvent(
			GAME_EVENTS.sb_buttonEnableEvents
		);
		SB_ScrollBar.GEventEmitter.clearEvent(GAME_EVENTS.sb_addElement);

		SB_ScrollBar.GEventEmitter.addListener(
			GAME_EVENTS.gamePause,
			SB_ScrollBar.onGamePause
		);
	}

	private static onGamePause(pasued: boolean) {
		SB_ScrollBar.scrollbarsEnabled = !pasued;
		console.log("game pause event: " + SB_ScrollBar.scrollbarsEnabled);
	}

	addEvents() {
		/*
		SB_ScrollBar.GEventEmitter.addListener(
			GAME_EVENTS.sb_changeSelection,
			this.onChangeSelection,
			this
		);
		*/

		SB_ScrollBar.GEventEmitter.addListener(
			GAME_EVENTS.sb_removeElement,
			this.onRemoveElement,
			this
		);
		SB_ScrollBar.GEventEmitter.addListener(
			GAME_EVENTS.sb_addElement,
			this.onAddElement,
			this
		);
	}

	//To Change the interactivity of the icons as while using masks, zones were deactivated
	changeInteractiveIcons() {
		for (let i = 0; i < this.items.length; i++) {
			if (i < this.scrollOffset * ITEMS_VISIBLE) {
				((this.items.list[i] as Phaser.GameObjects.Container)
					.list[0] as SB_IconBackground).disablePointerInteractive();
			} else if (i < this.scrollOffset * ITEMS_VISIBLE + ITEMS_VISIBLE) {
				((this.items.list[i] as Phaser.GameObjects.Container)
					.list[0] as SB_IconBackground).enablePointerInteraction();
			} else {
				((this.items.list[i] as Phaser.GameObjects.Container)
					.list[0] as SB_IconBackground).disablePointerInteractive();
			}
		}
	}

	//Inventory Change Section function
	changeOffset(increment: number) {
		const maxLimit = Phaser.Math.Clamp(
			Math.ceil(this.items.length / ITEMS_VISIBLE - 1),
			0,
			Infinity
		);

		if (this.scrollOffset > maxLimit) {
			increment = maxLimit - this.scrollOffset;
		}
		const newOffset = Phaser.Math.Clamp(
			-this.scrollOffset - increment,
			-maxLimit,
			0
		);
		if (increment !== 0) {
			this.scene.tweens.add({
				targets: this.items,
				duration: 300,
				ease: "cubic.inout",
				x: {
					from:
						-this.scrollOffset *
							ITEMS_VISIBLE *
							(TILESIZE + SPEARTION_X) -
						this.background.width / 2 +
						TILESIZE / 2,
					to:
						newOffset * ITEMS_VISIBLE * (TILESIZE + SPEARTION_X) -
						this.background.width / 2 +
						TILESIZE / 2,
				},
				loop: 0,
				onComplete: () => {
					this.tweenInProgress = false;
					this.scrollOffset = -newOffset;
					if (this.scrollOffset == 0) {
						this.arrowLeft.disableInteractive().setVisible(false);
					} else {
						this.arrowLeft.setInteractive().setVisible(true);
					}
					if (this.scrollOffset == maxLimit) {
						this.arrowRight.disableInteractive().setVisible(false);
					} else {
						this.arrowRight.setInteractive().setVisible(true);
					}
					this.changeInteractiveIcons();
				},
			});
		} else {
			if (this.scrollOffset == 0) {
				this.arrowLeft.disableInteractive().setVisible(false);
			} else {
				this.arrowLeft.setInteractive().setVisible(true);
			}
			if (this.scrollOffset == maxLimit) {
				this.arrowRight.disableInteractive().setVisible(false);
			} else {
				this.arrowRight.setInteractive().setVisible(true);
			}
			this.changeInteractiveIcons();
		}
	}

	/*
	onChangeSelection(id: string | number) {
		if (SB_IconBackground.iconDrag) return;
		if (this.id === id) {
		} else {
			this.activeParent = false;
			this.selectedIndex = -1;
		}
		SB_IconBackground.iconDrag = true;
		console.log({
			id: this.id,
			activeParent: this.activeParent,
			selectedIndex: this.selectedIndex,
		});
	}
	*/
	onRemoveElement() {
		if (this.activeParent) {
			console.log("in remove item event: parent active: " + this.id);
			this.removeItem(this.selectedIndex);
		}
	}

	getItemIdbyIndex(index: number): number {
		if (index < this.itemArray.length) {
			return this.itemArray[index];
		} else {
			return -1;
		}
	}

	removeItem(index: number) {
		if (this.selectedIndex === -1) return;
		console.log(this.itemArray);
		this.itemArray.splice(index, 1);
		this.items.removeAt(index, true);
		this.itemRemoveTween(index);
		this.changeOffset(0);
		console.log(this.itemArray);
	}

	itemRemoveTween(startIndex: number) {
		this.selectedIndex = -1;
		let targets = this.items.list.filter(
			(item, index) => index >= startIndex
		);
		this.scene.tweens.add({
			targets,
			duration: 200,
			x: `-=${TILESIZE}`,
			ease: "Cubic.inOut",
			onComplete: (tween: Phaser.Tweens.Tween) => {
				tween.remove();
			},
		});
		for (let i = 0; i < this.itemArray.length; i++) {
			const sb_bg = (this.items.list[i] as Phaser.GameObjects.Container)
				.list[0] as SB_IconBackground;
			sb_bg.id = i;
			/*
			const img1 = (this.items.list[i] as Phaser.GameObjects.Container)
				.list[1] as Phaser.GameObjects.Sprite;
			img1.setFrame(this.itemArray[i]);
			*/
		}
		this.changeOffset(0);
	}

	onAddElement(id: string | number, itemId: number) {
		if (this.id === id) {
			SB_IconBackground.disableIcons = true;
			this.itemArray.push(itemId);
			const iconbg = new SB_IconBackground(
				this.scene,
				0,
				0,
				this.items.length,
				this
			);
			if (this.items.length < this.scrollOffset + ITEMS_VISIBLE) {
				iconbg.enablePointerInteraction();
			} else {
				iconbg.disablePointerInteractive();
			}
			const icon = this.scene.add
				.sprite(0, 0, "gameobjects", itemId)
				.setScale(ICONSCALE);
			const tempContainer = this.scene.add.container(
				this.items.length * (TILESIZE + SPEARTION_X),
				0,
				[iconbg, icon]
			);
			tempContainer.setAlpha(0);
			this.items.add(tempContainer);
			const maxOffsetLimit = Phaser.Math.Clamp(
				Math.ceil(this.items.length / ITEMS_VISIBLE - 1),
				0,
				Infinity
			);
			const deltaOffset = maxOffsetLimit - this.scrollOffset;
			this.changeOffset(deltaOffset);
			this.scene.tweens.add({
				targets: tempContainer,
				delay: 300,
				duration: 200,
				scale: { from: 0, to: 1 },
				alpha: { from: 0, to: 1 },
				ease: "Quintic.easeInOut",
				onComplete: (tween: Phaser.Tweens.Tween) => {
					tween.remove();
					SB_IconBackground.disableIcons = false;
					if (!SB_IconBackground.iconDrag) {
						this.selectedIndex = this.items.length - 1;
						SB_ScrollBar.GEventEmitter.emit(
							GAME_EVENTS.sb_changeSelection,
							this.id
						);
					}
				},
			});
		}
	}
}
