export enum GAME_EVENTS {
	buttonClick = "buttonClick",
	renableButton = "renableButton",
	disableButton = "disableButton",
	gameOver = "gameOver",
	gamePause = "gamePause",
	//Modal Events
	modalshow = "m_show",
	modalhide = "m_hide",
	modalexit = "m_exit",
	modalconfirm = "m_confirm",
	modaldeny = "m_deny",
	//ProgressBar Events
	progressbar_timeout = "progressbar_timeout",
	progressbar_pause = "progressbar_pause",
	progressbar_resume = "progressbar_resume",

	//scrollbarEvents
	sb_changeSelection = "sb_changeSelection",
	sb_iconDragPointerDown = "sb_iconDragPointerDown",
	sb_iconDragPointerUp = "sb_iconDragPointerUp",
	sb_buttonEnableEvents = "sb_buttonEnableEvents",
	sb_addElement = "sb_addElement",
	sb_removeElement = "sb_removeElement",
	//Sounds
	sfx_playSound = "sfx_playSound",
	sfx_stopSound = "Sfx_stopSound",
	sfx_pauseSound = "sfx_pauseSound",
	sfx_resumeSound = "sfx_resumeSound",

	//Crafting Events
	c_changeSelection = "c_changeSelection",
	c_dragIconPointerDown = "c_dragIconPointerDown",
	c_craftingIconPointerOver = "c_craftingIconPointerOver",
	c_craftingIconPointerOut = "c_craftingIconPointerOut",
}

export default class GameEventEmitter extends Phaser.Events.EventEmitter {
	private static instance: GameEventEmitter;

	private constructor() {
		super();
	}

	public static getInstance(): GameEventEmitter {
		if (!GameEventEmitter.instance) {
			GameEventEmitter.instance = new GameEventEmitter();
		}
		return GameEventEmitter.instance;
	}

	clearEvents() {
		for (let key in GAME_EVENTS) {
			console.log("clearing event :" + key);
			this.removeAllListeners(key);
		}
	}

	clearEvent(key: string) {
		for (let event in GAME_EVENTS) {
			if (event === key) {
				this.removeAllListeners(event);
			}
		}
	}
}
