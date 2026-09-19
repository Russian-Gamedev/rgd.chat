import type { User, UserActivity } from '$lib/api/api.type';
import { DISCORD_INVITE_URL, SITE_LOGO } from '$lib/site-config';
import { formatNumber, formatVoiceDuration } from '$lib/utils/format';

/**
 * Discord component embeds — кастомные превью ссылок для Discord.
 * Payload рендерится сервером в <script id="discord:component-embed" type="application/json">.
 * Любое лишнее поле (например id или custom_id) инвалидирует весь payload,
 * поэтому типы повторяют спецификацию один в один.
 * @see https://discord.com/developers/docs/link-previews/component-embeds
 */

export type DiscordComponentEmbedPayload = {
	component: DiscordEmbedContainer;
};

type DiscordEmbedContainer = {
	type: 17;
	accent_color?: number;
	components: DiscordEmbedComponent[];
};

type DiscordEmbedComponent =
	| DiscordEmbedActionRow
	| DiscordEmbedSection
	| DiscordEmbedTextDisplay
	| DiscordEmbedMediaGallery
	| DiscordEmbedSeparator;

type DiscordEmbedTextDisplay = {
	type: 10;
	content: string;
};

type DiscordEmbedThumbnail = {
	type: 11;
	media: { url: string };
};

type DiscordEmbedLinkButton = {
	type: 2;
	style: 5;
	label: string;
	url: string;
};

type DiscordEmbedSection = {
	type: 9;
	components: DiscordEmbedTextDisplay[];
	accessory: DiscordEmbedThumbnail | DiscordEmbedLinkButton;
};

type DiscordEmbedMediaGallery = {
	type: 12;
	items: { media: { url: string } }[];
};

type DiscordEmbedActionRow = {
	type: 1;
	components: DiscordEmbedLinkButton[];
};

type DiscordEmbedSeparator = {
	type: 14;
};

/** Цвет темы сайта #5c87e7. */
const ACCENT_COLOR = 0x5c87e7;
const MAX_DESCRIPTION_LENGTH = 350;
const MARKDOWN_CHARS = /[*_`~[\]()#@<>\\|-]/g;

/** Экранирует markdown, чтобы пользовательский текст отрисовался буквально. */
function escapeMarkdown(text: string) {
	return text.replace(MARKDOWN_CHARS, '\\$&');
}

function truncate(text: string) {
	if (text.length <= MAX_DESCRIPTION_LENGTH) {
		return text;
	}
	return `${text.slice(0, MAX_DESCRIPTION_LENGTH - 1).trimEnd()}…`;
}

function joinDiscordButton(): DiscordEmbedLinkButton {
	return { type: 2, style: 5, label: 'Вступить в Discord', url: DISCORD_INVITE_URL };
}

type PageEmbedInput = {
	title: string;
	description?: string;
	url: string;
	imageUrl?: string;
};

/** Дефолтный embed: заголовок, описание, баннер и кнопки. */
export function buildPageEmbed({
	title,
	description,
	url,
	imageUrl
}: PageEmbedInput): DiscordComponentEmbedPayload {
	const components: DiscordEmbedComponent[] = [
		{ type: 10, content: `## ${escapeMarkdown(title)}` }
	];

	if (description) {
		components.push({ type: 10, content: escapeMarkdown(truncate(description)) });
	}

	components.push({
		type: 12,
		items: [{ media: { url: imageUrl ?? SITE_LOGO } }]
	});
	components.push({ type: 14 });
	components.push({
		type: 1,
		components: [{ type: 2, style: 5, label: 'Открыть', url }, joinDiscordButton()]
	});

	return { component: { type: 17, accent_color: ACCENT_COLOR, components } };
}

type ProfileEmbedInput = {
	user: Pick<User, 'username' | 'nickname' | 'avatarUrl' | 'about'>;
	activity: UserActivity | null;
	url: string;
};

/** Embed профиля: аватар, ник, описание и статистика активности. */
export function buildProfileEmbed({
	user,
	activity,
	url
}: ProfileEmbedInput): DiscordComponentEmbedPayload {
	const name = escapeMarkdown(user.nickname ?? user.username);
	// about — авторский Discord-markdown (ссылки, форматирование), рендерим как есть.
	const about = user.about ? truncate(user.about) : 'Участник сообщества Russian Gamedev';

	const hasAvatar = Boolean(user.avatarUrl);
	const openProfileButton: DiscordEmbedLinkButton = {
		type: 2,
		style: 5,
		label: 'Открыть профиль',
		url
	};

	const section: DiscordEmbedSection = {
		type: 9,
		components: [
			{ type: 10, content: `## ${name}` },
			{ type: 10, content: `${about}` }
		],
		accessory: hasAvatar ? { type: 11, media: { url: user.avatarUrl } } : openProfileButton
	};

	const components: DiscordEmbedComponent[] = [section];

	if (activity) {
		const { messageScore, voiceSeconds, reactionCount } = activity.totals;
		components.push(
			{ type: 14 },
			{ type: 10, content: '### Активность' },
			{ type: 10, content: `💬 **${formatNumber(messageScore)}** сообщений` },
			{ type: 10, content: `🔊 **${formatVoiceDuration(voiceSeconds)}** в голосовых каналах` },
			{ type: 10, content: `👍 **${formatNumber(reactionCount)}** реакций` },
			{ type: 14 }
		);
	} else {
		components.push({ type: 14 });
	}

	components.push({
		type: 1,
		components: hasAvatar ? [openProfileButton, joinDiscordButton()] : [joinDiscordButton()]
	});

	return { component: { type: 17, accent_color: ACCENT_COLOR, components } };
}
