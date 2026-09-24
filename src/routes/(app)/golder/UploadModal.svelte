<script lang="ts">
import { untrack } from 'svelte';

import Button from '$lib/components/Button.svelte';
import Modal from '$lib/components/Modal.svelte';
import { showSnackbar } from '$lib/components/snackbar';
import TagInput from '$lib/components/TagInput.svelte';

import { importGolderMediaFromDiscord, uploadGolderMedia } from './UploadModal.api';
import {
	GOLDER_MAX_TAGS,
	GOLDER_NAME_MAX_LENGTH,
	isAcceptableSize,
	isDiscordMessageUrl,
	isHttpUrl,
	isNameValid,
	isSupportedFile,
	nameFromFile
} from './UploadModal.validation';

type UploadModalProps = {
	open: boolean;
	onClose: () => void;
};

type UploadMode = 'file' | 'discord';

let { open, onClose }: UploadModalProps = $props();

let mode = $state<UploadMode>('file');
let file = $state<File | null>(null);
let url = $state('');
let name = $state('');
let tags = $state<string[]>([]);
let errorMessage = $state('');
let closeError = $state('');
let closeConfirmPending = $state(false);
let shakeToken = $state(0);
let isSubmitting = $state(false);
let isUploading = $state(false);
let fileInput: HTMLInputElement | undefined = $state();

const isDirty = $derived(file !== null || name.length > 0 || tags.length > 0 || url.length > 0);
const urlValid = $derived(isDiscordMessageUrl(url.trim()) || isHttpUrl(url.trim()));
const canSubmit = $derived(
	!isSubmitting && isNameValid(name) && (mode === 'file' ? file !== null : urlValid)
);

function resetForm() {
	mode = 'file';
	file = null;
	url = '';
	name = '';
	tags = [];
	errorMessage = '';
	closeError = '';
	closeConfirmPending = false;
	isSubmitting = false;
	isUploading = false;
	if (fileInput) {
		fileInput.value = '';
	}
}

function switchMode(next: UploadMode) {
	if (isSubmitting) return;
	errorMessage = '';
	mode = next;
}

function requestClose() {
	if (isSubmitting || isUploading) {
		return;
	}

	if (isDirty && !closeConfirmPending) {
		closeConfirmPending = true;
		closeError = 'Изменения не сохранятся. Нажмите «Отмена» ещё раз, чтобы закрыть без сохранения.';
		shakeToken += 1;
		return;
	}

	closeError = '';
	closeConfirmPending = false;
	onClose();
}

$effect(() => {
	if (!isDirty) {
		closeConfirmPending = false;
		closeError = '';
	}
});

function handleFileChange(event: Event) {
	const selected = (event.target as HTMLInputElement).files?.[0] ?? null;
	errorMessage = '';

	if (selected === null) {
		file = null;
		return;
	}

	if (!isSupportedFile(selected)) {
		errorMessage = 'Поддерживаются только изображения, видео и аудио.';
		file = null;
		if (fileInput) {
			fileInput.value = '';
		}
		return;
	}

	if (!isAcceptableSize(selected.size)) {
		errorMessage = 'Файл слишком большой — максимум 100 МБ.';
		file = null;
		if (fileInput) {
			fileInput.value = '';
		}
		return;
	}

	file = selected;
	if (!name) {
		name = nameFromFile(selected.name);
	}
}

async function handleSubmit(event: SubmitEvent) {
	event.preventDefault();

	if (isSubmitting || !canSubmit) {
		return;
	}

	errorMessage = '';
	isSubmitting = true;

	try {
		let message: string;

		if (mode === 'file') {
			const media = await uploadGolderMedia(file as File, name.trim(), tags);
			message = `Файл загружен: ${media.name}`;
		} else {
			const items = await importGolderMediaFromDiscord(url.trim(), name.trim(), tags);
			message = `Импортировано в Golder: ${items.map((item) => item.name).join(', ')}`;
		}

		showSnackbar({ message, variant: 'success' });
		onClose();
	} catch (error) {
		errorMessage = error instanceof Error ? error.message : 'Не удалось загрузить файл.';
	} finally {
		isSubmitting = false;
		isUploading = false;
	}
}

