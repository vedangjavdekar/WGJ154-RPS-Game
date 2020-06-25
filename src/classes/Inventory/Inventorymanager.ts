import { InventoryItemData } from "./InventoryItem";
import { ASSET_PATHS } from "../../assetpaths";
import { dataKey, attackdatakey, defensedatakey } from "./config";

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
	private static attackUnits: Array<InventoryItemData>;
	private static defenseUnits: Array<InventoryItemData>;

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
		InventoryManager.attackUnits = [];
		InventoryManager.defenseUnits = [];
		let craftedIds = JSON.parse(window.localStorage.getItem(dataKey));
		for (let i in craftedIds) {
			InventoryManager.crafted.push(
				InventoryManager.master[craftedIds[i]]
			);
			if (
				!(
					InventoryManager.master[
						craftedIds[i]
					].battleUnit.localeCompare("none") === 0
				)
			) {
				if (
					InventoryManager.master[craftedIds[i]].battleUnit
						.toLowerCase()
						.indexOf("attack") !== -1
				) {
					InventoryManager.attackUnits.push(
						InventoryManager.master[craftedIds[i]]
					);
				} else {
					InventoryManager.defenseUnits.push(
						InventoryManager.master[craftedIds[i]]
					);
				}
			}
		}
		if (window.localStorage.getItem(attackdatakey) === null) {
			window.localStorage.setItem(
				attackdatakey,
				JSON.stringify(InventoryManager.attackUnits)
			);
		}
		if (window.localStorage.getItem(defensedatakey) === null) {
			window.localStorage.setItem(
				defensedatakey,
				JSON.stringify(InventoryManager.attackUnits)
			);
		}

		console.log({ master: InventoryManager.master });
		console.log({ crafted: InventoryManager.crafted });
		console.log({ attack: InventoryManager.attackUnits });
		console.log({ defense: InventoryManager.defenseUnits });
	}

	private getIndices(arr: Array<InventoryItemData>): Array<number> {
		return arr.map((item) => item.id);
	}
	private addBattleUnit(id: number) {
		const item = InventoryManager.master[id];
		if (item.battleUnit !== "none") {
			if (item.battleUnit.toLowerCase().indexOf("attack") !== -1) {
				InventoryManager.attackUnits.push(item);
				window.localStorage.setItem(
					attackdatakey,
					JSON.stringify(InventoryManager.attackUnits)
				);
			} else {
				InventoryManager.defenseUnits.push(item);
				window.localStorage.setItem(
					defensedatakey,
					JSON.stringify(InventoryManager.attackUnits)
				);
			}
		}
		console.log({ attack: InventoryManager.attackUnits });
		console.log({ defense: InventoryManager.defenseUnits });
	}
	private addNewCraftedItem(id: number) {
		InventoryManager.crafted.push(InventoryManager.master[id]);
		this.addBattleUnit(id);
		window.localStorage.setItem(
			dataKey,
			JSON.stringify(this.getIndices(InventoryManager.crafted))
		);
	}
	/*
	//TESTING
	public loadCombinationsArray(combinations) {
		InventoryManager.combinationTreeMultiple = combinations;
		console.log(InventoryManager.combinationTreeMultiple);
	}
	//TESTING
	*/
	public loadCombinations(combinations) {
		InventoryManager.combinationTree = combinations;
		console.log(InventoryManager.combinationTree);
	}
	public makeBattleDataFromCrafted() {
		InventoryManager.attackUnits = [];
		InventoryManager.defenseUnits = [];
		InventoryManager.crafted.forEach((item) => {
			if (item.battleUnit !== "none") {
				if (item.battleUnit.toLowerCase().indexOf("attack") !== -1) {
					InventoryManager.attackUnits.push(item);
				} else {
					InventoryManager.defenseUnits.push(item);
				}
			}
		});

		window.localStorage.setItem(
			attackdatakey,
			JSON.stringify(InventoryManager.attackUnits)
		);
		window.localStorage.setItem(
			defensedatakey,
			JSON.stringify(InventoryManager.attackUnits)
		);
		console.log({ attack: InventoryManager.crafted });
		console.log({ defense: InventoryManager.crafted });
	}
	public getCraftedItems(): Array<InventoryItemData> {
		return InventoryManager.crafted;
	}

	public getArrayIndices(array_id: string) {
		switch (array_id) {
			case "crafted": {
				return this.getIndices(InventoryManager.crafted);
			}
			case "attack": {
				return this.getIndices(InventoryManager.attackUnits);
			}
			case "defense": {
				return this.getIndices(InventoryManager.defenseUnits);
			}
		}
	}
	public getItemSound(id: number): string {
		return InventoryManager.master[id].sound;
	}
	public getBattleReady(): boolean {
		return (
			InventoryManager.attackUnits.length > 0 &&
			InventoryManager.defenseUnits.length > 0
		);
	}

	public getItemById(id: number): InventoryItemData {
		return InventoryManager.master[id];
	}

	public getItemByIndex(index: number): InventoryItemData {
		return InventoryManager.crafted[index];
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
				console.log(this.getIndices(InventoryManager.crafted));
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
