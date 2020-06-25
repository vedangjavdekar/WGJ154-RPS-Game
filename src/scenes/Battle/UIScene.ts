import { SCENES, gameScreen, BattleConfig } from "../../config";
import Button from "../../classes/Button/Button";
import GameEventEmitter, { GAME_EVENTS } from "../../classes/GameEvents";
import InventoryManager from "../../classes/Inventory/Inventorymanager";
import { ButtonIds } from "../../classes/Button/IButtonConfig";
import Modal, { ModalConfig } from "../../classes/Modal";
import ProgressBar from "../../classes/ProgressBars/ProgressBar";
import { ProgressBarIds } from "../../classes/ProgressBars/IProgressBar";
import SB_ScrollBar, {
	ScrollBarIds,
} from "../../classes/ScrollBar/SB_ScrollBar";
import SB_IconBackground from "../../classes/ScrollBar/SB_IconBackground";
import { SOUNDS } from "../../sounds";

const exitModal: ModalConfig = {
	title: "EXIT GAME",
	body: "You will lose your progress in the game.\nDo you want to continue",
	button1_text: "Yes",
	button2_text: "No",
};

const animatedTextConfig = {
	normal: "#9A9A9A",
	highlighted: "#fff",
	pressed: "#eee",
};

/********** CONSTANTS *********/
const SCROLLVIEW_SEPARTION_X = 64;

const ATTACK_TIMER_INCREMENT = 5000;
const ATTACK_TIMER_INITIAL_VALUE = 10000;

const DEFENSE_TIMER_INCREMENT = 3000;
const DEFENSE_TIMER_INITIAL_VALUE = 15000;

/******************************/
export default class UIScene extends Phaser.Scene {
	GEventEmitter: GameEventEmitter;
	inventoryManager: InventoryManager;

	pauseMenu: Modal;

	waveCounterText: Phaser.GameObjects.Text;

	//Buttons
	exitButton: Button;
	craftButton: Button;
	destroyButton: Button;

	//Attack container
	attackContainer: Phaser.GameObjects.Container;
	//Defense container
	defenseContainer: Phaser.GameObjects.Container;

	attackProgressbar: ProgressBar;
	defenseProgressbar: ProgressBar;

	constructor() {
		super(SCENES.UI);
	}

	addEvents() {
		if (!this.GEventEmitter) {
			this.GEventEmitter = GameEventEmitter.getInstance();
		}
		const clearEvents = [
			GAME_EVENTS.buttonClick,
			GAME_EVENTS.renableButton,
			GAME_EVENTS.disableButton,
			GAME_EVENTS.modalshow,
			GAME_EVENTS.modalhide,
			GAME_EVENTS.modalexit,
			GAME_EVENTS.modalconfirm,
			GAME_EVENTS.modaldeny,
			GAME_EVENTS.progressbar_timeout,
		];

		for (let event in clearEvents) {
			//console.log("clearing:" + clearEvents[event]);
			this.GEventEmitter.clearEvent(clearEvents[event]);
		}

		this.GEventEmitter.addListener(
			GAME_EVENTS.buttonClick,
			this.onButtonClicked,
			this
		);
		this.GEventEmitter.addListener(
			GAME_EVENTS.modalhide,
			this.onModalHideTween,
			this
		);
		this.GEventEmitter.addListener(
			GAME_EVENTS.modalexit,
			this.onModalExit,
			this
		);
		this.GEventEmitter.addListener(
			GAME_EVENTS.modalconfirm,
			this.onModalConfirm,
			this
		);
		this.GEventEmitter.addListener(
			GAME_EVENTS.modaldeny,
			this.onModalDeny,
			this
		);

		this.GEventEmitter.addListener(
			GAME_EVENTS.progressbar_timeout,
			this.onProgressbarTimeout,
			this
		);
	}

	init() {
		this.addEvents();
		this.inventoryManager = InventoryManager.getInstance();
	}

