<script lang="ts">
import SkeletonImage from '$lib/components/SkeletonImage.svelte';

import type { ProjectFormState } from './project-editor';
import { PROJECT_TYPE_LABELS } from './project-type';

let { form }: { form: ProjectFormState } = $props();

const cover = $derived(form.banner?.url ?? null);
const title = $derived(form.title.trim() || 'Название проекта');
const slug = $derived(form.slug || 'адрес-проекта');
const description = $derived(form.description.trim());
</script>

<div class="preview-card">
	<p class="preview-title">Предпросмотр</p>

	<div class="card">
		{#if cover}
			<SkeletonImage class="cover" src={cover} alt={title} />
		{:else}
			<div class="cover placeholder">Обложка появится после загрузки изображения</div>
		{/if}

		<div class="body">
			<span class="badge">{PROJECT_TYPE_LABELS[form.type]}</span>
			<h2>{title}</h2>
			<p class="slug">/projects/{slug}</p>
			{#if description}
				<p class="description">{description}</p>
			{/if}
			{#if form.tags.length > 0}
				<div class="tags">
					{#each form.tags.slice(0, 3) as tag (tag.name)}
						<span class="tag">{tag.name}</span>
					{/each}
					{#if form.tags.length > 3}
						<span class="tag more">+{form.tags.length - 3}</span>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.preview-title {
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		margin: 0 0 0.75rem;
	}

	.card {
		background: var(--color-bg-surface);
		border: 1px solid #303238;
		border-radius: 0.75rem;
		overflow: hidden;
		position: sticky;
		top: 1rem;
	}

	.cover {
		aspect-ratio: 16 / 9;
		border-radius: 0;
		width: 100%;
	}

	.cover.placeholder {
		align-items: center;
		background: color-mix(in srgb, var(--color-bg-surface) 55%, transparent);
		color: var(--color-text-secondary);
		display: flex;
		font-size: 0.8125rem;
		padding: 1rem;
		text-align: center;
	}

	.body {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
	}

	.badge {
		align-self: flex-start;
		background: var(--color-primary);
		border-radius: 0.25rem;
		color: var(--color-text);
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		padding: 0.2rem 0.4rem;
		text-transform: uppercase;
	}

	h2 {
		font-size: 1.1rem;
		margin: 0;
	}

	.slug,
	.description {
		color: var(--color-text-secondary);
		font-size: 0.8125rem;
		margin: 0;
	}

	.description {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		overflow: hidden;
		white-space: pre-line;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.tag {
		background: color-mix(in srgb, var(--color-primary) 15%, transparent);
		border-radius: 0.25rem;
		color: var(--color-primary);
		font-size: 0.75rem;
		font-weight: 500;
		padding: 0.125rem 0.375rem;
	}

	.tag.more {
		background: transparent;
		color: var(--color-text-secondary);
	}
</style>
