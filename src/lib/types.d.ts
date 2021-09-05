export type Jam = {
	id: string;
	title: string;
	teaser: string;
	thumbnail: string;
	thumbnailAlt?: string;
	streamEmbed: string;
	theme: string;
	startDate: string;
	endDate: string
}

export type Sponsor = {
	name: string;
	amount: number;
	userID: string;
};
