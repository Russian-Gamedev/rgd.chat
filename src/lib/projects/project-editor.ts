import type {
	CreateProjectDto,
	ProjectAttachment,
	ProjectAttachmentInputDto,
	ProjectAuthorInputDto,
	ProjectEditor,
	ProjectLinkInputDto,
	ProjectPublicTag,
	ProjectRevisionStatus,
	ProjectType
} from '$lib/api/api.type';

export type ProjectFormTag = Pick<ProjectPublicTag, 'name'> & {
	slug: string | null;
};

/** Загруженное изображение: `upload_id` появляется после завершения загрузки. */
export type ProjectFormImage = {
	upload_id: string | null;
	url: string | null;
};

export type ProjectFormAttachment =
	| {
			type: 'image';
			upload_id: string | null;
			url: string | null;
			uploading?: boolean;
			progress?: number;
	  }
	| { type: 'external_video'; url: string };

export type ProjectFormState = {
	title: string;
	slug: string;
	slugManuallyEdited: boolean;
	description: string;
	releaseDate: string;
	type: ProjectType;
	tags: ProjectFormTag[];
	authors: ProjectAuthorInputDto[];
	links: ProjectLinkInputDto[];
	banner: ProjectFormImage | null;
	attachments: ProjectFormAttachment[];
};

export type ProjectFormErrors = Partial<Record<keyof ProjectFormState | 'cover' | 'form', string>>;

export type ProjectSavedMedia = {
	attachments: ProjectAttachment[];
	banner: ProjectFormImage | null;
};

/** Шаги мастера создания проекта — порядок фиксирован, индекс = позиция в массиве. */
export const EDITOR_STEPS = [
	{
		id: 'info',
		label: 'Основная информация',
		description:
			'Расскажите о вашем проекте. Эта информация будет отображаться на странице проекта.'
	},
	{
		id: 'categorization',
		label: 'Категоризация',
		description: 'Выберите тип проекта и добавьте теги, по которым его найдут в каталоге.'
	},
	{
		id: 'team',
		label: 'Команда',
		description: 'Укажите авторов проекта — людей или команды, которые над ним работали.'
	},
	{
		id: 'links',
		label: 'Внешние ссылки',
		description: 'Добавьте ссылки на сайт, сборки, соцсети и другие ресурсы проекта.'
	},
	{
		id: 'files',
		label: 'Файлы',
		description: 'Загрузите скриншоты и арты, приложите трейлеры и видеообзоры.'
	}
] as const satisfies readonly { id: string; label: string; description: string }[];

export type ProjectEditorStepId = (typeof EDITOR_STEPS)[number]['id'];

/** Ключ ошибки формы → индекс шага, на котором находится соответствующее поле. */
const ERROR_KEY_STEP: Record<string, number> = {
	title: 0,
	slug: 0,
	description: 0,
	releaseDate: 0,
	banner: 0,
	cover: 0,
	tags: 1,
	authors: 2,
	links: 3,
	attachments: 4,
	form: 0
};

export function errorSteps(errors: ProjectFormErrors): number[] {
	return [...new Set(Object.keys(errors).map((key) => ERROR_KEY_STEP[key] ?? 0))].sort(
		(a, b) => a - b
	);
}

const STEP_FIELDS: string[][] = [
	['title', 'slug', 'description', 'releaseDate', 'banner', 'cover'],
	['tags'],
	['authors'],
	['links'],
	['attachments']
];

const DEFAULT_LINK_ICON = 'IconGlobe';

export const AUTHOR_ROLE_OPTIONS = [
	'Владелец',
	'Разработчик',
	'Художник',
	'Команда',
	'Автор'
] as const;

export const AUTHOR_DEFAULT_ROLE: string = 'Разработчик';

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

export function emptyProjectForm(): ProjectFormState {
	return {
		title: '',
		slug: '',
		slugManuallyEdited: false,
		description: '',
		releaseDate: '',
		type: 'game',
		tags: [],
		authors: [],
		links: [],
		banner: null,
		attachments: []
	};
}

