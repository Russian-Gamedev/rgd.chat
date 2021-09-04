import type { Jam } from "./types";

export function href(jam: Jam): string {
	return `/jam/${jam.id}`
}

export const jams: Jam[] = [
	{
		id: 'wizard-jam',
		title: 'Wizard Jam',
		teaser:
			'У админов наступила ностальгия новогодних джемов, пусть вьюга станет нашим путеводом!',
		thumbnail: 'https://xshxhmntnugvfztasqwt.supabase.in/storage/v1/object/public/images/uzya 50.jpg',
		thumbnailAlt: 'Анонс джема зимнего сезона 2020–21 года'
	},
	{
		id: 'army-jam',
		title: 'Армейский джем',
		teaser:
			'Беларус, локальный мем, и просто ненавистник тумбочек - Даня. В честь его отхода в армию этот джем!',
		thumbnail: 'https://xshxhmntnugvfztasqwt.supabase.in/storage/v1/object/public/images/comrad_dog.jpg',
		thumbnailAlt: 'Анонс джема осеннего сезона 2020 года'
	},
	{
		id: 'letniy-jam-2020',
		title: 'Летний Джем 2020',
		teaser:
			'Привыкшие к новой реальности и даже уже немного отдохнувшие админы решили, что расслаблятся рано и пора ебошить джем!',
		thumbnail: 'https://xshxhmntnugvfztasqwt.supabase.in/storage/v1/object/public/images/765219038.jpg',
		thumbnailAlt: 'Анонс джема летного сезона 2020 года'
	},
	{
		id: 'karantin-jam',
		title: 'Карантин Джем',
		teaser:
			'Внезапно ёбанул карантин и кризис, но гд\'шники не стали унывать и стартанули новый перевёрнутый джем!',
		thumbnail: 'https://xshxhmntnugvfztasqwt.supabase.in/storage/v1/object/public/images/E6yUnqmXEAEk5YX.jpg',
		thumbnailAlt: 'Анонс джема весеннего сезона 2020 года'
	},
	{
		id: 'kojima-jam',
		title: 'KOJIMA-ДЖЕМ',
		teaser:
			'Админы копили с обедов, воровали, попрошайничали на конфэ джиди (э фэйерли комьюнити оф гейм девелопмент) и всё-таки накопили на джем!',
		thumbnail: 'https://xshxhmntnugvfztasqwt.supabase.in/storage/v1/object/public/images/U2yTpjO-z9c.jpg',
		thumbnailAlt: 'Анонс джема осеннего сезона 2019 года'
	}
];
