<script lang="ts">
import { createApi } from '$lib/api/api';
import type { GolderMedia } from '$lib/api/api.type';
import { IconVideo } from '$lib/assets/icons';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import Button from '$lib/components/Button.svelte';
import Input from '$lib/components/Input.svelte';

import type { PageProps } from './$types';
import UploadModal from './UploadModal.svelte';

const PAGE_LIMIT = 20;

let { data }: PageProps = $props();

let items = $state<GolderMedia[]>([]);
let total = $state(0);
let isLoading = $state(false);
let hasError = $state(false);

let searchInput = $state('');
let search = $state('');
let activeTags = $state<string[]>([]);

let isUploadOpen = $state(false);
let queryVersion = 0;

const isDefaultQuery = $derived(search === '' && activeTags.length === 0);
const hasMore = $derived(items.length < total);

// Единая точка загрузки списка: синхронно читаем поисковый ввод, теги и
// страницу с сервера, затем с дебаунсом применяем запрос. Дебаунс ввода —
// за счёт перезапуска эффекта на каждом нажатии (таймер пересоздаётся).
$effect(() => {
	const query = searchInput.trim();
	const currentTags = activeTags;
	const seed = data.media;
	const isDefault = query === '' && currentTags.length === 0;

	const version = ++queryVersion;
	const timer = setTimeout(
		() => {
			search = query;
			if (isDefault) {
				// Пока фильтры не применены, показываем страницу, загруженную на
				// сервере; инвалидация 'golder:list' обновит её после загрузки.
				items = seed?.items ?? [];
				total = seed?.total ?? 0;
				return;
			}
			void fetchPage(0, version, query, currentTags);
		},
		isDefault ? 0 : 400
	);
	return () => clearTimeout(timer);
});

function toggleTag(tag: string) {
	activeTags = activeTags.includes(tag)
		? activeTags.filter((existing) => existing !== tag)
		: [...activeTags, tag];
}

// Наведение на карточку проигрывает видео (с(loop)); при уходе мыши
// проигрывание ставится на паузу — позиция сохраняется до следующего наведения.
function playCardVideo(event: Event) {
	const video = (event.currentTarget as HTMLElement).querySelector('video');
	if (video) {
		video.volume = 0.15;
		video.play().catch(() => {
			// браузер может запретить воспроизведение — молча игнорируем
		});
	}
}

function pauseCardVideo(event: Event) {
	(event.currentTarget as HTMLElement).querySelector('video')?.pause();
}

async function fetchPage(offset: number, version: number, search: string, tags: string[]) {
	isLoading = true;
	hasError = false;

	try {
		const api = createApi({ fetch });
		const page = await api.listGolder({
			search: search || undefined,
			tags: tags.length > 0 ? tags.join(',') : undefined,
			limit: PAGE_LIMIT,
			offset
		});

		if (version !== queryVersion) return;
		items = offset === 0 ? page.items : [...items, ...page.items];
		total = page.total;
	} catch (error) {
		console.error('Failed to load golder page', error);
		if (version === queryVersion) hasError = true;
	} finally {
		if (version === queryVersion) isLoading = false;
	}
}

function loadMore() {
	if (isLoading) return;
	void fetchPage(items.length, ++queryVersion, search, activeTags);
}
</script>

<Breadcrumb
  items={[
    { label: "Главная", href: "/" },
    { label: "Golder", href: "/golder" },
  ]}
/>

<h1>Golder</h1>

<p class="description">
  Общая медиабиблиотека сообщества: картинки, видео и аудио с тегами.
</p>

<div class="search">
  <Input
    type="search"
    placeholder="Поиск по названию"
    bind:value={searchInput}
  />
</div>

