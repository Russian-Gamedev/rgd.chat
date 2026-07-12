import type {
	CreateGameDto,
	GameAttachmentInputDto,
	GameAuthorInputDto,
	GameEditorDto,
	GameLinkInputDto,
	GameRevisionStatus
} from '$lib/api/api.type';

export type GameFormState = {
	title: string;
	description: string;
	releaseDate: string;
	genreIds: string[];
	authors: GameAuthorInputDto[];
	links: GameLinkInputDto[];
	attachments: GameAttachmentInputDto[];
};

export type GameFormErrors = Partial<Record<keyof GameFormState | 'form', string>>;

const DEFAULT_LINK_ICON = 'IconGlobe';

function normalizeLinkIcon(value: string): string {
	const trimmed = value.trim();
	if (!trimmed) return DEFAULT_LINK_ICON;
	if (trimmed.startsWith('Icon')) return trimmed;

	const iconName = trimmed
		.split(/[-_\s]+/)
		.filter(Boolean)
		.map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
		.join('');

	return iconName ? `Icon${iconName}` : DEFAULT_LINK_ICON;
}

export function emptyGameForm(): GameFormState {
	return {
		title: '',
		description: '',
		releaseDate: '',
		genreIds: [],
		authors: [],
		links: [],
		attachments: []
	};
}

export function editorToForm(editor: GameEditorDto): GameFormState {
	return {
		title: editor.title,
		description: editor.description,
		releaseDate: editor.release_date,
		genreIds: editor.genres.map((genre) => genre.id),
		authors: editor.authors.map((author) => ({ ...author })),
		links: editor.links.map((link) => ({ ...link, icon: normalizeLinkIcon(link.icon) })),
		attachments: editor.attachments.map((attachment) => ({ ...attachment }))
	};
}

export function formToPayload(form: GameFormState): CreateGameDto {
	return {
		title: form.title.trim(),
		description: form.description,
		release_date: form.releaseDate,
		genre_ids: [...form.genreIds],
		authors: form.authors.map((author) =>
			author.type === 'discord'
				? { type: 'discord', discord_user_id: String(author.discord_user_id).trim() }
				: { type: 'text', name: author.name.trim() }
		),
		links: form.links.map((link) => ({
			icon: normalizeLinkIcon(link.icon),
			label: link.label.trim(),
			link: link.link.trim()
		})),
		attachments: form.attachments.map((attachment) => ({
			type: attachment.type,
			url: attachment.url.trim()
		}))
	};
}

export function formSnapshot(form: GameFormState): string {
	return JSON.stringify(formToPayload(form));
}

function isIsoDate(value: string): boolean {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
	const [year, month, day] = value.split('-').map(Number);
	const date = new Date(Date.UTC(year, month - 1, day));
	return (
		date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
	);
}

export function isAbsoluteHttpsUrl(value: string): boolean {
	try {
		return new URL(value).protocol === 'https:';
	} catch {
		return false;
	}
}

export function validateGameForm(form: GameFormState, forReview = false): GameFormErrors {
	const errors: GameFormErrors = {};
	const title = form.title.trim();

	if (!title) errors.title = 'Укажите название.';
	else if (title.length > 120) errors.title = 'Название не должно превышать 120 символов.';

	if (!form.description.trim()) errors.description = 'Добавьте описание.';
	else if (form.description.length > 20_000) {
		errors.description = 'Описание не должно превышать 20 000 символов.';
	}

	if (!isIsoDate(form.releaseDate))
		errors.releaseDate = 'Укажите корректную дату в формате ГГГГ-ММ-ДД.';
	if (form.genreIds.length > 10) errors.genreIds = 'Можно выбрать не более 10 жанров.';
	else if (forReview && form.genreIds.length === 0) errors.genreIds = 'Выберите хотя бы один жанр.';

	if (form.authors.length > 20) errors.authors = 'Можно добавить не более 20 авторов.';
	else if (
		form.authors.some((author) =>
			author.type === 'discord' ? !/^\d+$/.test(author.discord_user_id.trim()) : !author.name.trim()
		)
	) {
		errors.authors = 'Заполните каждого автора. Discord ID должен содержать только цифры.';
	}

	if (form.links.length > 5) errors.links = 'Можно добавить не более 5 ссылок.';
	else if (
		form.links.some(
			(link) => !link.icon.trim() || !link.label.trim() || !isAbsoluteHttpsUrl(link.link.trim())
		)
	) {
		errors.links = 'Для каждой ссылки заполните иконку, подпись и абсолютный HTTPS URL.';
	}

	if (form.attachments.length > 20) errors.attachments = 'Можно добавить не более 20 вложений.';
	else if (form.attachments.some((attachment) => !isAbsoluteHttpsUrl(attachment.url.trim()))) {
		errors.attachments = 'Каждое вложение должно содержать абсолютный HTTPS URL.';
	}

	return errors;
}

export function hasErrors(errors: GameFormErrors): boolean {
	return Object.keys(errors).length > 0;
}

export function isEditorReadonly(status: GameRevisionStatus): boolean {
	return status === 'review';
}

export function canDeleteUnpublished(
	editor: Pick<GameEditorDto, 'has_published_version'>
): boolean {
	return !editor.has_published_version;
}

export function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
	const target = index + direction;
	if (target < 0 || target >= items.length) return items;
	const result = [...items];
	[result[index], result[target]] = [result[target], result[index]];
	return result;
}

export function youtubeEmbedUrl(value: string): string | null {
	try {
		const url = new URL(value);
		let id: string | null = null;
		if (url.hostname === 'youtu.be') id = url.pathname.slice(1).split('/')[0];
		if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) {
			id = url.pathname.startsWith('/shorts/')
				? url.pathname.split('/')[2]
				: url.searchParams.get('v');
		}
		return id && /^[\w-]{6,}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
	} catch {
		return null;
	}
}
