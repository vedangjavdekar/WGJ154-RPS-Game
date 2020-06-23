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

/*********** CONSTANTS ****************/

const OBJECTS_DISPLAYED = 5;
const INVENTORY_ITEM_SEPARATION = 148;
const INVENTORY_OFFSET_X = 152;
const INVENTORY_OFFSET_Y = 615;

/******************************************/

export default class CraftingUIScene extends Phaser.Scene {
	private GEventEmitter: GameEventEmitter;
	private inventoryManager: InventoryManager;

	//Inventory variables
	itemContainer: Phaser.GameObjects.Container;
	inventoryOffset: number;
	arrowLeft: Phaser.GameObjects.Image;
	arrowRight: Phaser.GameObjects.Image;
	tweenInProgress: boolean;
	//Stat Card
	statCard: StatCard;

	constructor() {
		super(SCENES.CRAFTING_UI);
	}

	init() {
		this.GEventEmitter = GameEventEmitter.getInstance();
		const clearEvents = [
			GAME_EVENTS.buttonClick,
			GAME_EVENTS.c_changeSelection,
		];

		for (let event in clearEvents) {
			console.log("clearing:" + clearEvents[event]);
			this.GEventEmitter.clearEvent(clearEvents[event]);
		}
		this.inventoryManager = InventoryManager.getInstance();
	}

	preload() {
		this.cameras.main.setBackgroundColor(CraftingPalette.background.css);
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

		//#region  LOWER UI SECTION
		this.add.image(448, 615, "c_inventory_panel");
		this.itemContainer = this.add.container(
			INVENTORY_OFFSET_X,
			INVENTORY_OFFSET_Y
		);

		const indices = this.inventoryManager.getCraftedIndices();
		console.log(indices);

		IconBackground.selectedIndex = -1;
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
		this.arrowLeft.setVisible(false).disableInteractive();
		//this.arrowLeft.setInteractive();
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

		this.arrowRight.setInteractive();
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

		//#region MID UI SECTION
		const elem1 = this.add
			.text(194, 215, "Elem1", {
				font: `${CraftingConfig.headings.fontSize}px gameFont`,
				fill: CraftingPalette.uiText.css,
			})
			.setOrigin(0.5);
		const ci_1 = new CrafingIconBackground(this, 194, 316);
		const elem2 = this.add
			.text(453, 215, "Elem2", {
				font: `${CraftingConfig.headings.fontSize}px gameFont`,
				fill: CraftingPalette.uiText.css,
			})
			.setOrigin(0.5);
		const ci_2 = new CrafingIconBackground(this, 453, 316);
		const resultText = this.add
			.text(698, 215, "Result", {
				font: `${CraftingConfig.headings.fontSize}px gameFont`,
				fill: CraftingPalette.uiText.css,
			})
			.setOrigin(0.5);
		const result = new CrafingIconBackground(this, 698, 316);

		const plus = this.add.image(325, 316, "c_plus");
		const equalto = this.add.image(576, 316, "c_equalto");
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
		} else if (id !== -1) {
			this.statCard.changeCardTween(id);
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
		const maxLimit = Math.floor(this.itemContainer.length / 5);
		const newOffset = Phaser.Math.Clamp(
			-this.inventoryOffset - increment,
			-maxLimit,
			0
		);
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
					newOffset * OBJECTS_DISPLAYED * INVENTORY_ITEM_SEPARATION +
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
	}
}
