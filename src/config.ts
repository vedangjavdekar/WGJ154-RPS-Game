/**
 * IMPORT SCENES
 */
import "phaser";
import LoadScene from "./scenes/LoadScene";
import MenuScene from "./scenes/MenuScene";
import GameScene from "./scenes/Battle/GameScene";
import UIScene from "./scenes/Battle/UIScene";
import CraftingUIScene from "./scenes/Crafting/CraftingUIScene";
import BootScene from "./scenes/BootScene";
import GameOverScene from "./scenes/Battle/GameOverScene";
import SFXScene from "./scenes/SFXScene";

/**
 * GAME CONFIG
 */

//Reference resolution for the screen.
const referenceResolution = { width: 1280, height: 720 };

export var config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	backgroundColor: 0x454545,
	width: referenceResolution.width,
	height: referenceResolution.height,
	//@ts-ignore
	roundPixels: false,
	antialias: false,
	physics: {
		default: "arcade",
		arcade: {
			//debug: true,
			gravity: {
				y: 0, //9.8 * 150,
			},
		},
	},
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	scene: [
		BootScene,
		SFXScene,
		LoadScene,
		MenuScene,
		GameScene,
		UIScene,
		CraftingUIScene,
		GameOverScene,
	],
};

/*
 * GAME PARAMS
 */
export var gameScreen = {
	width: 0,
	height: 0,
};

const FontSizes = {
	h1: 48,
	h2: 36,
	h3: 28,
	h4: 24,
	h5: 20,
	h6: 18,
};

/**
 * Loading Bar Params
 */
export const LoadingBarConfig = {
	scaleX: 4,
	scaleY: 2,
	fontSize: 20,
	fontColor: "#fff",
};

export const MainMenuConfig = {
	title: {
		fontSize: FontSizes.h1,
		fontColor: "#fff",
	},
	buttons: {
		fontSize: FontSizes.h5,
		fontColor: "#232323",
	},
};

export const CraftingConfig = {
	title: {
		fontSize: FontSizes.h2,
		//fontColor from the respective palette
	},
	headings: {
		fontSize: FontSizes.h4,
		//fontColor from the respective palette
	},
	cardTitle: {
		fontSize: FontSizes.h3,
		//fontColor from the respective palette
	},
	cardHeading: {
		fontSize: FontSizes.h4,
		//fontColor from the respective palette
	},
	cardValue: {
		fontSize: FontSizes.h5,
		//fontColor from the respective palette
	},
};

//Scene names
export const SCENES = {
	BOOT: "BOOT",
	SFX: "SFXSCENE",
	LOAD: "LOADSCENE",
	MENU: "MENUSCENE",
	GAME: "GAME_SCENE",
	UI: "UI_SCENE",
	CRAFTING_UI: "CRAFTING_UI_SCENE",
	GAME_OVER: "GAME_OVER_SCENE",
};

//CUSTOM TYPES
export type callback = (...args: any[]) => void;
