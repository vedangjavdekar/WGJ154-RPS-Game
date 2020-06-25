export default interface IButtonConfig {
	image: string;
	fontColor?: string;
	fontSize?: number;
	offset_y?: number;
	animatedText?: {
		normal: string;
		highlighted: string;
		pressed: string;
	};
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
	Modal: {
		modalexit: "m_exit",
		modalconfirm: "m_confirm",
		modaldeny: "m_deny",
	},
	Battle: {
		exit: "b_exit",
		craft: "b_craft",
		destroy: "b_destroy",
	},
};
