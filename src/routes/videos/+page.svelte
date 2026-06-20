<script lang="ts">
import { onMount } from 'svelte';

import { createApi } from '$lib/api/api';
import type { Video, VideosPage } from '$lib/api/api.type';
import { IconArrowUp } from '$lib/assets/icons';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import SkeletonImage from '$lib/components/SkeletonImage.svelte';

import type { PageProps } from './$types';

type VideoCard = {
	key: string;
	source: Video;
	formattedDate: string;
	videoId: string;
	url: string;
	thumbnailUrl: string;
	embedTitle: string;
};

let { data }: PageProps = $props();

const videos = $derived(data.videos);
let loadedPages = $state<VideosPage[]>([]);
let isLoadingMore = $state(false);
let hasLoadError = $state(false);
let sentinel: HTMLElement | undefined = $state();
let showScrollTop = $state(false);
let userLocale = $state<string | undefined>();

const items = $derived(
	uniqueById([...(videos?.items ?? []), ...loadedPages.flatMap((page) => page.items)])
);
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
	return (video.links ?? [])
		.filter((link) => link.provider?.toLowerCase() === 'youtube')
		.flatMap((link) => {
			return {
				key: `${video.id}:${link.url}`,
				source: video,
				formattedDate: formatDate(video.datetime),
				videoId: getYoutubeVideoId(link.url) ?? '',
				url: link.url,
				thumbnailUrl: link.thumbnail,
				embedTitle: link.title
			};
		});
}

function getYoutubeVideoId(url: string): string | null {
	try {
		const u = new URL(url);
		const id = u.searchParams.get('v') ?? u.pathname.split('/').filter(Boolean).pop();
		return /^[a-zA-Z0-9_-]{11}$/.test(id?.trim() ?? '') ? (id?.trim() ?? null) : null;
	} catch {
		return null;
	}
}

function formatDate(datetime: string): string {
	const date = new Date(datetime);
	if (Number.isNaN(date.getTime())) return datetime;

	return new Intl.DateTimeFormat(userLocale, {
		dateStyle: 'medium',
		timeStyle: 'short'
	}).format(date);
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
					<SkeletonImage
						class="thumbnail"
						src={card.thumbnailUrl}
						alt={card.embedTitle}
						fallbackSrc={card.videoId ? `https://i.ytimg.com/vi/${card.videoId}/hqdefault.jpg` : null}
					/>

					<div class="video-content">
						<h2 class="video-title">{card.embedTitle}</h2>
						<time datetime={card.source.datetime}>{card.formattedDate}</time>
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
		display: grid;
		gap: 1.5rem 1rem;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		list-style: none;
		margin-top: 1.5rem;
	}

	.video {
		background-color: var(--color-bg-surface);
		border-radius: 0.5rem;
		color: var(--color-text);
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
		text-decoration: none;
		transition:
			opacity 180ms ease,
			transform 180ms ease;
	}

	.video:hover {
		opacity: 0.88;
		transform: translateY(-2px);
	}

	:global(.thumbnail) {
		aspect-ratio: 16 / 9;
		width: 100%;
	}

	.video-content {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-width: 0;
		padding: 0.625rem;
	}

	.description + .description {
		margin-top: 1rem;
	}

	time {
		color: var(--color-text-secondary);
		display: block;
		font-size: 0.8125rem;
		line-height: 1.4;
		margin-top: 0.25rem;
	}

	.video-title {
		display: -webkit-box;
		font-size: 0.9375rem;
		font-weight: 600;
		line-height: 1.35;
		margin: 0;
		min-height: calc(0.9375rem * 1.35 * 2);
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
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
		.videos {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.video {
			transition: none;
		}

		.video:hover {
			transform: none;
		}

	}
</style>