<div class="toolbar">
  <Button onclick={() => (isUploadOpen = true)}>Загрузить</Button>
  {#if activeTags.length > 0}
    <div class="active-tags">
      {#each activeTags as tag (tag)}
        <button class="active-tag" type="button" onclick={() => toggleTag(tag)}>
          #{tag} ×
        </button>
      {/each}
    </div>
  {/if}
</div>

{#if data.media === null}
  <p>Не удалось загрузить медиабиблиотеку.</p>
{:else if items.length === 0 && !isLoading}
  <p>
    {isDefaultQuery
      ? "Пока ничего нет — станьте первым!"
      : "Ничего не найдено."}
  </p>
{:else}
  <ul class="media-grid">
    {#each items as media (media.id)}
      <li>
        <a class="card" href={`/golder/${media.slug}`}>
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="thumb"
            onmouseenter={playCardVideo}
            onmouseleave={pauseCardVideo}
          >
            {#if media.contentType.startsWith("image/")}
              <img
                class="preview"
                src={media.url}
                alt={media.slug}
                loading="lazy"
              />
            {:else if media.contentType.startsWith("video/")}
              <!-- svelte-ignore a11y_media_has_caption -->
              <video
                class="preview"
                src={media.url}
                preload="metadata"
                loop
                playsinline
              ></video>
            {:else}
              <div class="preview preview-audio"><IconVideo /></div>
            {/if}
          </div>
          <div class="card-content">
            <h2 class="card-title">{media.name}</h2>
            {#if media.tags.length > 0}
              <div class="tags">
                {#each media.tags as tag (tag)}
                  <span
                    class="tag"
                    class:active={activeTags.includes(tag)}
                    role="button"
                    tabindex="0"
                    onclick={(event) => {
                      event.preventDefault();
                      toggleTag(tag);
                    }}
                    onkeydown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggleTag(tag);
                      }
                    }}
                  >
                    #{tag}
                  </span>
                {/each}
              </div>
            {/if}
            <p class="author">
              {#if media.uploadedByAvatarUrl}
                <img
                  class="author-avatar"
                  src={media.uploadedByAvatarUrl}
                  alt=""
                />
              {:else}
                <span class="author-avatar author-placeholder"
                  >{(media.uploadedByUsername ?? "?")[0]?.toUpperCase()}</span
                >
              {/if}
              {media.uploadedByUsername ?? "Неизвестный автор"}
            </p>
          </div>
        </a>
      </li>
    {/each}
  </ul>

  <div class="loader">
    {#if hasError}
      <button class="retry" type="button" onclick={loadMore}
        >Повторить загрузку</button
      >
    {:else if isLoading}
      <p>Загружаем...</p>
    {:else if hasMore}
      <button class="retry" type="button" onclick={loadMore}
        >Показать ещё</button
      >
    {/if}
  </div>
{/if}

<UploadModal open={isUploadOpen} onClose={() => (isUploadOpen = false)} />

<style>
  .search {
    margin-top: 1rem;
  }

  .toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .active-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .active-tag {
    border: 1px solid var(--color-primary);
    border-radius: 999px;
    padding: 0.25rem 0.75rem;
    background: transparent;
    color: var(--color-primary);
    font: inherit;
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
  }

  .media-grid {
    columns: 3 240px;
    column-gap: 1rem;
    list-style: none;
    margin: 1.5rem 0 0;
    padding: 0;
  }

  .media-grid li {
    break-inside: avoid;
    margin-bottom: 1rem;
  }

  .card {
    align-items: stretch;
    background-color: var(--color-bg-surface);
    border-radius: 0.5rem;
    color: var(--color-text);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    text-decoration: none;
    transition:
      opacity 180ms ease,
      transform 180ms ease;
  }

  .card:hover {
    opacity: 0.88;
    transform: translateY(-2px);
  }

  .thumb {
    background: color-mix(in srgb, var(--color-bg-surface) 80%, #000 20%);
    width: 100%;
  }

  .thumb :global(.preview),
  .preview {
    width: 100%;
    height: auto;
    display: block;
    /* вся карточка — ссылка; видео не должно ловить hover (popout-иконки) */
    pointer-events: none;
  }

  .preview-audio {
    aspect-ratio: 4 / 3;
    align-items: center;
    color: var(--color-text-secondary);
    display: flex;
    justify-content: center;
    font-size: 2rem;
  }

  .card-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0.375rem;
    min-width: 0;
    padding: 0.625rem;
  }

  .card-title {
    display: -webkit-box;
    font-size: 0.9375rem;
    font-weight: 600;
    line-height: 1.35;
    margin: 0;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .tag {
    border-radius: 999px;
    padding: 0.125rem 0.5rem;
    background: color-mix(in srgb, var(--color-primary) 16%, transparent);
    color: var(--color-text-secondary);
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
  }

  .tag.active {
    background: var(--color-primary);
    color: var(--color-text);
  }

  .author {
    align-items: center;
    color: var(--color-text-secondary);
    display: flex;
    font-size: 0.8125rem;
    gap: 0.375rem;
    margin: 0;
    margin-top: auto;
  }

  .author-avatar {
    border-radius: 50%;
    height: 1.125rem;
    object-fit: cover;
    width: 1.125rem;
  }

  .author-placeholder {
    align-items: center;
    background: color-mix(in srgb, var(--color-primary) 22%, transparent);
    color: var(--color-text);
    display: inline-flex;
    font-size: 0.625rem;
    font-weight: 700;
    justify-content: center;
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

  .retry {
    border: 0;
    border-radius: 0.5rem;
    background-color: var(--color-primary);
    color: var(--color-text);
    cursor: pointer;
    font: inherit;
    font-weight: 700;
    padding: 0.75rem 1rem;
  }

  @media (prefers-reduced-motion: reduce) {
    .card {
      transition: none;
    }

    .card:hover {
      transform: none;
    }
  }
</style>