function imageToForm(upload_id: string | null, url: string | null): ProjectFormImage | null {
	return upload_id || url ? { upload_id, url } : null;
}

function attachmentToForm(attachment: ProjectAttachment): ProjectFormAttachment {
	return attachment.type === 'image' && attachment.upload_id
		? { type: 'image', upload_id: attachment.upload_id, url: attachment.url }
		: { type: 'external_video', url: attachment.url };
}

export function editorToForm(editor: ProjectEditor): ProjectFormState {
	return {
		title: editor.title,
		slug: editor.slug ?? '',
		slugManuallyEdited: true,
		description: editor.description,
		releaseDate: editor.metadata.release_date ?? '',
		type: editor.metadata.type,
		tags: editor.tags.map((tag) => ({ name: tag.name, slug: tag.slug })),
		authors: editor.credits.authors.map((author) => ({
			...author,
			role: author.role ?? AUTHOR_DEFAULT_ROLE
		})),
		links: editor.resources.links.map((link) => ({ ...link, icon: normalizeLinkIcon(link.icon) })),
		banner: imageToForm(editor.banner_upload_id ?? null, editor.banner_url),
		attachments: editor.resources.attachments.map(attachmentToForm)
	};
}

function attachmentToPayload(attachment: ProjectFormAttachment): ProjectAttachmentInputDto | null {
	if (attachment.type === 'image') {
		return attachment.upload_id ? { type: 'image', upload_id: attachment.upload_id } : null;
	}
	return { type: 'external_video', url: attachment.url.trim() };
}

function attachmentToSaved(attachment: ProjectAttachment): ProjectAttachmentInputDto | null {
	if (attachment.type === 'image') {
		return attachment.upload_id ? { type: 'image', upload_id: attachment.upload_id } : null;
	}
	return { type: 'external_video', url: attachment.url };
}

export function formToPayload(form: ProjectFormState): CreateProjectDto {
	return {
		title: form.title.trim(),
		slug: form.slug?.trim() || undefined,
		description: form.description,
		release_date: form.releaseDate || undefined,
		type: form.type,
		tags: form.tags.map((tag) => tag.name),
		authors: form.authors.map((author) =>
			author.type === 'discord'
				? {
						type: 'discord',
						discord_user_id: String(author.discord_user_id).trim(),
						role: author.role ?? AUTHOR_DEFAULT_ROLE
					}
				: { type: 'text', name: author.name.trim(), role: author.role ?? AUTHOR_DEFAULT_ROLE }
		),
		links: form.links.map((link) => ({
			icon: normalizeLinkIcon(link.icon),
			label: link.label.trim(),
			link: link.link.trim()
		})),
		banner_upload_id: form.banner?.upload_id ?? null,
		attachments: form.attachments
			.map(attachmentToPayload)
			.filter((attachment): attachment is ProjectAttachmentInputDto => attachment !== null)
	};
}

export function formToUpdatePayload(
	form: ProjectFormState,
	saved: ProjectSavedMedia
): Partial<CreateProjectDto> {
	const payload: Partial<CreateProjectDto> = formToPayload(form);
	const current = form.attachments.map(attachmentToPayload);
	const savedAttachments = saved.attachments.map(attachmentToSaved);
	if (JSON.stringify(current) === JSON.stringify(savedAttachments)) delete payload.attachments;
	if ((form.banner?.upload_id ?? null) === (saved.banner?.upload_id ?? null)) {
		delete payload.banner_upload_id;
	}
	return payload;
}

export function normalizeProjectSlug(value: string): string {
	return value
		.normalize('NFKC')
		.toLocaleLowerCase('ru-RU')
		.replace(/[^\p{L}\p{N}]+/gu, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 120);
}

export const slugifyProjectTitle = normalizeProjectSlug;

export function isValidProjectSlug(value: string): boolean {
	return (
		value.length <= 120 &&
		value === normalizeProjectSlug(value) &&
		/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(value)
	);
}

