import GameEventEmitter, { GAME_EVENTS } from "../GameEvents";
import { IProgressBar } from "./IProgressBar";
import UIScene from "../../scenes/Battle/UIScene";

export default class ProgressBar extends Phaser.GameObjects.Container {
	private static GEventEmitter: GameEventEmitter;
	fill: Phaser.GameObjects.Image;
	background: Phaser.GameObjects.Image;
	foreground: Phaser.GameObjects.Image;
	prop_scaleX: number;
	prop_scaleY: number;
	id: string | number;
	progress_tween: Phaser.Tweens.Tween;
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		config: IProgressBar
	) {
		if (!ProgressBar.GEventEmitter) {
			ProgressBar.GEventEmitter = GameEventEmitter.getInstance();
		}
		super(scene, x, y);
		this.id = config.id;
		if (config.background) {
			this.background = scene.add
				.image(0, 0, config.background)
				.setOrigin(0, 0.5);
			this.add(this.background);
		}
		this.fill = scene.add.image(0, 0, config.fill).setOrigin(0, 0.5);
		if (config.tinted) {
			if (config.tint) {
				this.fill.setTint(config.tint);
			}
		}
		this.add(this.fill);
		if (config.foreground) {
			this.foreground = scene.add
				.image(0, 0, config.foreground)
				.setOrigin(0, 0.5);
			this.add(this.foreground);
		}
		this.prop_scaleX = 1;
		this.prop_scaleY = 1;
		if (config.scaleX) {
			this.scaleX = config.scaleX;
			this.prop_scaleX = config.scaleX;
		}
		if (config.scaleY) {
			this.scaleY = config.scaleY;
			this.prop_scaleY = config.scaleY;
		}
		scene.add.existing(this);
		this.progress_tween = null;
		ProgressBar.GEventEmitter.addListener(
			GAME_EVENTS.gamePause,
			this.onPause,
			this
		);
	}

	private onValueSet(value: number) {
		value = Phaser.Math.Clamp(value, 0, 1);
		this.fill.scaleX = value;
	}

	onTween(
		from: number,
		to: number,
		duration: number,
		completeEvent: boolean
	) {
		from = Phaser.Math.Clamp(from, 0, 1);
		to = Phaser.Math.Clamp(to, 0, 1);
		this.progress_tween = this.scene.tweens.addCounter({
			from,
			to,
			duration,
			onUpdate: (tween: Phaser.Tweens.Tween) => {
				this.onValueSet(tween.getValue());
			},
			onComplete: (tween: Phaser.Tweens.Tween) => {
				tween.remove();
				this.progress_tween = null;
				if (completeEvent) {
					ProgressBar.GEventEmitter.emit(
						GAME_EVENTS.progressbar_timeout,
						this.id
					);
				}
			},
		});
	}

	progressBarTimeout(mode: number, duration: number, emitEvent: boolean) {
		if (mode === 0) {
			this.onTween(1, 0, duration, emitEvent);
		} else if (mode === 1) {
			this.onTween(0, 1, duration, emitEvent);
		} else {
			console.error("Invalid Timeout mode");
		}
	}

	onPause(pause: boolean) {
		console.log("from progress bar pause : " + pause);
		console.log("tween: " + this.progress_tween);
		if (this.progress_tween !== null) {
			console.log("tween is not null:" + this.progress_tween.getValue());
			if (pause) {
				this.progress_tween.pause();
			} else {
				this.progress_tween.resume();
			}
		}
	}
}
