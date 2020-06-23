import { SCENES, gameScreen, CraftingConfig } from "../../config";
import CraftingPalette from "../../classes/ColorPalettes/CraftingPalette";
import Button from "../../classes/Button/Button";
import IButtonConfig, { ButtonIds } from "../../classes/Button/IButtonConfig";
import GameEventEmitter, { GAME_EVENTS } from "../../classes/GameEvents";
import InventoryManager from "../../classes/Inventory/Inventorymanager";
import InventoryItem from "../../classes/Inventory/InventoryItem";
import {
	IconBackground,
	CrafingIconBackground,
} from "../../classes/Inventory/IconBackground";
import StatCard from "../../classes/StatCard";
import { SOUNDS } from "../SFXScene";

/*********** CONSTANTS ****************/

const OBJECTS_DISPLAYED = 5;
const INVENTORY_ITEM_SEPARATION = 148;
const INVENTORY_OFFSET_X = 152;
const INVENTORY_OFFSET_Y = 615;
export const SPRITE_SCALE_UP = 5;

/******************************************/

export default class CraftingUIScene extends Phaser.Scene {
	public static disableInventory: boolean;

	private GEventEmitter: GameEventEmitter;
	private inventoryManager: InventoryManager;

	//Inventory variables
	private itemContainer: Phaser.GameObjects.Container;
	private inventoryOffset: number;
	private arrowLeft: Phaser.GameObjects.Image;
	private arrowRight: Phaser.GameObjects.Image;
	private tweenInProgress: boolean;
	//Stat Card
	private statCard: StatCard;
	//DragIcon
	private dragIcon: Phaser.GameObjects.Sprite;
	private pointerDown: boolean;

	//Element1 and 2 Icons
	private craftingIcon1: CrafingIconBackground;
	private craftingIcon2: CrafingIconBackground;
	private element1: Phaser.GameObjects.Sprite;
	private element2: Phaser.GameObjects.Sprite;
	private result: Phaser.GameObjects.Sprite;
	private selectedCraftingIcon: string | number;
	private itemsFilled: number[];

	//userFeedbackText
	private craftResultFeedbackText: Phaser.GameObjects.Text;

	constructor() {
		super(SCENES.CRAFTING_UI);
	}

	init() {
		this.GEventEmitter = GameEventEmitter.getInstance();
		const clearEvents = [
			GAME_EVENTS.buttonClick,
			GAME_EVENTS.c_changeSelection,
			GAME_EVENTS.c_dragIconPointerDown,
			GAME_EVENTS.c_craftingIconPointerOver,
			GAME_EVENTS.c_craftingIconPointerOut,
		];

		for (let event in clearEvents) {
			console.log("clearing:" + clearEvents[event]);
			this.GEventEmitter.clearEvent(clearEvents[event]);
		}
		this.inventoryManager = InventoryManager.getInstance();
	}

	preload() {
		this.cameras.main.setBackgroundColor(CraftingPalette.background.css);
		this.selectedCraftingIcon = null;
		IconBackground.selectedIndex = -1;
		IconBackground.iconDragged = false;
		this.itemsFilled = [];
		CraftingUIScene.disableInventory = false;
	}

