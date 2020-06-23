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
		craftingIcon1: "c_craftingicon1",
		craftingIcon2: "c_craftingicon2",
		result: "c_result",
	},
};
