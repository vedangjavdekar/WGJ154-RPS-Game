export interface IProgressBar {
	id: string | number;
	background?: string;
	fill: string;
	foreground?: string;
	tinted: boolean;
	tint?: number;
	scaleX?: number;
	scaleY?: number;
}

export const ProgressBarIds = {
	Battle: {
		attack: "b_pb_attack",
		defense: "b_pb_defense",
		health: "b_pb_health",
	},
};