	create() {
		//#region UPPER UI SECTION
		this.add.image(gameScreen.width / 2, 0, "c_banner").setOrigin(0.5, 0);
		this.add.text(40, 18, "Crafting", {
			font: `${CraftingConfig.title.fontSize}px gameFont`,
			fill: CraftingPalette.uiText.css,
		});

		const buttonConfig: IButtonConfig = {
			image: "c_exit_button",
		};
		const exitButton = new Button(
			this,
			gameScreen.width - 124,
			48,
			ButtonIds.Crafing.exit,
			"",
			buttonConfig,
			true
		);
		//#endregion

		//#region MID UI SECTION
		this.craftResultFeedbackText = this.add
			.text(453, 150, "You have already found this item", {
				font: `${CraftingConfig.cardValue.fontSize}px gameFont`,
				fill: CraftingPalette.cardValue.css,
			})
			.setOrigin(0.5)
			.setVisible(false);

		const elem1 = this.add
			.text(194, 215, "Elem1", {
				font: `${CraftingConfig.headings.fontSize}px gameFont`,
				fill: CraftingPalette.uiText.css,
			})
			.setOrigin(0.5);
		this.craftingIcon1 = new CrafingIconBackground(
			this,
			194,
			316,
			ButtonIds.Crafing.craftingIcon1
		);
		this.craftingIcon1.setPointerCallbacks();
		const elem2 = this.add
			.text(453, 215, "Elem2", {
				font: `${CraftingConfig.headings.fontSize}px gameFont`,
				fill: CraftingPalette.uiText.css,
			})
			.setOrigin(0.5);
		this.craftingIcon2 = new CrafingIconBackground(
			this,
			453,
			316,
			ButtonIds.Crafing.craftingIcon2
		);
		this.craftingIcon2.setPointerCallbacks();
		const resultText = this.add
			.text(698, 215, "Result", {
				font: `${CraftingConfig.headings.fontSize}px gameFont`,
				fill: CraftingPalette.uiText.css,
			})
			.setOrigin(0.5);
		const result = new CrafingIconBackground(
			this,
			698,
			316,
			ButtonIds.Crafing.result
		);

		const plus = this.add.image(325, 316, "c_plus");
		const equalto = this.add.image(576, 316, "c_equalto");
		this.element1 = this.add
			.sprite(194, 316, "gameobjects")
			.setOrigin(0.5)
			.setScale(SPRITE_SCALE_UP)
			.setVisible(false);
		this.element2 = this.add
			.sprite(453, 316, "gameobjects")
			.setOrigin(0.5)
			.setScale(SPRITE_SCALE_UP)
			.setVisible(false);
		this.result = this.add
			.sprite(698, 316, "gameobjects")
			.setOrigin(0.5)
			.setScale(SPRITE_SCALE_UP)
			.setVisible(false);

		this.dragIcon = this.add
			.sprite(0, 0, "gameobjects", 0)
			.setScale(SPRITE_SCALE_UP)
			.setOrigin(0.5)
			.setVisible(false);
		//#endregion

		//#region  LOWER UI SECTION
		this.add.image(448, 615, "c_inventory_panel");
		this.itemContainer = this.add.container(
			INVENTORY_OFFSET_X,
			INVENTORY_OFFSET_Y
		);

		const indices = this.inventoryManager.getCraftedIndices();
		console.log(indices);

		this.inventoryOffset = 0;
		for (let i = 0; i < indices.length; i++) {
			const iconbg = new IconBackground(this, 0, 0, i);
			if (i < this.inventoryOffset + OBJECTS_DISPLAYED) {
				iconbg.enablePointerInteraction();
			} else {
				iconbg.disablePointerInteractive();
			}
			const icon = new InventoryItem(this, 0, 0, indices[i]);
			const tempContainer = this.add.container(
				i * INVENTORY_ITEM_SEPARATION,
				0,
				[iconbg, icon]
			);
			this.itemContainer.add(tempContainer);
		}
		const shape1 = this.make.graphics({}).fillRect(88, 551, 730, 130); // fix the w/h here to be what you need
		const geomask1 = shape1.createGeometryMask();
		this.itemContainer.setMask(geomask1);

		//Arrows
		this.arrowLeft = this.add.image(53, 615, "c_arrow_left");
		this.arrowRight = this.add.image(841, 615, "c_arrow_right");
		this.arrowLeft.setInteractive();
		this.arrowRight.setInteractive();
		this.changeOffset(0);
		this.arrowLeft
			.on("pointerover", () => {
				this.arrowLeft.setScale(1.1);
			})
			.on("pointerout", () => {
				this.arrowLeft.setScale(1);
			})
			.on("pointerdown", () => {
				if (this.tweenInProgress) return;
				this.tweenInProgress = true;
				IconBackground.selectedIndex = -1;
				this.GEventEmitter.emit(GAME_EVENTS.c_changeSelection, -1);
				this.arrowLeft.setScale(1.05);
				this.changeOffset(-1);
			});

		this.arrowRight
			.on("pointerover", () => {
				this.arrowRight.setScale(1.1);
			})
			.on("pointerout", () => {
				this.arrowRight.setScale(1);
			})
			.on("pointerdown", () => {
				if (this.tweenInProgress) return;
				this.tweenInProgress = true;
				IconBackground.selectedIndex = -1;
				this.GEventEmitter.emit(GAME_EVENTS.c_changeSelection, -1);
				this.arrowRight.setScale(1.05);
				this.changeOffset(1);
			});

		//Text
		this.add
			.text(448, 500, "Inventory", {
				font: `${CraftingConfig.headings.fontSize}px gameFont`,
				fill: CraftingPalette.uiText.css,
			})
			.setOrigin(0.5);

		//#endregion

		//#region SIDEBAR UI SECTION
		this.statCard = new StatCard(this, 1072, 407);
		this.statCard.hide();
		//#endregion

		//#region EVENT LISTENSERS
		this.GEventEmitter.addListener(
			GAME_EVENTS.buttonClick,
			this.onButtonClicked,
			this
		);
		this.GEventEmitter.addListener(
			GAME_EVENTS.c_changeSelection,
			this.onSelectedIndexChanged,
			this
		);
		this.GEventEmitter.addListener(
			GAME_EVENTS.c_dragIconPointerDown,
			this.onDragIconPointerDown,
			this
		);
		this.GEventEmitter.addListener(
			GAME_EVENTS.c_craftingIconPointerOver,
			this.onCraftingIconPointerOver,
			this
		);
		this.GEventEmitter.addListener(
			GAME_EVENTS.c_craftingIconPointerOut,
			this.onCraftingIconPointerOut,
			this
		);

		this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
			if (this.pointerDown) {
				if (!this.dragIcon.visible) this.dragIcon.setVisible(true);
				this.children.bringToTop(this.dragIcon);
				this.dragIcon.setPosition(pointer.worldX, pointer.worldY);
			}
		});
		this.input.on("pointerup", () => {
			if (this.selectedCraftingIcon !== null) {
				console.log(this.selectedCraftingIcon);
				this.setCraftingIcon(this.selectedCraftingIcon);
				if (this.itemsFilled.length == 2) {
					console.log("Items full check crafting!");
					const elem1id = parseInt(this.element1.frame.name);
					const elem2id = parseInt(this.element2.frame.name);
					let elements = [
						Math.min(elem1id, elem2id),
						Math.max(elem1id, elem2id),
					];

					const newItemId = this.inventoryManager.craftNewItem(
						elements
					);
					this.craftResultTween(newItemId);

					/* TESTING
					const newItemIds = this.inventoryManager.CraftNewItemReturnMultiple(
						elements
					);
					newItemIds.forEach((newItemId) => {
						this.craftResultTween(newItemId);
					});
					 TESTING */
				}
			} else {
				this.dragIcon.setPosition(0, 0).setVisible(false);
			}
			this.pointerDown = false;
			IconBackground.iconDragged = false;
			this.selectedCraftingIcon = null;
		});
		//#endregion
		this.cameras.main.fadeIn(500);
	}

	onButtonClicked(id: string | number) {
		switch (id) {
			case ButtonIds.Crafing.exit: {
				this.onExitClicked();
				break;
			}
		}
	}

	onExitClicked() {
		this.cameras.main.fadeOut(500);
		this.cameras.main.once("camerafadeoutcomplete", () => {
			this.scene.start(SCENES.MENU);
		});
	}

	onSelectedIndexChanged(id: number) {
		if (!this.statCard.isOnScreen && id !== -1) {
			this.statCard.fillCardData(id);
			this.statCard.showTween();
			this.GEventEmitter.emit(
				GAME_EVENTS.sfx_playSound,
				SOUNDS.CARDSWIPE,
				{ volume: 0.25 }
			);
		} else if (id !== -1) {
			this.statCard.changeCardTween(id);
			this.GEventEmitter.emit(
				GAME_EVENTS.sfx_playSound,
				SOUNDS.CARDSWIPE,
				{ volume: 0.25 }
			);
		}
	}

	//To Change the interactivity of the icons as while using masks, zones were deactivated
	changeInteractiveIcons() {
		for (let i = 0; i < this.itemContainer.length; i++) {
			if (i < this.inventoryOffset * OBJECTS_DISPLAYED) {
				((this.itemContainer.list[i] as Phaser.GameObjects.Container)
					.list[0] as IconBackground).disablePointerInteractive();
			} else if (
				i <
				this.inventoryOffset * OBJECTS_DISPLAYED + OBJECTS_DISPLAYED
			) {
				((this.itemContainer.list[i] as Phaser.GameObjects.Container)
					.list[0] as IconBackground).enablePointerInteraction();
			} else {
				((this.itemContainer.list[i] as Phaser.GameObjects.Container)
					.list[0] as IconBackground).disablePointerInteractive();
			}
		}
	}

	//Inventory Change Section function
	changeOffset(increment: number) {
		const maxLimit = Phaser.Math.Clamp(
			Math.ceil(this.itemContainer.length / OBJECTS_DISPLAYED - 1),
			0,
			Infinity
		);
		const newOffset = Phaser.Math.Clamp(
			-this.inventoryOffset - increment,
			-maxLimit,
			0
		);

		if (increment !== 0) {
			this.tweens.add({
				targets: this.itemContainer,
				duration: 300,
				ease: "cubic.inout",
				x: {
					from:
						-this.inventoryOffset *
							OBJECTS_DISPLAYED *
							INVENTORY_ITEM_SEPARATION +
						INVENTORY_OFFSET_X,
					to:
						newOffset *
							OBJECTS_DISPLAYED *
							INVENTORY_ITEM_SEPARATION +
						INVENTORY_OFFSET_X,
				},
				loop: 0,
				onComplete: () => {
					this.tweenInProgress = false;
					this.inventoryOffset = -newOffset;
					if (this.inventoryOffset == 0) {
						this.arrowLeft.disableInteractive().setVisible(false);
					} else {
						this.arrowLeft.setInteractive().setVisible(true);
					}
					if (this.inventoryOffset == maxLimit) {
						this.arrowRight.disableInteractive().setVisible(false);
					} else {
						this.arrowRight.setInteractive().setVisible(true);
					}
					console.log(this.inventoryOffset);
					this.changeInteractiveIcons();
				},
			});
		} else {
			if (this.inventoryOffset == 0) {
				this.arrowLeft.disableInteractive().setVisible(false);
			} else {
				this.arrowLeft.setInteractive().setVisible(true);
			}
			if (this.inventoryOffset == maxLimit) {
				this.arrowRight.disableInteractive().setVisible(false);
			} else {
				this.arrowRight.setInteractive().setVisible(true);
			}
		}
	}

	onDragIconPointerDown(index: number) {
		const item = this.inventoryManager.getItemByIndex(index);
		this.dragIcon.setFrame(item.id);
		this.pointerDown = true;
		this.craftResultFeedbackText.setVisible(false);
		this.result.setVisible(false);
	}

	onCraftingIconPointerOver(id: string | number) {
		switch (id) {
			case ButtonIds.Crafing.craftingIcon1: {
				this.selectedCraftingIcon = ButtonIds.Crafing.craftingIcon1;
				break;
			}
			case ButtonIds.Crafing.craftingIcon2: {
				this.selectedCraftingIcon = ButtonIds.Crafing.craftingIcon2;
				break;
			}
		}
	}

	onCraftingIconPointerOut() {
		this.selectedCraftingIcon = null;
	}

	setCraftingIcon(id: string | number) {
		switch (id) {
			case ButtonIds.Crafing.craftingIcon1: {
				if (!this.element1.visible) this.element1.setVisible(true);
				this.element1.setFrame(this.dragIcon.frame.name);
				this.craftingIcon1.iconPlaced();
				if (this.itemsFilled.indexOf(1) === -1) {
					this.itemsFilled.push(1);
				}
				break;
			}
			case ButtonIds.Crafing.craftingIcon2: {
				if (!this.element2.visible) this.element2.setVisible(true);
				this.element2.setFrame(this.dragIcon.frame.name);
				this.craftingIcon2.iconPlaced();
				if (this.itemsFilled.indexOf(2) === -1) {
					this.itemsFilled.push(2);
				}
				break;
			}
		}
		console.log(this.itemsFilled);
		this.GEventEmitter.emit(GAME_EVENTS.sfx_playSound, SOUNDS.PLACEOBJECT);
		this.dragIcon.setPosition(0, 0).setVisible(false);
	}

	//On Craft Result Tweens and Player Feedback
	craftResultTween(craftResult: number) {
		CraftingUIScene.disableInventory = true;
		switch (craftResult) {
			case -2: {
				console.log("no element can be crafted");
				this.craftResultFeedbackText.setText(
					"No element can be crafted with these items."
				);
				this.invalidResutlTween();
				this.result.setVisible(false);
				break;
			}
			case -1: {
				console.log("element already there ");
				this.craftResultFeedbackText.setText(
					"You have already found this element."
				);
				this.invalidResutlTween();
				this.result.setVisible(false);
				break;
			}
			default: {
				console.log("new element found");
				this.tweens.add({
					targets: this.element1,
					ease: "Cubic.easeInOut",
					duration: 400,
					props: {
						x: { value: 698 },
						y: { value: 200, yoyo: true, duration: 200 },
					},
				});
				this.tweens.add({
					targets: this.element2,
					ease: "Cubic.easeInOut",
					duration: 400,
					props: {
						x: { value: 698 },
						y: { value: 400, yoyo: true, duration: 200 },
					},
					onComplete: (tween: Phaser.Tweens.Tween) => {
						tween.remove();
						this.cameras.main.flash(400);
						this.element1.setVisible(false).setX(194);
						this.element2.setVisible(false).setX(453);
						this.GEventEmitter.emit(
							GAME_EVENTS.sfx_playSound,
							SOUNDS.NEWITEMCRAFTED
						);
						this.craftResultFeedbackText.setText(
							"Congratulations! New Element found!"
						);
						this.result.setFrame(craftResult);
						this.result.setVisible(true);
						this.addNewItemToContainer(craftResult);
					},
				});
			}
		}
		this.craftResultFeedbackText.setVisible(true);
		this.itemsFilled = [];
	}

	invalidResutlTween() {
		this.tweens.add({
			targets: [this.element1, this.element2],
			ease: "Cubic.easeInOut",
			duration: 400,
			props: {
				x: { value: -128 },
				y: { value: 200, yoyo: true, duration: 200 },
			},
			onComplete: (tween: Phaser.Tweens.Tween) => {
				tween.remove();
				this.element1.setVisible(false).setX(194);
				this.element2.setVisible(false).setX(453);
				CraftingUIScene.disableInventory = false;
			},
		});
	}

	addNewItemToContainer(itemId: number) {
		const iconbg = new IconBackground(
			this,
			0,
			0,
			this.itemContainer.length
		);
		if (
			this.itemContainer.length <
			this.inventoryOffset + OBJECTS_DISPLAYED
		) {
			iconbg.enablePointerInteraction();
		} else {
			iconbg.disablePointerInteractive();
		}
		const icon = new InventoryItem(this, 0, 0, itemId);
		const tempContainer = this.add.container(
			this.itemContainer.length * INVENTORY_ITEM_SEPARATION,
			0,
			[iconbg, icon]
		);
		this.itemContainer.add(tempContainer);
		const maxOffsetLimit = Phaser.Math.Clamp(
			Math.ceil(this.itemContainer.length / OBJECTS_DISPLAYED - 1),
			0,
			Infinity
		);
		const deltaOffset = maxOffsetLimit - this.inventoryOffset;
		if (deltaOffset === 0) {
			this.changeOffset(deltaOffset);
			this.tweens.add({
				targets: tempContainer,
				duration: 200,
				scale: { from: 0, to: 1 },
				ease: "Quintic.easeInOut",
				onComplete: (tween: Phaser.Tweens.Tween) => {
					tween.remove();
					IconBackground.selectedIndex =
						this.itemContainer.length - 1;
					this.GEventEmitter.emit(
						GAME_EVENTS.c_changeSelection,
						this.itemContainer.length - 1
					);
					CraftingUIScene.disableInventory = false;
				},
			});
		} else {
			this.changeOffset(deltaOffset);
			this.tweens.add({
				targets: tempContainer,
				delay: 300,
				duration: 200,
				scale: { from: 0, to: 1 },
				ease: "Quintic.easeInOut",
				onComplete: (tween: Phaser.Tweens.Tween) => {
					tween.remove();
					IconBackground.selectedIndex =
						this.itemContainer.length - 1;
					this.GEventEmitter.emit(
						GAME_EVENTS.c_changeSelection,
						this.itemContainer.length - 1
					);
					CraftingUIScene.disableInventory = false;
				},
			});
		}
	}
}
