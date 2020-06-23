import { SCENES, LoadingBarConfig, gameScreen } from "../config";
import { ASSET_PATHS } from "../assetpaths";
import InventoryManager from "../classes/Inventory/Inventorymanager";
import { dataKey } from "../classes/Inventory/config";
import { SOUNDS } from "./SFXScene";

export default class LoadScene extends Phaser.Scene {
	constructor() {
		super(SCENES.LOAD);
	}
	preload() {
		//#region PROGRESS BAR
		const progressBG = this.add
			.image(0, 0, "loadingbar", 2)
			.setScale(LoadingBarConfig.scaleX, LoadingBarConfig.scaleY);
		const progressFill = this.add
			.image(-progressBG.displayWidth / 2, 0, "loadingbar", 1)
			.setScale(LoadingBarConfig.scaleX, LoadingBarConfig.scaleY)
			.setOrigin(0, 0.5);
		const progressFG = this.add
			.image(0, 0, "loadingbar", 0)
			.setScale(LoadingBarConfig.scaleX, LoadingBarConfig.scaleY);

		const container = this.add.container(
			gameScreen.width / 2,
			gameScreen.height / 2,
			[progressBG, progressFill, progressFG]
		);

		const loadingState = this.add
			.text(
				gameScreen.width / 2,
				gameScreen.height / 2 - gameScreen.height / 12,
				"Loading...0%",
				{
					font: `${LoadingBarConfig.fontSize}px gameFont`,
					fill: LoadingBarConfig.fontColor,
				}
			)
			.setOrigin(0.5)
			.setAlign("center");

		loadingState
			.on("pointerover", () => {
				loadingState.setFontSize(
					LoadingBarConfig.playButtonFontSize + 4
				);
			})
			.on("pointerout", () => {
				loadingState.setFontSize(LoadingBarConfig.playButtonFontSize);
			})
			.on("pointerdown", () => {
				loadingState.setFontSize(
					LoadingBarConfig.playButtonFontSize + 2
				);
				this.cameras.main.fadeOut(500);
				this.cameras.main.once("camerafadeoutcomplete", () => {
					this.scene.start(SCENES.SFX);
				});
			});

		const showPlayButton = this.tweens.add({
			targets: loadingState,
			duration: 500,
			alpha: { from: 0, to: 1 },
			ease: "Cubic.Out",
			paused: true,
			onComplete: (tween: Phaser.Tweens.Tween) => {
				tween.remove();
				loadingState.setInteractive();
			},
		});

		this.load.on("progress", (value: number) => {
			progressFill.setScale(
				value * LoadingBarConfig.scaleX,
				LoadingBarConfig.scaleY
			);
			loadingState.setText("Loading..." + Math.round(value * 100) + "%");
		});

		this.load.on("complete", (value: number) => {
			this.tweens.add({
				targets: container,
				duration: 500,
				alpha: { from: 1, to: 0 },
				ease: "Cubic.easeInOut",
				onComplete: (tween: Phaser.Tweens.Tween) => {
					tween.remove();
				},
			});
			this.tweens.add({
				targets: loadingState,
				delay: 200,
				duration: 500,
				alpha: { from: 1, to: 0 },
				ease: "Cubic.Out",
				onComplete: (tween: Phaser.Tweens.Tween) => {
					tween.remove();
					loadingState.setText("PLAY GAME");
					loadingState.setFontSize(
						LoadingBarConfig.playButtonFontSize
					);
					showPlayButton.resume();
				},
			});
		});

		//#endregion

		this.load.json("database", ASSET_PATHS.DATA.CRAFTINGDATA);
		this.load.json("combinationtree", ASSET_PATHS.DATA.COMBINATIONTREE);
		/*TESTING
		this.load.json(
			"combinationtreearray",
			ASSET_PATHS.DATA.COMBINATIONTREEARRAY
		);
		TESTING*/

		//This will be a sprite atlas with names matching to those with the craftingdata
		this.load.spritesheet("gameobjects", ASSET_PATHS.SPRITES.SPRITESHEET, {
			frameWidth: 16,
			frameHeight: 16,
		});

		//This is temporary
		this.load.spritesheet("buttons", ASSET_PATHS.SPRITES.BUTTON, {
			frameWidth: 190,
			frameHeight: 49,
		});

		//#region CRAFTING UI IMPORTS
		this.load.image(
			"c_arrow_left",
			ASSET_PATHS.SPRITES.CRAFTINGLAYOUT.BUTTONS.ARROW_LEFT
		);
		this.load.image(
			"c_arrow_right",
			ASSET_PATHS.SPRITES.CRAFTINGLAYOUT.BUTTONS.ARROW_RIGHT
		);

		this.load.spritesheet(
			"c_exit_button",
			ASSET_PATHS.SPRITES.CRAFTINGLAYOUT.BUTTONS.EXITBUTTON,
			{
				frameWidth: 72,
				frameHeight: 72,
			}
		);

		this.load.spritesheet(
			"c_crafticon",
			ASSET_PATHS.SPRITES.CRAFTINGLAYOUT.ICONBACKGROUDS.CRAFTICON_BG,
			{
				frameWidth: 136,
				frameHeight: 136,
			}
		);
		this.load.spritesheet(
			"c_inventoryicon",
			ASSET_PATHS.SPRITES.CRAFTINGLAYOUT.ICONBACKGROUDS.INVENTORYICON,
			{
				frameWidth: 128,
				frameHeight: 128,
			}
		);
		this.load.image(
			"c_banner",
			ASSET_PATHS.SPRITES.CRAFTINGLAYOUT.PANELS.CRAFTINGBANNER
		);
		this.load.image(
			"c_inventory_panel",
			ASSET_PATHS.SPRITES.CRAFTINGLAYOUT.PANELS.INVENTORYPANEL
		);
		this.load.image(
			"c_card_panel",
			ASSET_PATHS.SPRITES.CRAFTINGLAYOUT.PANELS.STATSCARD
		);

		//Line in the crafting stat card.
		var graphics = this.add.graphics();
		graphics.lineStyle(4, 0x9f7652);
		graphics.lineBetween(0, 0, 320, 0);
		graphics.generateTexture("c_card_line", 320, 2);
		graphics.clear();

		this.load.image(
			"c_plus",
			ASSET_PATHS.SPRITES.CRAFTINGLAYOUT.SYMBOLS.PLUS
		);
		this.load.image(
			"c_equalto",
			ASSET_PATHS.SPRITES.CRAFTINGLAYOUT.SYMBOLS.EQUALTO
		);
		//#endregion

		//#region MUSIC AND SFX
		this.load.audio(SOUNDS.BUTTONCRAFTING, [
			ASSET_PATHS.SOUNDS.BUTTONCRAFTING_MP3,
			ASSET_PATHS.SOUNDS.BUTTONCRAFTING_OGG,
		]);
		this.load.audio(SOUNDS.BUTTONBATTLE, [
			ASSET_PATHS.SOUNDS.BUTTONBATTLE_MP3,
			ASSET_PATHS.SOUNDS.BUTTONBATTLE_OGG,
		]);
		this.load.audio(SOUNDS.BUTTON, [
			ASSET_PATHS.SOUNDS.BUTTON_MP3,
			ASSET_PATHS.SOUNDS.BUTTON_OGG,
		]);
		this.load.audio(SOUNDS.CARDSWIPE, [
			ASSET_PATHS.SOUNDS.CARDSWIPE_MP3,
			ASSET_PATHS.SOUNDS.CARDSWIPE_OGG,
		]);
		this.load.audio(SOUNDS.DESTROYOBJECT, [
			ASSET_PATHS.SOUNDS.DESTROYOBJECT_MP3,
			ASSET_PATHS.SOUNDS.DESTROYOBJECT_OGG,
		]);
		this.load.audio(SOUNDS.PLACEOBJECT, [
			ASSET_PATHS.SOUNDS.PLACEOBJECT_MP3,
			ASSET_PATHS.SOUNDS.PLACEOBJECT_OGG,
		]);
		this.load.audio(SOUNDS.MAINMENU, [
			ASSET_PATHS.SOUNDS.MAINMENU_MP3,
			ASSET_PATHS.SOUNDS.MAINMENU_OGG,
		]);
		this.load.audio(SOUNDS.NEWITEMCRAFTED, [
			ASSET_PATHS.SOUNDS.NEWITEMCRAFTED_MP3,
			ASSET_PATHS.SOUNDS.NEWITEMCRAFTED_OGG,
		]);
		//#endregion
	}
	create() {
		const data = this.cache.json.get("database");
		//********************** DELETE THIS IN ACTUAL GAME *****************************/
		window.localStorage.removeItem(dataKey);
		//*******************************************************************************/
		if (window.localStorage.getItem(dataKey) === null) {
			let initialData = [0, 1, 2];
			window.localStorage.setItem(dataKey, JSON.stringify(initialData));
		}

		const instance = InventoryManager.getInstance();
		instance.loadDataBase(data);
		instance.loadCombinations(this.cache.json.get("combinationtree"));

		/*Multiple Items Output
		instance.loadCombinationsArray(
			this.cache.json.get("combinationtreearray")
		);
		*/
	}
}
