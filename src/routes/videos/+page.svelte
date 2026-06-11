<script lang="ts">
import { createApi } from '$lib/api/api';
import { IconArrowUp, IconEye } from '$lib/assets/icons';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import { onMount } from 'svelte';

import type { PageProps } from './$types';
import type { Video, VideosPage } from '$lib/api/api.type';

type VideoCard = {
	key: string;
	source: Video;
	formattedDate: string;
	formattedViews: string;
	videoId: string;
	url: string;
	thumbnailUrl: string;
};

let { data }: PageProps = $props();

const videos = $derived(data.videos);
let loadedPages = $state<VideosPage[]>([]);
let isLoadingMore = $state(false);
let hasLoadError = $state(false);
let sentinel: HTMLElement | undefined = $state();
let showScrollTop = $state(false);
let userLocale = $state<string | undefined>();

const items = $derived(uniqueById([...(videos?.items ?? []), ...loadedPages.flatMap((page) => page.items)]));
const videoCards = $derived(items.flatMap(toVideoCards));
const currentPage = $derived(loadedPages.at(-1)?.page ?? videos?.page ?? 1);
const totalPages = $derived(loadedPages.at(-1)?.totalPages ?? videos?.totalPages ?? 1);
const hasMore = $derived(videos !== null && currentPage < totalPages);

function uniqueById(videos: Video[]) {
	const seenIds = new Set<number>();

	return videos.filter((video) => {
		if (seenIds.has(video.id)) return false;
		seenIds.add(video.id);
		return true;
	});
}

function toVideoCards(video: Video): VideoCard[] {
	return (video.links ?? []).flatMap((link) => {
		const videoId = getYoutubeVideoId(link);
		if (!videoId) return [];

		return {
			key: `${video.id}:${videoId}`,
			source: video,
			formattedDate: formatDate(video.datetime),
			formattedViews: formatViews(video.views ?? 0),
			videoId,
			url: `https://www.youtube.com/watch?v=${videoId}`,
			thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
		};
	});
}

function getYoutubeVideoId(link: string): string | null {
	try {
		const url = new URL(link);
		const hostname = url.hostname.replace(/^www\./, '').toLowerCase();

		if (hostname === 'youtu.be') {
			return normalizeYoutubeId(url.pathname.split('/').filter(Boolean)[0]);
		}

		if (hostname === 'youtube.com' || hostname === 'm.youtube.com' || hostname === 'music.youtube.com') {
			if (url.pathname === '/watch') {
				return normalizeYoutubeId(url.searchParams.get('v'));
			}

			const [kind, videoId] = url.pathname.split('/').filter(Boolean);
			if (kind === 'shorts' || kind === 'embed' || kind === 'live') {
				return normalizeYoutubeId(videoId);
			}
		}
	} catch {
		return null;
	}

	return null;
}

function normalizeYoutubeId(videoId: string | null | undefined): string | null {
	if (!videoId) return null;

	const normalized = videoId.trim();
	return /^[a-zA-Z0-9_-]{11}$/.test(normalized) ? normalized : null;
}

function formatDate(datetime: string): string {
	const date = new Date(datetime);
	if (Number.isNaN(date.getTime())) return datetime;

	return new Intl.DateTimeFormat(userLocale, {
		dateStyle: 'medium',
		timeStyle: 'short'
	}).format(date);
}

function formatViews(views: number): string {
	return new Intl.NumberFormat(userLocale, { notation: 'compact' }).format(views);
}

async function loadNextPage() {
	if (isLoadingMore || !hasMore) return;

	isLoadingMore = true;
	hasLoadError = false;

	try {
		const api = createApi({ fetch });
		const nextPage = await api.getVideos(currentPage + 1);

		loadedPages = [...loadedPages, nextPage];
	} catch {
		hasLoadError = true;
	} finally {
		isLoadingMore = false;
	}
}

onMount(() => {
	userLocale = navigator.language;

	if (!sentinel) return;

	const observer = new IntersectionObserver(
		(entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				void loadNextPage();
			}
		},
		{ rootMargin: '400px 0px' }
	);

	const updateScrollTopVisibility = () => {
		showScrollTop = window.scrollY > 600;
	};

	observer.observe(sentinel);
	updateScrollTopVisibility();
	window.addEventListener('scroll', updateScrollTopVisibility, { passive: true });

	return () => {
		observer.disconnect();
		window.removeEventListener('scroll', updateScrollTopVisibility);
	};
});
</script>

<Breadcrumb items={[{ label: 'Главная', href: '/' }, { label: 'Видео', href: '/videos' }]} />

<h1>Коллекция полезных видео по разработке игр</h1>