	create() {
		this.add.image(0, 496, "b_ui_uipanel").setOrigin(0).setAlpha(0.95);
		this.waveCounterText = this.add
			.text(gameScreen.width / 2, 32, "WAVE 1", {
				font: `${BattleConfig.UI.title.fontSize}px gameFont`,
				fill: BattleConfig.UI.fontColor,
			})
			.setOrigin(0.5)
			.setAlign("center");

		this.exitButton = new Button(
			this,
			1200,
			544,
			ButtonIds.Battle.exit,
			"Exit",
			{
				image: "b_ui_exitbutton",
				fontSize: BattleConfig.UI.button.fontSize,
				fontColor: BattleConfig.UI.button.fontColor,
				offset_y: 64,
				animatedText: animatedTextConfig,
			},
			true
		);

		this.pauseMenu = new Modal(
			this,
			-gameScreen.width / 2,
			gameScreen.height / 2,
			exitModal
		);
		this.pauseMenu.addEvents(false);

		this.craftButton = new Button(
			this,
			1000,
			544,
			ButtonIds.Battle.craft,
			"Craft",
			{
				image: "b_ui_craftbutton",
				fontSize: BattleConfig.UI.button.fontSize,
				fontColor: BattleConfig.UI.button.fontColor,
				offset_y: 64,
				animatedText: animatedTextConfig,
			},
			true
		);
		this.destroyButton = new Button(
			this,
			1100,
			544,
			ButtonIds.Battle.destroy,
			"Destroy",
			{
				image: "b_ui_destroybutton",
				fontSize: BattleConfig.UI.button.fontSize,
				fontColor: BattleConfig.UI.button.fontColor,
				offset_y: 64,
				animatedText: animatedTextConfig,
			},
			true
		);

		//#region ATTACK PANEL
		SB_ScrollBar.clearEvents();
		//this.GEventEmitter.emit(GAME_EVENTS.gamePause, false);
		this.add
			.text(52, 528, "Attack:", {
				font: `${BattleConfig.UI.fontSize}px gameFont`,
				fill: BattleConfig.UI.fontColor,
			})
			.setOrigin(0, 0.5);
		new SB_ScrollBar(this, 212, 576, ScrollBarIds.attack, []);
		new SB_ScrollBar(this, 212, 672, ScrollBarIds.defense, []);
		this.attackProgressbar = new ProgressBar(this, 200, 528, {
			id: ProgressBarIds.Battle.attack,
			fill: "b_ui_healthbarfill",
			foreground: "b_ui_healthbarborder",
			tinted: true,
			tint: 0x00b2ff,
			scaleX: 1.5,
		});
		this.attackProgressbar.progressBarTimeout(1, 10000, true);

		this.add
			.text(52, 624, "Defense:", {
				font: `${BattleConfig.UI.fontSize}px gameFont`,
				fill: BattleConfig.UI.fontColor,
			})
			.setOrigin(0, 0.5);
		this.defenseProgressbar = new ProgressBar(this, 200, 624, {
			id: ProgressBarIds.Battle.defense,
			fill: "b_ui_healthbarfill",
			foreground: "b_ui_healthbarborder",
			tinted: true,
			tint: 0x69d957,
			scaleX: 1.5,
		});
		this.defenseProgressbar.progressBarTimeout(1, 3000, true);
		this.events.on("resume", this.onSceneResume, this);
	}

	onButtonClicked(id: string | number) {
		switch (id) {
			case ButtonIds.Battle.exit: {
				this.onExitClicked();
				break;
			}
			case ButtonIds.Battle.craft: {
				this.onCraftClicked();
				break;
			}
		}
	}
	onExitClicked() {
		this.ModalShowTween();
		this.GEventEmitter.emit(GAME_EVENTS.gamePause, true);
	}

	onCraftClicked() {
		this.GEventEmitter.emit(GAME_EVENTS.gamePause, true);
		this.GEventEmitter.emit(
			GAME_EVENTS.disableButton,
			ButtonIds.Battle.destroy
		);
		this.GEventEmitter.emit(
			GAME_EVENTS.disableButton,
			ButtonIds.Battle.destroy
		);
		this.GEventEmitter.emit(GAME_EVENTS.sfx_pauseSound, SOUNDS.BATTLELEVEL);
		this.cameras.main.fadeOut(200);
		this.cameras.main.once("camerafadeoutcomplete", () => {
			this.scene.pause();
			this.scene.get(SCENES.GAME).scene.pause();
			this.scene.launch(SCENES.CRAFTING_UI, { fromBattle: true });
		});
	}