export function formSnapshot(form: ProjectFormState): string {
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

function collectErrors(
	form: ProjectFormState,
	errors: ProjectFormErrors,
	fields: ReadonlySet<string>,
	forReview: boolean
): void {
	const title = form.title.trim();

	if (fields.has('title')) {
		if (!title) errors.title = 'Укажите название.';
		else if (title.length > 120) errors.title = 'Название не должно превышать 120 символов.';
	}

	if (fields.has('description')) {
		if (!form.description.trim()) errors.description = 'Добавьте описание.';
		else if (form.description.length > 20_000) {
			errors.description = 'Описание не должно превышать 20 000 символов.';
		}
	}

	if (fields.has('releaseDate') && form.releaseDate && !isIsoDate(form.releaseDate)) {
		errors.releaseDate = 'Укажите корректную дату в формате ГГГГ-ММ-ДД.';
	}

	if (fields.has('tags')) {
		if (form.tags.length > 10) errors.tags = 'Можно добавить не более 10 тегов.';
		else if (forReview && form.tags.length === 0) errors.tags = 'Добавьте хотя бы один тег.';
	}

	if (fields.has('authors')) {
		if (form.authors.length > 20) errors.authors = 'Можно добавить не более 20 авторов.';
		else if (
			form.authors.some((author) =>
				author.type === 'discord'
					? !/^\d+$/.test(author.discord_user_id.trim())
					: !author.name.trim()
			)
		) {
			errors.authors = 'Заполните каждого автора. Discord ID должен содержать только цифры.';
		}
	}

	if (fields.has('links')) {
		if (form.links.length > 5) errors.links = 'Можно добавить не более 5 ссылок.';
		else if (
			form.links.some(
				(link) => !link.icon.trim() || !link.label.trim() || !isAbsoluteHttpsUrl(link.link.trim())
			)
		) {
			errors.links = 'Для каждой ссылки заполните иконку, подпись и абсолютный HTTPS URL.';
		}
	}

	if (fields.has('attachments')) {
		if (form.attachments.length > 20) {
			errors.attachments = 'Можно добавить не более 20 вложений.';
		} else if (
			form.attachments.some((attachment) =>
				attachment.type === 'image'
					? !attachment.upload_id
					: !isAbsoluteHttpsUrl(attachment.url.trim())
			)
		) {
			errors.attachments = 'Дождитесь загрузки изображений и проверьте ссылки на видео.';
		}
	}

	if (fields.has('banner') && form.banner && !form.banner.upload_id) {
		errors.banner = 'Дождитесь загрузки баннера.';
	}

	if (fields.has('cover') && forReview && !form.banner?.upload_id) {
		errors.cover = 'Загрузите баннер — он станет обложкой проекта.';
	}

	if (fields.has('slug') && form.slug?.trim() && !isValidProjectSlug(form.slug.trim())) {
		errors.slug = 'Адрес должен содержать только lowercase-буквы, цифры и дефисы.';
	}
}

export function validateProjectForm(form: ProjectFormState, forReview = false): ProjectFormErrors {
	const errors: ProjectFormErrors = {};
	collectErrors(form, errors, new Set(STEP_FIELDS.flat()), forReview);
	return errors;
}

/** Валидирует только поля конкретного шага мастера. */
export function validateStep(
	form: ProjectFormState,
	step: number,
	forReview = false
): ProjectFormErrors {
	const errors: ProjectFormErrors = {};
	collectErrors(form, errors, new Set(STEP_FIELDS[step] ?? []), forReview);
	return errors;
}

export function hasErrors(errors: ProjectFormErrors): boolean {
	return Object.keys(errors).length > 0;
}

export function isEditorReadonly(status: ProjectRevisionStatus): boolean {
	return status === 'review';
}

export function canDeleteUnpublished(editor: Pick<ProjectEditor, 'workflow'>): boolean {
	return !editor.workflow.has_published_version;
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