<p class="description">
	Подборка полезных видео по разработке игр: геймдизайн, программирование, графика, продакшн,
	маркетинг, разборы провалов и чужих ошибок. Всё то, что обычно приходится собирать по сотням
	вкладок, рекомендациям с Discord и случайным комментариям под видео.
</p>

<p class="description">
	Новые видео появляются сначала в нашем
	<a
		href="https://t.me/GameDevVideos"
		target="_blank"
		rel="noopener noreferrer"
		data-rybbit-event="click_telegram"
		data-rybbit-prop-channel="GameDevVideos">Telegram-канале</a
	>, там же можно найти дополнительные комментарии, мысли и заметки от автора подборки. Если хотите
	не пропускать обновления — подписывайтесь.
</p>

{#if videos === null}
	<p>Не удалось загрузить список видео.</p>
{:else if videoCards.length === 0 && !hasMore}
	<p>Видео не найдены.</p>
{:else}
	<ul class="videos">
		{#each videoCards as card (card.key)}
			<li>
				<a
					class="video"
					href={card.url}
					target="_blank"
					rel="noopener"
					data-rybbit-event="click_video"
					data-rybbit-prop-video-id={card.videoId}
					data-rybbit-prop-source-id={card.source.id}
				>
					<span class="views" aria-label={`${card.formattedViews} просмотров`}>
						<IconEye />
						{card.formattedViews}
					</span>

					<img
						class="thumbnail"
						src={card.thumbnailUrl}
						alt={card.source.text ?? `YouTube video ${card.videoId}`}
						loading="lazy"
					/>

					<div class="video-content">
						<div class="video-header">
							<time datetime={card.source.datetime}>{card.formattedDate}</time>
						</div>

						{#if card.source.text}
							<p class="video-text">{card.source.text}</p>
						{/if}

					</div>
				</a>
			</li>
		{/each}
	</ul>

	<div class="loader" bind:this={sentinel}>
		{#if isLoadingMore}
			<p>Загружаем ещё видео...</p>
		{:else if hasLoadError}
			<button type="button" onclick={loadNextPage}>Повторить загрузку</button>
		{:else if !hasMore}
			<p>Больше видео нет.</p>
		{/if}
	</div>
{/if}

{#if showScrollTop}
	<button
		class="scroll-top"
		type="button"
		aria-label="Наверх"
		onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
	>
		<IconArrowUp />
	</button>
{/if}

<style>
	.videos {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		list-style: none;
		margin-top: 1.5rem;
	}

	.video {
		background-color: var(--color-bg-surface);
		border-radius: 0.5rem;
		color: var(--color-text);
		display: grid;
		gap: 1rem;
		grid-template-columns: minmax(12rem, 20rem) 1fr;
		padding: 1rem;
		position: relative;
		text-decoration: none;
		transition: transform 200ms;
	}

	.video:hover {
		transform: translateY(-0.125rem);
	}

	.thumbnail {
		aspect-ratio: 16 / 9;
		background-color: var(--color-bg);
		border-radius: 0.375rem;
		display: block;
		height: auto;
		object-fit: cover;
		width: 100%;
	}

	.video-content {
		min-width: 0;
	}

	.description + .description {
		margin-top: 1rem;
	}

	.views {
		align-items: center;
		background-color: rgba(17, 18, 21, 0.88);
		border-radius: 999px;
		color: var(--color-text);
		display: inline-flex;
		font-size: 0.875rem;
		font-weight: 700;
		gap: 0.375rem;
		line-height: 1;
		padding: 0.5rem 0.625rem;
		position: absolute;
		right: 1.5rem;
		top: 1.5rem;
	}

	.views :global(svg) {
		height: 1rem;
		width: 1rem;
	}

	.video-header {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
	}

	.video-text {
		margin-top: 0.75rem;
		white-space: pre-wrap;
	}

	a {
		color: var(--color-primary);
		overflow-wrap: anywhere;
	}

	.loader {
		display: flex;
		justify-content: center;
		min-height: 4rem;
		padding: 1.5rem 0;
	}

	.loader p {
		font-size: 1rem;
	}

	button {
		border: 0;
		border-radius: 0.5rem;
		background-color: var(--color-primary);
		color: var(--color-text);
		cursor: pointer;
		font: inherit;
		font-weight: 700;
		padding: 0.75rem 1rem;
	}

	.scroll-top {
		align-items: center;
		border-radius: 999px;
		bottom: 1.5rem;
		box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.35);
		display: flex;
		font-size: 1.5rem;
		height: 3rem;
		justify-content: center;
		padding: 0;
		position: fixed;
		right: 1.5rem;
		width: 3rem;
		z-index: 10;
	}

	.scroll-top :global(svg) {
		height: 1.25rem;
		width: 1.25rem;
	}

	@media (max-width: 767px) {
		.video {
			grid-template-columns: 1fr;
		}
	}
</style>
