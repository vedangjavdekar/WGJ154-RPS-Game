import { InventoryItemData } from "./InventoryItem";
import { ASSET_PATHS } from "../../assetpaths";
import { dataKey } from "./config";

export default class InventoryManager {
	private static instance: InventoryManager;
	private static master: Array<InventoryItemData>;
	private static crafted: Array<InventoryItemData>;
	public static getInstance() {
		if (!InventoryManager.instance) {
			InventoryManager.instance = new InventoryManager();
		}
		return InventoryManager.instance;
	}

	public loadDataBase(data: Array<InventoryItemData>) {
		InventoryManager.master = data;
		InventoryManager.crafted = [];
		let craftedIds = JSON.parse(window.localStorage.getItem(dataKey));
		for (let i in craftedIds) {
			InventoryManager.crafted.push(
				InventoryManager.master[craftedIds[i]]
			);
		}

		console.log({ master: InventoryManager.master });
		console.log({ crafted: InventoryManager.crafted });
	}

	public getCraftedItems(): Array<InventoryItemData> {
		return InventoryManager.crafted;
	}

	public getCraftedIndices(): Array<number> {
		return InventoryManager.crafted.map((item) => item.id);
	}

	public getItemById(id: number): InventoryItemData {
		return InventoryManager.master[id];
	}

	public getItemByIndex(index: number): InventoryItemData {
		return InventoryManager.crafted[index];
	}
}