	onSceneResume() {
		this.cameras.main.fadeIn(200);
		this.cameras.main.once("camerafadeincomplete", () => {
			this.addEvents();
			this.scene.get(SCENES.GAME).scene.resume();
			this.pauseMenu.addEvents();
			this.craftButton.addEvents();
			this.destroyButton.addEvents();
			this.exitButton.addEvents();
			this.GEventEmitter.emit(GAME_EVENTS.gamePause, false);
			this.GEventEmitter.emit(
				GAME_EVENTS.sfx_resumeSound,
				SOUNDS.BATTLELEVEL
			);
			this.GEventEmitter.emit(
				GAME_EVENTS.renableButton,
				ButtonIds.Battle.craft
			);
			this.GEventEmitter.emit(
				GAME_EVENTS.renableButton,
				ButtonIds.Battle.destroy
			);
			this.GEventEmitter.emit(
				GAME_EVENTS.renableButton,
				ButtonIds.Battle.exit
			);
		});
	}

	//#region MODAL METHODS

	ModalShowTween() {
		this.pauseMenu.resetModalButtons();
		this.add.tween({
			targets: this.pauseMenu,
			x: { from: -gameScreen.width / 2, to: gameScreen.width / 2 },
			duration: 500,
			ease: "Cubic.easeInOut",
			onComplete: (tween: Phaser.Tweens.Tween) => {
				tween.remove();
				this.GEventEmitter.emit(
					GAME_EVENTS.disableButton,
					ButtonIds.Battle.craft
				);
				this.GEventEmitter.emit(
					GAME_EVENTS.disableButton,
					ButtonIds.Battle.destroy
				);
			},
		});
	}
	onModalHideTween() {
		this.add.tween({
			targets: this.pauseMenu,
			x: { from: gameScreen.width / 2, to: -gameScreen.width / 2 },
			duration: 500,
			ease: "Cubic.easeInOut",
			onComplete: (tween: Phaser.Tweens.Tween) => {
				tween.remove();
				this.GEventEmitter.emit(GAME_EVENTS.gamePause, false);
				this.GEventEmitter.emit(
					GAME_EVENTS.renableButton,
					ButtonIds.Battle.craft
				);
				this.GEventEmitter.emit(
					GAME_EVENTS.renableButton,
					ButtonIds.Battle.destroy
				);
			},
		});
	}
	onModalExit() {
		this.GEventEmitter.emit(
			GAME_EVENTS.renableButton,
			ButtonIds.Battle.exit
		);
	}
	onModalConfirm() {
		this.GEventEmitter.emit(GAME_EVENTS.sfx_stopSound, SOUNDS.BATTLELEVEL);
		this.cameras.main.fadeOut(500);
		this.cameras.main.once("camerafadeoutcomplete", () => {
			this.GEventEmitter.emit(GAME_EVENTS.gamePause, false);
			this.scene.get(SCENES.GAME).scene.stop();
			this.scene.start(SCENES.MENU);
		});
	}
	onModalDeny() {
		console.log("Modal denied");
		this.GEventEmitter.emit(
			GAME_EVENTS.renableButton,
			ButtonIds.Battle.exit
		);
	}

	//#endregion

	//#region PROGRESS BAR METHODS
	onProgressbarTimeout(id: string | number) {
		console.log(id);
		switch (id) {
			case ProgressBarIds.Battle.health: {
				this.onHealthTimeout();
				break;
			}
			case ProgressBarIds.Battle.attack: {
				this.onAttacktimeout();
				break;
			}
			case ProgressBarIds.Battle.defense: {
				this.onDefenseTimeout();
				break;
			}
		}
	}

	onHealthTimeout() {
		console.log("Health Timeout");
	}

	onAttacktimeout() {
		console.log("Attack Timeout");
		this.time.delayedCall(3000, () => {
			this.attackProgressbar.progressBarTimeout(
				1,
				Phaser.Math.Between(5000, 10000),
				true
			);
		});
		this.GEventEmitter.emit(
			GAME_EVENTS.sb_addElement,
			ScrollBarIds.attack,
			Phaser.Math.Between(0, 7)
		);
	}

	onDefenseTimeout() {
		console.log("Defense Timeout");
		this.time.delayedCall(5000, () => {
			this.defenseProgressbar.progressBarTimeout(
				1,
				Phaser.Math.Between(5000, 10000),
				true
			);
		});

		this.GEventEmitter.emit(
			GAME_EVENTS.sb_addElement,
			ScrollBarIds.defense,
			Phaser.Math.Between(0, 6)
		);
	}
	//#endregion
}
