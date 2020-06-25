import GameEventEmitter, { GAME_EVENTS } from "./GameEvents";
import Button from "./Button/Button";
import { ButtonIds } from "./Button/IButtonConfig";
import { config, BattleConfig } from "../config";

export type ModalConfig = {
	title: string;
	body: string;
	button1_text: string;
	button2_text?: string;
};

export default class Modal extends Phaser.GameObjects.Container {
	private static GEventEmitter: GameEventEmitter;

	config: ModalConfig;
	button1: Button;
	button2: Button;
	exitButton: Button;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		config: ModalConfig
	) {
		if (!Modal.GEventEmitter) {
			Modal.GEventEmitter = GameEventEmitter.getInstance();
		}
		super(scene, x, y);
		scene.add.existing(this);
		this.config = config;
		const bg = scene.add.image(0, 0, "b_ui_modalpanel");
		this.exitButton = new Button(
			scene,
			273,
			-128,
			ButtonIds.Modal.modalexit,
			"",
			{ image: "b_ui_exitbutton" },
			true
		);

		const title = scene.add
			.text(-295, -128, config.title, {
				font: `${BattleConfig.UI.Modal.title.fontSize}px gameFont`,
				fill: BattleConfig.UI.Modal.fontColor,
			})
			.setOrigin(0, 0.5);

		const body = scene.add
			.text(0, -16, config.body, {
				font: `${BattleConfig.UI.Modal.title.fontSize}px gameFont`,
				fill: BattleConfig.UI.Modal.fontColor,
			})
			.setWordWrapWidth(600)
			.setAlign("center")
			.setOrigin(0.5);

		this.button1 = new Button(
			scene,
			0,
			128,
			ButtonIds.Modal.modalconfirm,
			this.config.button1_text,
			{
				image: "buttons",
				fontColor: BattleConfig.UI.Modal.button.fontColor,
				fontSize: BattleConfig.UI.Modal.button.fontSize,
			},
			true
		);
		if (this.config.button2_text) {
			this.button2 = new Button(
				scene,
				200,
				128,
				ButtonIds.Modal.modaldeny,
				this.config.button2_text,
				{
					image: "buttons",
					fontColor: BattleConfig.UI.Modal.button.fontColor,
					fontSize: BattleConfig.UI.Modal.button.fontSize,
				},
				true
			);
		}

		this.add([bg, this.exitButton, title, body, this.button1]);
		if (this.button2) {
			this.add(this.button2);
		}
	}
	resetModalButtons() {
		console.log("renabling modal buttons");
		Modal.GEventEmitter.emit(
			GAME_EVENTS.renableButton,
			ButtonIds.Modal.modalexit
		);
		Modal.GEventEmitter.emit(
			GAME_EVENTS.renableButton,
			ButtonIds.Modal.modalconfirm
		);
		Modal.GEventEmitter.emit(
			GAME_EVENTS.renableButton,
			ButtonIds.Modal.modaldeny
		);
	}

	addEvents(buttons: boolean = true) {
		Modal.GEventEmitter.addListener(
			GAME_EVENTS.buttonClick,
			this.onButtonClick,
			this
		);
		if (buttons) {
			this.exitButton.addEvents();
			this.button1.addEvents();
			if (this.button2) {
				this.button2.addEvents();
			}
		}
	}

	onButtonClick(id: string | number) {
		switch (id) {
			case ButtonIds.Modal.modalexit: {
				Modal.GEventEmitter.emit(GAME_EVENTS.modalexit);
				Modal.GEventEmitter.emit(GAME_EVENTS.modalhide);
				break;
			}
			case ButtonIds.Modal.modalconfirm: {
				Modal.GEventEmitter.emit(GAME_EVENTS.modalconfirm);
				Modal.GEventEmitter.emit(GAME_EVENTS.modalhide);
				break;
			}
			case ButtonIds.Modal.modaldeny: {
				Modal.GEventEmitter.emit(GAME_EVENTS.modaldeny);
				Modal.GEventEmitter.emit(GAME_EVENTS.modalhide);
				break;
			}
		}
	}
}
