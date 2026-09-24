<script lang="ts">
import { createApi } from '$lib/api/api';

type TagInputProps = {
	value?: string[];
	maxTags?: number;
	placeholder?: string;
	disabled?: boolean;
};

let {
	value = $bindable([]),
	maxTags = 10,
	placeholder = 'Добавить тег',
	disabled = false
}: TagInputProps = $props();

let input = $state('');
let suggestions = $state<string[]>([]);
let isOpen = $state(false);
let activeIndex = $state(-1);
let rootElement: HTMLDivElement | undefined = $state();

let debounceTimer: ReturnType<typeof setTimeout> | undefined;
let suggestionsRequestId = 0;

const filteredSuggestions = $derived(suggestions.filter((tag) => !value.includes(tag)));
const canAddMore = $derived(value.length < maxTags);

function addTag(rawTag: string) {
	const tag = rawTag.trim().toLowerCase().slice(0, 32);
	if (!tag || !canAddMore || value.includes(tag)) return;

	value = [...value, tag];
	input = '';
	suggestions = [];
	isOpen = false;
	activeIndex = -1;
}

function removeTag(tag: string) {
	value = value.filter((existing) => existing !== tag);
}

function fetchSuggestions(query: string) {
	const requestId = ++suggestionsRequestId;
	const api = createApi({ fetch });

	api
		.suggestGolderTags(query)
		.then((result) => {
			if (requestId !== suggestionsRequestId) return;
			suggestions = result;
			isOpen = true;
			activeIndex = -1;
		})
		.catch(() => {
			// Автокомплит — best effort, ошибка не должна мешать вводу тегов
		});
}

function handleInput() {
	clearTimeout(debounceTimer);
	const query = input.trim();

	if (!query) {
		suggestions = [];
		isOpen = false;
		return;
	}

	debounceTimer = setTimeout(() => fetchSuggestions(query), 250);
}

function handleKeydown(event: KeyboardEvent) {
	if (event.key === 'Enter') {
		event.preventDefault();

		const suggested = isOpen ? filteredSuggestions[activeIndex] : undefined;
		addTag(suggested ?? input);
		return;
	}

	if (event.key === 'Backspace' && !input && value.length > 0) {
		value = value.slice(0, -1);
		return;
	}

	if (!isOpen || filteredSuggestions.length === 0) return;

	if (event.key === 'ArrowDown') {
		event.preventDefault();
		activeIndex = (activeIndex + 1) % filteredSuggestions.length;
	} else if (event.key === 'ArrowUp') {
		event.preventDefault();
		activeIndex = (activeIndex - 1 + filteredSuggestions.length) % filteredSuggestions.length;
	} else if (event.key === 'Escape') {
		isOpen = false;
	}
}

function handleFocus() {
	if (input.trim() && suggestions.length > 0) {
		isOpen = true;
	}
}

function handleBlur() {
	// Закрываем после возможного клика по подсказке (onmousedown её отменяет)
	setTimeout(() => {
		isOpen = false;
		activeIndex = -1;
	}, 150);
}

function handleSuggestionMousedown(event: MouseEvent) {
	event.preventDefault();
}

$effect(() => () => clearTimeout(debounceTimer));
</script>

<div class="tag-input" bind:this={rootElement} class:disabled>
  <div class="tags">
    {#each value as tag (tag)}
      <span class="tag">
        {tag}
        {#if !disabled}
          <button
            class="remove"
            type="button"
            aria-label={`Удалить тег ${tag}`}
            onclick={() => removeTag(tag)}
          >
            ×
          </button>
        {/if}
      </span>
    {/each}
    <input
      class="field"
      type="text"
      bind:value={input}
      {placeholder}
      {disabled}
      oninput={handleInput}
      onkeydown={handleKeydown}
      onfocus={handleFocus}
      onblur={handleBlur}
    />
  </div>

  {#if isOpen && filteredSuggestions.length > 0}
    <div class="suggestions">
      {#each filteredSuggestions as tag, index (tag)}
        <button
          class="suggestion"
          class:active={index === activeIndex}
          type="button"
          onmousedown={handleSuggestionMousedown}
          onclick={() => addTag(tag)}
        >
          {tag}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .tag-input {
    position: relative;
    width: 100%;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    width: 100%;
    min-height: 44px;
    border: 1px solid #212226;
    border-radius: 8px;
    padding: 6px 10px;
    background: var(--color-bg-surface);
    cursor: text;
  }

  .tag-input:focus-within .tags {
    border-color: var(--color-primary);
  }

  .tag-input.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border-radius: 999px;
    padding: 2px 6px 2px 10px;
    background: color-mix(in srgb, var(--color-primary) 22%, transparent);
    font-size: 13px;
    font-weight: 600;
  }

  .remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border: 0;
    border-radius: 50%;
    padding: 0;
    background: transparent;
    color: var(--color-text-secondary);
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
  }

  .remove:hover {
    color: var(--color-error);
  }

  .field {
    flex: 1;
    min-width: 120px;
    border: 0;
    padding: 4px 2px;
    background: transparent;
    color: var(--color-text);
    font: inherit;
    font-size: 14px;
  }

  .field:focus {
    outline: none;
  }

  .field::placeholder {
    color: var(--color-text-secondary);
  }

  .suggestions {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    z-index: 20;
    display: flex;
    flex-direction: column;
    max-height: 220px;
    overflow-y: auto;
    margin: 0;
    border: 1px solid #2a2c33;
    border-radius: 8px;
    padding: 4px;
    background: var(--color-bg);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  }

  .suggestion {
    border: 0;
    border-radius: 6px;
    padding: 8px 10px;
    background: transparent;
    color: var(--color-text);
    font: inherit;
    font-size: 14px;
    text-align: left;
    cursor: pointer;
  }

  .suggestion:hover,
  .suggestion.active {
    background: color-mix(in srgb, var(--color-primary) 18%, transparent);
  }
</style>
