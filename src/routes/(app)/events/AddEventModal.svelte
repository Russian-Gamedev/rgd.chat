<script lang="ts">
import type { GuildEventName } from '$lib/api/api.type';
import Button from '$lib/components/Button.svelte';
import Modal from '$lib/components/Modal.svelte';
import { showSnackbar } from '$lib/components/snackbar';
import { COINS_TOP } from '$lib/site-config';

import { addEvent } from './AddEventModal.api';
import { eventNames, isGuildEventName } from './events.shared';
import { extractTemplateParams, renderTemplate } from './template';

type AddEventModalProps = {
	open: boolean;
	onClose: () => void;
};

let { open, onClose }: AddEventModalProps = $props();

let eventName = $state<GuildEventName>('member_join');
let message = $state('');
let paramValues = $state<Record<string, string>>({});
let errorMessage = $state('');
let closeError = $state('');
let isSubmitting = $state(false);
let shakeToken = $state(0);

const isDirty = $derived(message.trim().length > 0);
const templateParams = $derived(extractTemplateParams(message));
const preview = $derived(renderTemplate(message, paramValues));

function resetForm() {
	eventName = 'member_join';
	message = '';
	paramValues = {};
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

function handleEventChange(event: Event) {
	const target = event.currentTarget;

	if (target instanceof HTMLSelectElement && isGuildEventName(target.value)) {
		eventName = target.value;
	}
}

async function handleSubmit(event: SubmitEvent) {
	event.preventDefault();

	if (isSubmitting) {
		return;
	}

	errorMessage = '';
	isSubmitting = true;

	try {
		const result = await addEvent(eventName, message.trim());
		showSnackbar({
			message: `Событие добавлено. Баланс: ${Number(result.balance_after).toLocaleString('ru-RU')}`,
			variant: 'success'
		});
		onClose();
	} catch (error) {
		errorMessage = error instanceof Error ? error.message : 'Не удалось добавить событие.';
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

<Modal {open} title="Добавить событие" onClose={requestClose} {shakeToken}>
  <form class="event-form" onsubmit={handleSubmit}>
    {#if closeError}
      <p class="error" role="alert">{closeError}</p>
    {/if}

    <label class="field">
      <span>Событие</span>
      <select bind:value={eventName} onchange={handleEventChange} disabled={isSubmitting}>
        {#each Object.entries(eventNames) as [value, label] (value)}
          <option value={value}>{label}</option>
        {/each}
      </select>
    </label>

    <label class="field">
      <span>Сообщение</span>
      <textarea
        bind:value={message}
        rows="4"
        placeholder="Введите шаблон сообщения, например: Прощай, ${'{'}user{'}'}!"
        disabled={isSubmitting}
      ></textarea>
    </label>

    <details class="preview">
      <summary>Предпросмотр</summary>
      <div class="preview-body">
        {#if templateParams.length > 0}
          <div class="params">
            {#each templateParams as name (name)}
              <label class="param-row">
                <span class="param-name">{name}</span>
                <input
                  type="text"
                  bind:value={paramValues[name]}
                  placeholder={`Значение ${name}`}
                  disabled={isSubmitting}
                />
              </label>
            {/each}
          </div>
        {:else}
          <p class="hint">
            Добавьте в текст подстановки в формате
            <code>${'{'}user{'}'}</code>, чтобы задать их значения для
            предпросмотра
          </p>
        {/if}
        <p class="preview-box">{preview || message}</p>
      </div>
    </details>

    <p class="cost">
      <img class="coin" src={COINS_TOP} alt="" />
      Стоимость добавления — 10 000 монет
    </p>

    <div class="actions">
      <Button
        type="button"
        variant="ghost"
        onclick={onClose}
        disabled={isSubmitting}
      >
        Отмена
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting || !isDirty}
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
  .event-form {
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

  select,
  textarea {
    width: 100%;
    border: 1px solid #212226;
    border-radius: 8px;
    padding: 12px 16px;
    background: var(--color-bg-surface);
    color: var(--color-text);
    font: inherit;
    font-weight: 400;
  }

  textarea {
    resize: vertical;
  }

  select:focus,
  textarea:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  select:disabled,
  textarea:disabled {
    opacity: 0.5;
  }

  .preview {
    border: 1px solid #212226;
    border-radius: 8px;
    background: var(--color-bg-surface);
  }

  .preview[open] {
    padding-bottom: 14px;
  }

  summary {
    padding: 12px 16px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    user-select: none;
  }

  .preview-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 16px;
  }

  .params {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .param-row {
    display: grid;
    grid-template-columns: 120px 1fr;
    align-items: center;
    gap: 8px;
    font-weight: 400;
  }

  .param-name {
    color: var(--color-text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .param-row input {
    width: 100%;
    border: 1px solid #212226;
    border-radius: 6px;
    padding: 8px 12px;
    background: var(--color-bg);
    color: var(--color-text);
    font: inherit;
  }

  .param-row input:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  .param-row input:disabled {
    opacity: 0.5;
  }

  .hint {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 13px;
    font-weight: 400;
  }

  .hint code {
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--color-bg);
    font-size: 12px;
  }

  .preview-box {
    margin: 0;
    min-height: 44px;
    padding: 10px 12px;
    border: 1px dashed
      color-mix(in srgb, var(--color-text) 20%, transparent);
    border-radius: 6px;
    white-space: pre-wrap;
    word-break: break-word;
    font-weight: 400;
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
