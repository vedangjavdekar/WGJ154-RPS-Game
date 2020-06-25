import { SCENES, gameScreen, MainMenuConfig } from "../config";
import GameEventEmitter, { GAME_EVENTS } from "../classes/GameEvents";
import IButtonConfig, { ButtonIds } from "../classes/Button/IButtonConfig";
import Button from "../classes/Button/Button";
import { Scene } from "phaser";
import InventoryManager from "../classes/Inventory/Inventorymanager";
import { SOUNDS } from "../sounds";

type SceneDataPair = {
	key: string;
	data?: any;
};

export default class MenuScene extends Phaser.Scene {
	private GEventEmitter: GameEventEmitter;
	private inventoryManager: InventoryManager;
	private warningText: Phaser.GameObjects.Text;
	constructor() {
		super(SCENES.MENU);
	}
	addEvents() {
		if (!this.GEventEmitter) {
			this.GEventEmitter = GameEventEmitter.getInstance();
		}
		const clearEvents = [
			GAME_EVENTS.buttonClick,
			GAME_EVENTS.renableButton,
		];

		for (let event in clearEvents) {
			console.log("clearing:" + clearEvents[event]);
			this.GEventEmitter.clearEvent(clearEvents[event]);
		}

		this.GEventEmitter.addListener(
			GAME_EVENTS.buttonClick,
			this.onButtonClicked,
			this
		);
	}

	init() {
		this.addEvents();
		this.inventoryManager = InventoryManager.getInstance();
	}

	create() {
		this.GEventEmitter.emit(GAME_EVENTS.sfx_playSound, SOUNDS.MAINMENU, {
			loop: true,
			volume: 0.05,
		});

		this.add
			.text(gameScreen.width / 2, gameScreen.height / 4, "Roshambros", {
				font: `${MainMenuConfig.title.fontSize}px gameFont`,
				fill: MainMenuConfig.title.fontColor,
			})
			.setOrigin(0.5);

		this.warningText = this.add
			.text(
				gameScreen.width / 2,
				(10 * gameScreen.height) / 12,
				"You need at least one offensive unit and one defensive unit to enter battle mode",
				{
					font: `${MainMenuConfig.buttons.fontSize}px gameFont`,
					fill: MainMenuConfig.title.fontColor,
				}
			)
			.setWordWrapWidth(gameScreen.width / 2)
			.setAlign("center")
			.setOrigin(0.5)
			.setAlpha(0);

		//Button Config for menu buttons
		const ButtonConfig: IButtonConfig = {
			image: "buttons",
			fontColor: MainMenuConfig.buttons.fontColor,
			fontSize: MainMenuConfig.buttons.fontSize,
		};

		const battleButton = new Button(
			this,
			gameScreen.width / 2,
			gameScreen.height / 2,
			ButtonIds.MainMenu.Battle,
			"Battle",
			ButtonConfig,
			true
		);

		const craftButton = new Button(
			this,
			gameScreen.width / 2,
			gameScreen.height / 2 + gameScreen.height / 12,
			ButtonIds.MainMenu.Craft,
			"Craft",
			ButtonConfig,
			true
		);

		this.cameras.main.fadeIn(500);
	}

	onButtonClicked(id: string | number) {
		switch (id) {
			case ButtonIds.MainMenu.Battle: {
				this.onBattleClicked();
				break;
			}
			case ButtonIds.MainMenu.Craft: {
				this.onCraftClicked();
				break;
			}
		}
	}

	onBattleClicked() {
		console.log("Battle Clicked");
		if (this.inventoryManager.getBattleReady()) {
			const scenedatapairs: SceneDataPair[] = [
				{
					key: SCENES.GAME,
				},
				{
					key: SCENES.UI,
				},
			];

			this.onChangeScene(500, scenedatapairs);
			this.GEventEmitter.emit(GAME_EVENTS.sfx_stopSound, SOUNDS.MAINMENU);
			this.GEventEmitter.emit(
				GAME_EVENTS.sfx_playSound,
				SOUNDS.BUTTONBATTLE
			);
		} else {
			this.warningText.setAlpha(1);
		}
	}

	onCraftClicked() {
		console.log("Craft Clicked");
		const scenedatapairs: SceneDataPair[] = [
			{
				key: SCENES.CRAFTING_UI,
				data: {
					fromBattle: false,
				},
			},
		];
		this.onChangeScene(500, scenedatapairs);
		this.GEventEmitter.emit(GAME_EVENTS.sfx_stopSound, SOUNDS.MAINMENU);
		this.GEventEmitter.emit(
			GAME_EVENTS.sfx_playSound,
			SOUNDS.BUTTONCRAFTING
		);
	}

	//First scene would be started the rest would be launched
	onChangeScene(fadeOutTime: number, scenedata: SceneDataPair[]) {
		this.cameras.main.fadeOut(fadeOutTime);
		this.cameras.main.once("camerafadeoutcomplete", () => {
			for (let i = 0; i < scenedata.length; i++) {
				if (i === 0) {
					console.log("starting scene: " + scenedata[i].key);
					this.scene.start(scenedata[i].key, scenedata[i].data);
				} else {
					console.log("launching scene: " + scenedata[i].key);
					this.scene.launch(scenedata[i].key, scenedata[i].data);
				}
			}
		});
	}
}
