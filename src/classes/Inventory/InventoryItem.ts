import { SPRITE_SCALE_UP } from "../../scenes/Crafting/CraftingUIScene";

type statProp = number | null;

export class InventoryItemData {
	id: number;
	name: string;
	category: string;
	resourceExhausted: boolean;
	attack: number;
	defense: number;
	range: statProp;
	ammo: statProp;
	slots: statProp;
}

export default class InventoryItem extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number, itemId: number) {
		super(scene, x, y, "gameobjects", itemId);
		this.setScale(SPRITE_SCALE_UP);
	}
}