// Сброс формы при открытии: resetForm трогает fileInput (bind:this),
// поэтому заворачиваем в untrack — эффект должен зависеть только от open.
$effect(() => {
	if (open) {
		untrack(() => resetForm());
	}
});
</script>

<Modal {open} title="Загрузить в Golder" onClose={requestClose} {shakeToken}>
  <form class="upload-form" onsubmit={handleSubmit}>
    {#if closeError}
      <p class="error" role="alert">{closeError}</p>
    {/if}

    <div class="mode-switch">
      <Button
        type="button"
        variant={mode === 'file' ? 'solid' : 'ghost'}
        onclick={() => switchMode('file')}
        disabled={isSubmitting}
      >
        Файл
      </Button>
      <Button
        type="button"
        variant={mode === 'discord' ? 'solid' : 'ghost'}
        onclick={() => switchMode('discord')}
        disabled={isSubmitting}
      >
        Из Discord
      </Button>
    </div>

    {#if mode === 'file'}
      <label class="field">
        <span>Файл</span>
        <input
          bind:this={fileInput}
          type="file"
          accept="image/*,video/*,audio/*"
          onchange={handleFileChange}
          disabled={isSubmitting}
        />
        {#if file}
          <span class="file-hint">
            {file.name} ({(file.size / (1024 * 1024)).toFixed(1)} МБ)
          </span>
        {/if}
      </label>
    {:else}
      <label class="field">
        <span>Ссылка на сообщение или файл</span>
        <input
          class="text-input"
          type="url"
          bind:value={url}
          placeholder="https://discord.com/channels/…"
          maxlength={1024}
          disabled={isSubmitting}
        />
        <span class="hint">
          Ссылка на сообщение Discord (включая пересланные) или прямой URL
          файла — картинки, видео и аудио до 100 МБ.
        </span>
      </label>
    {/if}

    <label class="field">
      <span>Название</span>
      <input
        class="text-input"
        type="text"
        bind:value={name}
        placeholder="Котик играет в мяч"
        maxlength={GOLDER_NAME_MAX_LENGTH}
        disabled={isSubmitting}
      />
      <span class="hint">Как назвать это медиа — на русском или любом языке.</span>
    </label>

    <div class="field">
      <span>Теги</span>
      <TagInput bind:value={tags} maxTags={GOLDER_MAX_TAGS} disabled={isSubmitting} />
      <span class="hint">До 10 тегов, например: мем, арт, гайд.</span>
    </div>

    <div class="actions">
      <Button
        type="button"
        variant="ghost"
        onclick={requestClose}
        disabled={isSubmitting}
      >
        Отмена
      </Button>
      <Button type="submit" disabled={!canSubmit}>
        {isUploading
          ? 'Загрузка файла...'
          : isSubmitting
            ? mode === 'file'
              ? 'Публикуем...'
              : 'Импортируем...'
            : mode === 'file'
              ? 'Загрузить'
              : 'Импортировать'}
      </Button>
    </div>

    {#if errorMessage}
      <p class="error" role="alert">{errorMessage}</p>
    {/if}
  </form>
</Modal>

<style>
  .upload-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .mode-switch {
    display: flex;
    gap: 8px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
  }

  .text-input {
    width: 100%;
    border: 1px solid #212226;
    border-radius: 8px;
    padding: 12px 16px;
    background: var(--color-bg-surface);
    color: var(--color-text);
    font: inherit;
    font-weight: 400;
  }

  .text-input:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  .text-input:disabled {
    opacity: 0.5;
  }

  .file-hint {
    color: var(--color-text-secondary);
    font-size: 13px;
    font-weight: 500;
  }

  .hint {
    color: var(--color-text-secondary);
    font-size: 13px;
    font-weight: 500;
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 6px;
  }

  .error {
    margin: 0;
    padding: 12px 14px;
    border: 1px solid color-mix(in srgb, var(--color-error) 45%, transparent);
    border-radius: 8px;
    background: color-mix(in srgb, var(--color-bg-surface) 90%, var(--color-error) 10%);
    color: var(--color-error);
    font-size: 14px;
    font-weight: 600;
  }

  @media (max-width: 767px) {
    .actions {
      align-items: stretch;
      flex-direction: column;
    }

    .actions :global(.button) {
      width: 100%;
    }
  }
</style>
