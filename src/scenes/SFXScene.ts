import { SCENES } from "../config";
import GameEventEmitter, { GAME_EVENTS } from "../classes/GameEvents";
export enum SOUNDS {
	BUTTON = "button",
	BUTTONCRAFTING = "buttoncrafting",
	BUTTONBATTLE = "buttonbattle",
	CARDSWIPE = "cardswipe",
	DESTROYOBJECT = "destroyobject",
	PLACEOBJECT = "placeobject",
	MAINMENU = "mainmenu",
	NEWITEMCRAFTED = "newitemcrafted",
}
type SoundMap = {
	[key: string]: Phaser.Sound.HTML5AudioSound;
};
type SoundConfig = {
	loop: boolean;
	volume: number;
};

export default class SFXScene extends Phaser.Scene {
	private soundOn: boolean;
	private sounds: SoundMap = {};
	constructor() {
		super(SCENES.SFX);
		console.log("SFX running");
		this.soundOn = true;
		const GEventEmitter = GameEventEmitter.getInstance();
		GEventEmitter.clearEvent(GAME_EVENTS.sfx_playSound);
		GEventEmitter.clearEvent(GAME_EVENTS.sfx_stopSound);

		GEventEmitter.addListener(
			GAME_EVENTS.sfx_playSound,
			this.onPlaySound,
			this
		);
		GEventEmitter.addListener(
			GAME_EVENTS.sfx_stopSound,
			this.onStopSound,
			this
		);
	}
	preload() {
		for (let key in SOUNDS) {
			this.sounds[SOUNDS[key]] = this.sound.add(
				SOUNDS[key]
			) as Phaser.Sound.HTML5AudioSound;
		}
	}
	create() {
		this.scene.launch(SCENES.MENU);
	}

	onPlaySound(key: string, config?: SoundConfig) {
		if (this.soundOn) {
			this.sounds[key].play(config);
		}
	}

	onStopSound(key: string) {
		if (this.soundOn) {
			this.sounds[key].stop();
		}
	}
}
