<script lang="ts">
import { type GolderMedia } from '$lib/api/api.type';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import Button from '$lib/components/Button.svelte';
import { showSnackbar } from '$lib/components/snackbar';

import type { PageProps } from './$types';

let { data }: PageProps = $props();

const media = $derived(data.media);

let userLocale = $state('ru-RU');
$effect(() => {
	userLocale = navigator.language || 'ru-RU';
});

const uploadedAt = $derived(formatDate(media.createdAt, userLocale));
const size = $derived(formatSize(Number(media.sizeBytes)));
const isImage = $derived(media.contentType.startsWith('image/'));
const isVideo = $derived(media.contentType.startsWith('video/'));

function formatDate(datetime: string, locale: string): string {
	const date = new Date(datetime);
	if (Number.isNaN(date.getTime())) return datetime;

	return new Intl.DateTimeFormat(locale, {
		dateStyle: 'medium',
		timeStyle: 'short'
	}).format(date);
}

function formatSize(bytes: number): string {
	if (!Number.isFinite(bytes) || bytes <= 0) return '0 Б';
	if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
	if (bytes >= 1024) return `${Math.round(bytes / 1024)} КБ`;
	return `${bytes} Б`;
}

async function copyLink(value: string, label: string) {
	try {
		await navigator.clipboard.writeText(value);
		showSnackbar({ message: `${label} скопирована.`, variant: 'success' });
	} catch {
		showSnackbar({
			message: 'Не удалось скопировать ссылку — скопируйте её вручную.',
			variant: 'error'
		});
	}
}
</script>

<svelte:head>
  <title>{media.slug} | Russian Gamedev</title>
</svelte:head>

<Breadcrumb
  items={[
    { label: "Главная", href: "/" },
    { label: "Golder", href: "/golder" },
    { label: media.name, href: `/golder/${media.slug}` },
  ]}
/>

<div class="detail">
  <div class="preview">
    {#if isImage}
      <img src={media.url} alt={media.slug} />
    {:else if isVideo}
      <!-- svelte-ignore a11y_media_has_caption -->
      <video src={media.url} controls preload="metadata" playsinline></video>
    {:else}
      <audio src={media.url} controls></audio>
    {/if}
  </div>

  <aside class="info">
    <h1>{media.name}</h1>

    {#if media.tags.length > 0}
      <ul class="tags">
        {#each media.tags as tag (tag)}
          <li class="tag">#{tag}</li>
        {/each}
      </ul>
    {/if}

    <dl class="meta">
      <div class="meta-row">
        <dt>Загрузил</dt>
        <dd>
          <span class="author">
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
          </span>
        </dd>
      </div>
      <div class="meta-row">
        <dt>Дата</dt>
        <dd>{uploadedAt}</dd>
      </div>
      <div class="meta-row">
        <dt>Тип</dt>
        <dd>{media.contentType}</dd>
      </div>
      <div class="meta-row">
        <dt>Размер</dt>
        <dd>{size}</dd>
      </div>
    </dl>

    <div class="actions">
      <Button onclick={() => copyLink(media.url, "Ссылка на файл")}>
        Скопировать ссылку
      </Button>
    </div>
  </aside>
</div>

<style>
  .detail {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: minmax(0, 2fr) minmax(240px, 1fr);
    margin-top: 1.5rem;
  }

  .preview {
    align-items: center;
    background: color-mix(in srgb, var(--color-bg-surface) 80%, #000 20%);
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
    min-height: 320px;
    overflow: hidden;
  }

  .preview :global(img) {
    display: block;
    max-height: 80vh;
    max-width: 100%;
    object-fit: contain;
  }

  .preview video {
    max-height: 80vh;
    width: 100%;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 0;
  }

  h1 {
    font-size: 1.5rem;
    margin: 0;
    overflow-wrap: anywhere;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .tag {
    border-radius: 999px;
    padding: 0.25rem 0.625rem;
    background: color-mix(in srgb, var(--color-primary) 16%, transparent);
    color: var(--color-text-secondary);
    font-size: 0.8125rem;
    font-weight: 600;
  }

  .meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 0;
  }

  .meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .author {
    align-items: center;
    display: inline-flex;
    gap: 0.375rem;
  }

  .author-avatar {
    border-radius: 50%;
    height: 1.25rem;
    object-fit: cover;
    width: 1.25rem;
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

  dt {
    color: var(--color-text-secondary);
  }

  dd {
    margin: 0;
    overflow-wrap: anywhere;
    text-align: right;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: auto;
    padding-top: 0.5rem;
  }

  @media (max-width: 767px) {
    .detail {
      grid-template-columns: 1fr;
    }
  }
</style>
