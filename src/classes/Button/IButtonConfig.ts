export default interface IButtonConfig {
	image: string;
	fontColor?: string;
	fontSize?: number;
}

export const ButtonIds = {
	MainMenu: {
		Battle: "battle",
		Craft: "craft",
		options: "options",
	},
	Crafing: {
		exit: "c_exit",
	},
};
