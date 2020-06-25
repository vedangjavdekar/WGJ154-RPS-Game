import { SCENES } from "../config";
import GameEventEmitter, { GAME_EVENTS } from "../classes/GameEvents";
import { SOUNDS } from "../sounds";

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
		const clearEvents = [
			GAME_EVENTS.sfx_playSound,
			GAME_EVENTS.sfx_pauseSound,
			GAME_EVENTS.sfx_resumeSound,
			GAME_EVENTS.sfx_stopSound,
		];

		for (let event in clearEvents) {
			console.log("clearing:" + clearEvents[event]);
			GEventEmitter.clearEvent(clearEvents[event]);
		}

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
		GEventEmitter.addListener(
			GAME_EVENTS.sfx_pauseSound,
			this.onPauseSound,
			this
		);
		GEventEmitter.addListener(
			GAME_EVENTS.sfx_resumeSound,
			this.onResumeSound,
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

	onPauseSound(key: string) {
		if (this.soundOn) {
			if (!this.sounds[key].isPaused) this.sounds[key].pause();
		}
	}

	onResumeSound(key: string) {
		if (this.soundOn) {
			if (this.sounds[key].isPaused) this.sounds[key].resume();
		}
	}
}
