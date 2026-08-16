<script lang="ts">
import Button from '$lib/components/Button.svelte';
import Modal from '$lib/components/Modal.svelte';
import { showSnackbar } from '$lib/components/snackbar';
import { COINS_TOP } from '$lib/site-config';

import { addMotd } from './AddMotdModal.api';
import { isEmptyMotdContent, normalizeMotdContent } from './AddMotdModal.validation';

type AddMotdModalProps = {
	open: boolean;
	onClose: () => void;
};

let { open, onClose }: AddMotdModalProps = $props();

let content = $state('');
let errorMessage = $state('');
let closeError = $state('');
let isSubmitting = $state(false);
let shakeToken = $state(0);

const isDirty = $derived(!isEmptyMotdContent(content));

function resetForm() {
	content = '';
	errorMessage = '';
	closeError = '';
	isSubmitting = false;
}

function requestClose() {
	if (isDirty) {
		closeError = 'У вас есть несохранённые изменения. Сохраните их перед закрытием.';
		shakeToken += 1;
		return;
	}

	closeError = '';
	onClose();
}

async function handleSubmit(event: SubmitEvent) {
	event.preventDefault();

	if (isSubmitting) {
		return;
	}

	errorMessage = '';
	isSubmitting = true;

	try {
		const result = await addMotd(normalizeMotdContent(content));
		showSnackbar({
			message: `MOTD добавлен. Баланс: ${Number(result.balance_after).toLocaleString('ru-RU')}`,
			variant: 'success'
		});
		onClose();
	} catch (error) {
		errorMessage = error instanceof Error ? error.message : 'Не удалось добавить MOTD.';
		shakeToken += 1;
	} finally {
		isSubmitting = false;
	}
}

$effect(() => {
	if (open) {
		resetForm();
	}
});

$effect(() => {
	if (!isDirty) {
		closeError = '';
	}
});
</script>

<Modal {open} title="Добавить MOTD" onClose={requestClose} {shakeToken}>
  <form class="motd-form" onsubmit={handleSubmit}>
    {#if closeError}
      <p class="error" role="alert">{closeError}</p>
    {/if}

    <label class="field">
      <span>Сообщение</span>
      <textarea
        bind:value={content}
        rows="4"
        placeholder="Введите текст сообщения дня"
        disabled={isSubmitting}
      ></textarea>
    </label>

    <p class="cost">
      <img class="coin" src={COINS_TOP} alt="" />
      Стоимость добавления — 1 000 монет
    </p>

    <div class="actions">
      <Button
        type="button"
        variant="ghost"
        onclick={requestClose}
        disabled={isSubmitting}
      >
        Отмена
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting || isEmptyMotdContent(content)}
      >
        {isSubmitting ? "Добавление..." : "Добавить"}
      </Button>
    </div>

    {#if errorMessage}
      <p class="error" role="alert">{errorMessage}</p>
    {/if}
  </form>
</Modal>

<style>
  .motd-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
  }

  textarea {
    width: 100%;
    resize: vertical;
    border: 1px solid #212226;
    border-radius: 8px;
    padding: 12px 16px;
    background: var(--color-bg-surface);
    color: var(--color-text);
    font: inherit;
    font-weight: 400;
  }

  textarea:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  textarea:disabled {
    opacity: 0.5;
  }

  .cost {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 14px;
    font-weight: 500;
  }

  .coin {
    width: 24px;
    height: 24px;
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
