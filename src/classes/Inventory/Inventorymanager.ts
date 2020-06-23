import { InventoryItemData } from "./InventoryItem";
import { ASSET_PATHS } from "../../assetpaths";
import { dataKey } from "./config";

type combination = {
	elements: [number, number];
	craftedId: number;
};

/*
type combinationMultiple = {
	elements: [number, number];
	craftedId: number[];
};
*/

export default class InventoryManager {
	private static instance: InventoryManager;
	private static master: Array<InventoryItemData>;
	private static crafted: Array<InventoryItemData>;
	private static combinationTree: Array<combination>;

	/* TESTING 
	private static combinationTreeMultiple: Array<combinationMultiple>;
	TESTING */

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

	public loadCombinations(combinations) {
		InventoryManager.combinationTree = combinations;
		console.log(InventoryManager.combinationTree);
	}

	/*
	//TESTING
	public loadCombinationsArray(combinations) {
		InventoryManager.combinationTreeMultiple = combinations;
		console.log(InventoryManager.combinationTreeMultiple);
	}
	//TESTING
	*/

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

	private addNewCraftedItem(id: number) {
		InventoryManager.crafted.push(InventoryManager.master[id]);
		window.localStorage.setItem(
			dataKey,
			JSON.stringify(this.getCraftedIndices())
		);
	}
	public craftNewItem(elements: number[]): number {
		console.log(JSON.stringify(elements));
		let combi = InventoryManager.combinationTree.find(
			(item) => JSON.stringify(item.elements) === JSON.stringify(elements)
		);
		if (combi !== undefined) {
			const newItem = InventoryManager.crafted.find(
				(item) => item.id === combi.craftedId
			);
			if (newItem === undefined) {
				this.addNewCraftedItem(combi.craftedId);
				console.log(this.getCraftedIndices());
				return combi.craftedId;
			}
			return -1;
		} else {
			return -2;
		}
	}

	/*
	//TESTING
	public CraftNewItemReturnMultiple(elements: number[]): number[] {
		console.log(JSON.stringify(elements));
		let combi = InventoryManager.combinationTreeMultiple.find(
			(item) => JSON.stringify(item.elements) === JSON.stringify(elements)
		);
		if (combi !== undefined) {
			let returnIds = [];

			combi.craftedId.forEach((craftedId) => {
				const newItem = InventoryManager.crafted.find(
					(item) => item.id === craftedId
				);
				if (newItem === undefined) {
					this.addNewCraftedItem(craftedId);
					console.log(this.getCraftedIndices());
					returnIds.push(craftedId);
				} else {
					returnIds.push(-1);
				}
			});
			return returnIds;
		} else {
			return [-2];
		}
	}
	//TESTING
	*/
}
