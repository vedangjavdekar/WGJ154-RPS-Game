//Origin x:1072,y:405

import { CraftingConfig } from "../config";
import CraftingPalette from "./ColorPalettes/CraftingPalette";
import InventoryManager from "./Inventory/Inventorymanager";

export default class StatCard extends Phaser.GameObjects.Container {
	private title: Phaser.GameObjects.Text;
	private category: Phaser.GameObjects.Text;
	private exhausted: Phaser.GameObjects.Text;
	//--------
	private attack: Phaser.GameObjects.Text;
	private defense: Phaser.GameObjects.Text;
	private range: Phaser.GameObjects.Text;
	private ammoHeading: Phaser.GameObjects.Text;
	private ammo: Phaser.GameObjects.Text;

	private slots: Phaser.GameObjects.Text;
	private inventorymanager: InventoryManager;

	public isOnScreen: boolean;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y);
		this.inventorymanager = InventoryManager.getInstance();
		const cardBG = scene.add.image(0, 0, "c_card_panel");
		this.title = scene.add
			.text(-155, -260, "Title", {
				font: `${CraftingConfig.cardTitle.fontSize}px gameFont`,
				fill: CraftingPalette.cardTitle.css,
			})
			.setOrigin(0, 0.5);

		const categoryHeading = scene.add.text(-155, -220, "Category:", {
			font: `${CraftingConfig.cardHeading.fontSize}px gameFont`,
			fill: CraftingPalette.cardHeading.css,
		});
		this.category = scene.add.text(-155, -170, "Crafting Element", {
			font: `${CraftingConfig.cardValue.fontSize}px gameFont`,
			fill: CraftingPalette.cardValue.css,
		});

		const exhaustedHeading = scene.add.text(-155, -130, "Exhausted:", {
			font: `${CraftingConfig.cardHeading.fontSize}px gameFont`,
			fill: CraftingPalette.cardHeading.css,
		});
		this.exhausted = scene.add.text(-155, -80, "Mutable", {
			font: `${CraftingConfig.cardValue.fontSize}px gameFont`,
			fill: CraftingPalette.cardValue.css,
		});
		const line = scene.add
			.image(-160, -20, "c_card_line")
			.setOrigin(0, 0.5);

		const attackHeading = scene.add.text(-155, 5, "Attack:", {
			font: `${CraftingConfig.cardValue.fontSize}px gameFont`,
			fill: CraftingPalette.cardHeading.css,
		});
		this.attack = scene.add.text(-10, 5, "00%", {
			font: `${CraftingConfig.cardValue.fontSize}px gameFont`,
			fill: CraftingPalette.cardValue.css,
		});
		const defenseHeading = scene.add.text(-155, 55, "Defense:", {
			font: `${CraftingConfig.cardValue.fontSize}px gameFont`,
			fill: CraftingPalette.cardHeading.css,
		});
		this.defense = scene.add.text(-10, 55, "00%", {
			font: `${CraftingConfig.cardValue.fontSize}px gameFont`,
			fill: CraftingPalette.cardValue.css,
		});
		const rangeHeading = scene.add.text(-155, 105, "Range:", {
			font: `${CraftingConfig.cardValue.fontSize}px gameFont`,
			fill: CraftingPalette.cardHeading.css,
		});
		this.range = scene.add.text(-10, 105, "-", {
			font: `${CraftingConfig.cardValue.fontSize}px gameFont`,
			fill: CraftingPalette.cardValue.css,
		});
		this.ammoHeading = scene.add.text(-155, 155, "Ammo:", {
			font: `${CraftingConfig.cardValue.fontSize}px gameFont`,
			fill: CraftingPalette.cardHeading.css,
		});
		this.ammo = scene.add.text(-10, 155, "-", {
			font: `${CraftingConfig.cardValue.fontSize}px gameFont`,
			fill: CraftingPalette.cardValue.css,
		});

		const mountSlotHeading = scene.add
			.text(-155, 205, "Mount Slots:", {
				font: `${CraftingConfig.cardValue.fontSize}px gameFont`,
				fill: CraftingPalette.cardHeading.css,
			})
			.setWordWrapWidth(100)
			.setLineSpacing(-10);
		this.slots = scene.add.text(-10, 205, "-", {
			font: `${CraftingConfig.cardValue.fontSize}px gameFont`,
			fill: CraftingPalette.cardValue.css,
		});

		this.add([
			cardBG,
			this.title,
			categoryHeading,
			this.category,
			exhaustedHeading,
			this.exhausted,
			line,
			attackHeading,
			this.attack,
			defenseHeading,
			this.defense,
			rangeHeading,
			this.range,
			this.ammoHeading,
			this.ammo,
			mountSlotHeading,
			this.slots,
		]);
		scene.add.existing(this);
	}

	hide() {
		this.setX(1500);
		this.isOnScreen = false;
	}

	hideTween() {
		this.scene.tweens.add({
			targets: this,
			duration: 300,
			x: { from: this.x, to: 1500 },
			ease: "Quint.easeInOut",
			onComplete: (tween: Phaser.Tweens.Tween) => {
				tween.remove();
				this.isOnScreen = false;
			},
		});
	}

	showTween() {
		this.scene.tweens.add({
			targets: this,
			duration: 350,
			alpha: { from: 0, to: 1 },
			x: { from: this.x, to: 1072 },
			ease: "Quint.easeInOut",
			onComplete: (tween: Phaser.Tweens.Tween) => {
				tween.remove();
				this.isOnScreen = true;
			},
		});
	}

	show() {
		this.setX(1072);
		this.isOnScreen = true;
	}

	changeCardTween(index: number) {
		this.scene.tweens.add({
			targets: this,
			duration: 150,
			yoyo: true,
			x: {
				from: 1072,
				to: 1500,
			},
			ease: "Quint.easeInOut",
			onYoyo: () => {
				this.fillCardData(index);
			},
			onComplete: (tween: Phaser.Tweens.Tween) => {
				tween.remove();
			},
		});
	}

	fillCardData(index: number) {
		if (index === -1) return;
		const data = this.inventorymanager.getItemByIndex(index);
		this.title.setText(data.name);
		this.category.setText(data.category);
		this.exhausted.setText(
			data.resourceExhausted ? "Exhausted" : "Mutable"
		);
		this.attack.setText(data.attack + "%");
		this.defense.setText(data.defense + "%");
		if (data.range !== null) {
			this.range.setText(
				data.range + " tile" + (data.range > 1 ? "s" : "")
			);
		} else {
			this.range.setText("-");
		}
		if (data.ammo !== null) {
			this.ammo.setText(data.ammo + " rounds");
		} else {
			this.ammo.setText("-");
		}

		if (data.slots !== null) {
			this.slots.setText(data.slots + "slots");
		} else {
			this.slots.setText("-");
		}
	}
}
