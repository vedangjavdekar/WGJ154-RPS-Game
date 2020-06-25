import { SCENES, gameScreen } from "../../config";
import GameEventEmitter, { GAME_EVENTS } from "../../classes/GameEvents";
import SB_IconBackground from "../../classes/ScrollBar/SB_IconBackground";
import SB_ScrollBar from "../../classes/ScrollBar/SB_ScrollBar";
import { SOUNDS } from "../../sounds";

/***CONSTANTS*******/
const SPEARTAION_X = 8;
const SPEARTAION_Y = 8;
const TILESIZE = 128;
const OFFSET_Y = 224;
const OFFSET_X = 64;

const map = [
	[1, 1, 1, 1, 2, 1, 1, 1, 1],
	[0, 0, 2, 1, 1, 1, 2, 0, 0],
];

const OBJECT_SCALE = 2;

/*******************/

export default class GameScene extends Phaser.Scene {
	tiles: Phaser.GameObjects.Container;
	GEventEmitter: GameEventEmitter;

	fakeImage: Phaser.GameObjects.Sprite;

	pointerDown: boolean;
	constructor() {
		super(SCENES.GAME);
	}
	init() {
		this.GEventEmitter = GameEventEmitter.getInstance();
		const clearEvents = [
			GAME_EVENTS.gamePause,
			GAME_EVENTS.buttonClick,
			GAME_EVENTS.sb_iconDragPointerDown,
			GAME_EVENTS.sb_iconDragPointerUp,
		];

		for (let event in clearEvents) {
			console.log("clearing:" + clearEvents[event]);
			this.GEventEmitter.clearEvent(clearEvents[event]);
		}

		this.GEventEmitter.addListener(
			GAME_EVENTS.sb_iconDragPointerDown,
			this.onIconDragPointerDown,
			this
		);

		this.GEventEmitter.addListener(
			GAME_EVENTS.sb_iconDragPointerUp,
			this.onIconDragPointerUp,
			this
		);

		this.GEventEmitter.addListener(
			GAME_EVENTS.gamePause,
			this.onGamePause,
			this
		);
	}
	preload() {
		this.GEventEmitter.emit(GAME_EVENTS.sfx_playSound, SOUNDS.BATTLELEVEL, {
			loop: true,
			volume: 0.05,
		});
		this.pointerDown = false;
		//this.cameras.main.setBackgroundColor(BattlePalette.background.css);
	}

	create() {
		const bg = this.add
			.image(
				gameScreen.width / 2,
				gameScreen.height / 2,
				"b_game_background"
			)
			.setScale(4);
		this.tiles = this.add.container(OFFSET_X, OFFSET_Y);
		for (let i = 0; i < map.length; i++) {
			for (let j = 0; j < map[i].length; j++) {
				if (map[i][j] !== 0) {
					const tileImg =
						map[i][j] === 1
							? "b_game_tile"
							: "b_game_defenseslottile";

					const tile = this.add.image(
						j * (TILESIZE + SPEARTAION_X),
						i * (TILESIZE + SPEARTAION_Y),
						tileImg
					);
					this.tiles.add(tile);
				}
			}
		}
		this.fakeImage = this.add
			.sprite(0, 0, "gameobjects", 0)
			.setVisible(false)
			.setScale(OBJECT_SCALE);
		this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
			if (this.pointerDown) {
				if (!SB_IconBackground.iconDrag) {
					SB_IconBackground.iconDrag = true;
				}
				if (!this.fakeImage.visible) this.fakeImage.setVisible(true);
				this.fakeImage.setPosition(pointer.worldX, pointer.worldY);
			}
		});

		this.input.on("pointerup", () => {
			console.log("gamescene: pointer up");
			this.onIconDragPointerUp();
		});
	}

	onIconDragPointerDown(iconId: number) {
		console.log("from game scene: " + iconId);
		this.fakeImage.setFrame(iconId);
		this.pointerDown = true;
	}

	onIconDragPointerUp() {
		this.pointerDown = false;
		this.fakeImage.setVisible(false).setPosition(0, 0);
		console.log(SB_IconBackground.iconDrag);
		if (SB_IconBackground.iconDrag) {
			if (SB_IconBackground.disableIcons) return;
			console.log("game scene event: pointer up");
			SB_IconBackground.iconDrag = false;
			//if(on valid location)
			if (this.input.activePointer.worldY < gameScreen.height / 2) {
				console.log("should remove item");
				SB_ScrollBar.GEventEmitter.emit(GAME_EVENTS.sb_removeElement);
			}
		}
	}

	onGamePause(paused: boolean) {
		if (paused) {
			console.log("game Scene paused");
		} else {
			console.log("game Scene resumed");
		}
	}
}
