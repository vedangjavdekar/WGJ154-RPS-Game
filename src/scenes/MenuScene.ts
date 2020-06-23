import { SCENES, gameScreen, MainMenuConfig } from "../config";
import GameEventEmitter, { GAME_EVENTS } from "../classes/GameEvents";
import IButtonConfig, { ButtonIds } from "../classes/Button/IButtonConfig";
import Button from "../classes/Button/Button";
import { SOUNDS } from "./SFXScene";

export default class MenuScene extends Phaser.Scene {
	private GEventEmitter: GameEventEmitter;

	constructor() {
		super(SCENES.MENU);
	}
	init() {
		this.GEventEmitter = GameEventEmitter.getInstance();
		const clearEvents = [GAME_EVENTS.buttonClick];

		for (let event in clearEvents) {
			console.log("clearing:" + clearEvents[event]);
			this.GEventEmitter.clearEvent(clearEvents[event]);
		}
	}
	preload() {}

	create() {
		this.GEventEmitter.emit(GAME_EVENTS.sfx_playSound, SOUNDS.MAINMENU, {
			loop: true,
			volume: 0.05,
		});
		this.add
			.text(gameScreen.width / 2, gameScreen.height / 4, "Game Title", {
				font: `${MainMenuConfig.title.fontSize}px gameFont`,
				fill: MainMenuConfig.title.fontColor,
			})
			.setOrigin(0.5);

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

		this.GEventEmitter.addListener(
			GAME_EVENTS.buttonClick,
			this.onButtonClicked,
			this
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
		this.onChangeScene([SCENES.GAME], 500);
		this.GEventEmitter.emit(GAME_EVENTS.sfx_stopSound, SOUNDS.MAINMENU);
		this.GEventEmitter.emit(GAME_EVENTS.sfx_playSound, SOUNDS.BUTTONBATTLE);
	}

	onCraftClicked() {
		console.log("Craft Clicked");
		this.onChangeScene([SCENES.CRAFTING_UI], 500);
		this.GEventEmitter.emit(GAME_EVENTS.sfx_stopSound, SOUNDS.MAINMENU);
		this.GEventEmitter.emit(
			GAME_EVENTS.sfx_playSound,
			SOUNDS.BUTTONCRAFTING
		);
	}

	//First scene would be started the rest would be launched
	onChangeScene(keys: string[], fadeOutTime: number) {
		this.cameras.main.fadeOut(fadeOutTime);
		this.cameras.main.once("camerafadeoutcomplete", () => {
			for (let i = 0; i < keys.length; i++) {
				if (i === 0) {
					console.log("starting scene: " + keys[i]);
					this.scene.start(keys[i]);
				} else {
					console.log("launching scene: " + keys[i]);
					this.scene.launch(keys[i]);
				}
			}
		});
	}
}
