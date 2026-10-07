<script lang="ts">
import Button from '$lib/components/Button.svelte';
import { showSnackbar } from '$lib/components/snackbar';

import type { ProjectFormImage } from './project-editor';
import { isAcceptableImageSize, isSupportedImage, uploadProjectImage } from './project-uploads';

let {
	value = $bindable(null),
	disabled = false,
	error = undefined
}: {
	value: ProjectFormImage | null;
	disabled?: boolean;
	error?: string;
} = $props();

let fileInput = $state<HTMLInputElement>();
let uploading = $state(false);
let progress = $state(0);
let localError = $state<string | null>(null);

async function handleFile(event: Event) {
	const input = event.currentTarget as HTMLInputElement;
	const file = input.files?.[0];
	input.value = '';
	if (!file) return;
	localError = null;
	if (!isSupportedImage(file)) {
		localError = 'Поддерживаются только изображения.';
		return;
	}
	if (!isAcceptableImageSize(file)) {
		localError = 'Изображение должно быть меньше 25 МБ.';
		return;
	}
	value = { upload_id: null, url: URL.createObjectURL(file) };
	uploading = true;
	progress = 0;
	try {
		const upload = await uploadProjectImage('banner', file, (percent) => (progress = percent));
		progress = 100;
		value = { upload_id: upload.id, url: upload.url };
	} catch {
		showSnackbar({
			message: 'Не удалось загрузить изображение. Попробуйте ещё раз.',
			variant: 'error'
		});
	} finally {
		uploading = false;
	}
}
</script>

<div class="image-field">
	{#if value?.url}
		<img src={value.url} alt="Предпросмотр баннера" />
		{#if uploading}
			<span class="progress"><i style:width={`${progress}%`}></i></span>
			<span class="uploading">Загрузка… {progress}%</span>
		{/if}
		{#if !disabled && !uploading}
			<div class="image-actions">
				<Button type="button" variant="outline" onclick={() => fileInput?.click()}>Заменить</Button>
				<Button type="button" variant="outline" onclick={() => (value = null)}>Убрать</Button>
			</div>
		{/if}
	{:else}
		<button
			type="button"
			class="dropzone"
			disabled={disabled || uploading}
			onclick={() => fileInput?.click()}
		>
			{uploading ? `Загрузка… ${progress}%` : 'Загрузить баннер'}
			{#if uploading}
				<span class="progress"><i style:width={`${progress}%`}></i></span>
			{/if}
		</button>
	{/if}
	<input bind:this={fileInput} type="file" accept="image/*" hidden onchange={handleFile} />
	{#if error || localError}<p class="error">{error ?? localError}</p>{/if}
</div>

<style>
	.image-field img {
		aspect-ratio: 16 / 9;
		border: 1px solid #303238;
		border-radius: 0.5rem;
		display: block;
		max-width: 22rem;
		object-fit: cover;
		width: 100%;
	}

	.uploading {
		color: var(--color-text-secondary);
		display: block;
		font-size: 0.8125rem;
		margin-top: 0.35rem;
	}

	.progress {
		background: color-mix(in srgb, var(--color-text-secondary) 25%, transparent);
		border-radius: 999px;
		display: block;
		height: 0.3rem;
		margin-top: 0.45rem;
		overflow: hidden;
		width: 100%;
	}

	.progress i {
		background: var(--color-primary);
		display: block;
		height: 100%;
		transition: width 0.15s ease-out;
	}

	.dropzone {
		position: relative;
	}


	.image-actions {
		display: flex;
		gap: 0.35rem;
		margin-top: 0.5rem;
	}

	.dropzone {
		align-items: center;
		aspect-ratio: 16 / 9;
		background: color-mix(in srgb, var(--color-bg-surface) 55%, transparent);
		border: 1px dashed #3a3c43;
		border-radius: 0.5rem;
		color: var(--color-text-secondary);
		cursor: pointer;
		display: flex;
		font: inherit;
		justify-content: center;
		max-width: 22rem;
		padding: 0.75rem;
		width: 100%;
	}

	.dropzone:hover:not(:disabled) {
		border-color: var(--color-primary);
		color: var(--color-text);
	}

	.dropzone:disabled {
		cursor: default;
		opacity: 0.7;
	}

	.error {
		color: var(--color-error);
		font-size: 0.85rem;
		margin: 0.4rem 0 0;
	}
</style>
