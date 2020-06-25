import { IconBackground } from "../Inventory/IconBackground";

import { Icon } from "../Inventory/IconBackground";
import SB_ScrollBar from "./SB_ScrollBar";
import { GAME_EVENTS } from "../GameEvents";
import UIScene from "../../scenes/Battle/UIScene";
import { SOUNDS } from "../../sounds";

export default class SB_IconBackground extends Icon {
	static iconDrag: boolean = false;
	static disableIcons: boolean = false;

	id: number;
	parent: SB_ScrollBar;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		id: number,
		parent: SB_ScrollBar
	) {
		super(scene, x, y);
		this.id = id;
		this.parent = parent;
		this.buttonImage.setTexture("b_ui_button", 0);
		this.buttonZone.setSize(
			this.buttonImage.width,
			this.buttonImage.height
		);

		SB_IconBackground.GEventEmitter.addListener(
			GAME_EVENTS.sb_changeSelection,
			this.onchangeSelection,
			this
		);

		this.enablePointerInteraction();
		this.setPointerCallbacks();
	}

	setPointerCallbacks() {
		this.buttonZone.on("pointerover", () => {
			if (!SB_ScrollBar.scrollbarsEnabled) return;
			if (SB_IconBackground.disableIcons) return;
			if (SB_IconBackground.iconDrag || this.parent.tweenInProgress)
				return;
			if (this.parent.selectedIndex !== this.id) {
				this.buttonImage.setFrame(1);
			}
		});

		this.buttonZone.on("pointerout", () => {
			if (!SB_ScrollBar.scrollbarsEnabled) return;
			if (SB_IconBackground.disableIcons) return;
			if (SB_IconBackground.iconDrag || this.parent.tweenInProgress)
				return;
			if (this.parent.selectedIndex !== this.id) {
				this.buttonImage.setFrame(0);
			}
		});

		this.buttonZone.on("pointerdown", () => {
			if (!SB_ScrollBar.scrollbarsEnabled) return;
			if (SB_IconBackground.disableIcons) return;
			if (this.parent.tweenInProgress) return;
			SB_ScrollBar.GEventEmitter.emit(
				GAME_EVENTS.sfx_playSound,
				SOUNDS.BUTTON
			);
			SB_ScrollBar.GEventEmitter.emit(
				GAME_EVENTS.sb_iconDragPointerDown,
				this.parent.getItemIdbyIndex(this.id)
			);
			if (this.parent.selectedIndex !== this.id) {
				this.parent.selectedIndex = this.id;
				SB_ScrollBar.GEventEmitter.emit(
					GAME_EVENTS.sb_changeSelection,
					this.parent.id
				);
			}
		});

		this.buttonZone.on("pointerup", () => {
			if (!SB_ScrollBar.scrollbarsEnabled) return;
			if (SB_IconBackground.disableIcons) return;
			console.log("buttonZone pointer up event");
			SB_ScrollBar.GEventEmitter.emit(GAME_EVENTS.sb_iconDragPointerUp);
		});
	}
	enablePointerInteraction() {
		this.buttonZone.setInteractive();
	}

	disablePointerInteractive() {
		this.buttonZone.disableInteractive();
	}

	onchangeSelection(id: string | number) {
		if (SB_IconBackground.iconDrag) return;
		if (id === this.parent.id) {
			if (!this.parent.activeParent) {
				this.parent.activeParent = true;
			}
			if (this.parent.selectedIndex !== this.id) {
				this.buttonImage.setFrame(0);
			} else {
				this.buttonImage.setFrame(2);
				console.log({
					id: this.parent.id,
					activeParent: this.parent.activeParent,
					selectedIndex: this.parent.selectedIndex,
				});
				//SB_IconBackground.iconDrag = true;
			}
		} else {
			this.buttonImage.setFrame(0);
			if (this.parent.activeParent) {
				this.parent.activeParent = false;
				this.parent.selectedIndex = -1;
			}
		}
	}
}
