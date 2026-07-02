<script lang="ts">
import { onMount } from 'svelte';

import { createApi } from '$lib/api/api';
import type { VideosPage } from '$lib/api/api.type';
import { IconArrowUp } from '$lib/assets/icons';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import Link from '$lib/components/Link.svelte';
import SkeletonImage from '$lib/components/SkeletonImage.svelte';

import type { PageProps } from './$types';
import { formatAbsoluteDate, formatRelativeDateTime } from './format-date';
import { createInfiniteScrollObserver } from './infinite-scroll';
import { toVideoCards, uniqueById } from './video-utils';

let { data }: PageProps = $props();

const videos = $derived(data.videos);
let loadedPages = $state<VideosPage[]>([]);
let isLoadingMore = $state(false);
let hasLoadError = $state(false);
let sentinel: HTMLElement | undefined = $state();
let showScrollTop = $state(false);
let userLocale = $state('ru-RU');
let now = $state<number | null>(null);

const items = $derived(
	uniqueById([...(videos?.items ?? []), ...loadedPages.flatMap((page) => page.items)])
);
const videoCards = $derived(
	items.flatMap((video) => toVideoCards(video, formatAbsoluteDateLocal, formatRelativeTime))
);
const currentPage = $derived(loadedPages.at(-1)?.page ?? videos?.page ?? 1);
const totalPages = $derived(loadedPages.at(-1)?.totalPages ?? videos?.totalPages ?? 1);
const hasMore = $derived(videos !== null && currentPage < totalPages);

function formatAbsoluteDateLocal(datetime: string): string {
	return formatAbsoluteDate(datetime, userLocale);
}

function formatRelativeTime(datetime: string): string {
	if (now === null) return formatAbsoluteDateLocal(datetime);

	return formatRelativeDateTime(datetime, userLocale, now);
}

async function loadNextPage(options?: { force?: boolean }) {
	if (isLoadingMore || !hasMore) return;
	if (hasLoadError && !options?.force) return;

	isLoadingMore = true;
	hasLoadError = false;

	try {
		const api = createApi({ fetch });
		const nextPage = await api.getVideos(currentPage + 1);

		loadedPages = [...loadedPages, nextPage];
	} catch (error) {
		console.error('Failed to load videos page', error);
		hasLoadError = true;
	} finally {
		isLoadingMore = false;
	}
}

onMount(() => {
	userLocale = navigator.language || 'ru-RU';
	now = Date.now();

	const relativeTimeTimer = window.setInterval(() => {
		now = Date.now();
	}, 60_000);

	let destroyObserver: (() => void) | undefined;

	if (sentinel) {
		destroyObserver = createInfiniteScrollObserver(sentinel, () => void loadNextPage());
	}

	const updateScrollTopVisibility = () => {
		showScrollTop = window.scrollY > 600;
	};

	updateScrollTopVisibility();
	window.addEventListener('scroll', updateScrollTopVisibility, { passive: true });

	return () => {
		window.clearInterval(relativeTimeTimer);
		destroyObserver?.();
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
	<Link
		href="https://t.me/GameDevVideos"
		data-rybbit-event="click_telegram"
		data-rybbit-prop-channel="GameDevVideos"
	>
		Telegram-канале
	</Link>, там же можно найти дополнительные комментарии, мысли и заметки от автора подборки. Если хотите
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
						<time datetime={card.source.datetime} title={card.absoluteDate}>{card.relativeTime}</time>
					</div>
				</a>
			</li>
		{/each}
	</ul>

	<div class="loader" bind:this={sentinel}>
		{#if isLoadingMore}
			<p>Загружаем ещё видео...</p>
		{:else if hasLoadError}
			<button class="retry-button" type="button" onclick={() => loadNextPage({ force: true })}>Повторить загрузку</button>
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
		margin: 1.5rem 0 0;
		padding: 0;
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

	.video :global(.thumbnail) {
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

	.retry-button {
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
