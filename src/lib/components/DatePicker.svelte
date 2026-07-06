<script lang="ts">
import type { HTMLInputAttributes } from 'svelte/elements';

import { IconCalendar } from '$lib/assets/icons';

type DatePickerProps = Omit<HTMLInputAttributes, 'type' | 'value'> & {
	label: string;
	value?: string;
};

let fallbackId = $props.id();

let { value = $bindable(''), label, id = fallbackId, ...rest }: DatePickerProps = $props();

let textValue = $state(formatDate(value));
let nativeInput: HTMLInputElement | undefined = $state();

function formatDate(dateValue: string) {
	if (!dateValue) {
		return '';
	}

	const [year, month, day] = dateValue.split('-');

	if (!year || !month || !day) {
		return dateValue;
	}

	return `${day}.${month}.${year}`;
}

function parseDate(text: string) {
	const match = text.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

	if (!match) {
		return '';
	}

	const [, day, month, year] = match;
	const parsedDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

	if (
		Number.isNaN(parsedDate.getTime()) ||
		parsedDate.getUTCFullYear() !== Number(year) ||
		parsedDate.getUTCMonth() + 1 !== Number(month) ||
		parsedDate.getUTCDate() !== Number(day)
	) {
		return '';
	}

	return `${year}-${month}-${day}`;
}

function formatInputText(text: string) {
	const digits = text.replace(/\D/g, '').slice(0, 8);
	const day = digits.slice(0, 2);
	const month = digits.slice(2, 4);
	const year = digits.slice(4, 8);

	return [day, month, year].filter(Boolean).join('.');
}

function countDigitsBeforeCaret(text: string, caretPosition: number) {
	return text.slice(0, caretPosition).replace(/\D/g, '').length;
}

function getCaretPositionByDigitCount(text: string, digitCount: number) {
	if (digitCount <= 0) {
		return 0;
	}

	let currentDigitCount = 0;

	for (let index = 0; index < text.length; index += 1) {
		if (/\d/.test(text[index])) {
			currentDigitCount += 1;
		}

		if (currentDigitCount === digitCount) {
			return index + 1;
		}
	}

	return text.length;
}

function handleTextInput(event: Event) {
	const target = event.currentTarget as HTMLInputElement;
	const digitCountBeforeCaret = countDigitsBeforeCaret(target.value, target.selectionStart ?? 0);
	textValue = formatInputText(target.value);
	target.value = textValue;
	target.setSelectionRange(
		getCaretPositionByDigitCount(textValue, digitCountBeforeCaret),
		getCaretPositionByDigitCount(textValue, digitCountBeforeCaret)
	);
	value = parseDate(textValue);
}

function handleNativeInput(event: Event) {
	const target = event.currentTarget as HTMLInputElement;
	value = target.value;
	textValue = formatDate(value);
}

function openPicker() {
	const input = nativeInput;

	if (!input) {
		return;
	}

	if (typeof input.showPicker === 'function') {
		input.showPicker();
		return;
	}

	input.focus();
	input.click();
}

$effect(() => {
	const formattedValue = formatDate(value);

	if (formattedValue !== textValue && value !== parseDate(textValue)) {
		textValue = formattedValue;
	}
});
</script>

<div class="date-picker">
  <label for={id}>{label}</label>
  <div class="date-control">
    <button
      class="calendar-button"
      type="button"
      aria-label="Открыть календарь"
      onclick={openPicker}
    >
      <IconCalendar />
    </button>
    <input
      {id}
      class="date-text"
      type="text"
      inputmode="numeric"
      placeholder="дд.мм.гггг"
      value={textValue}
      oninput={handleTextInput}
      {...rest}
    />
    <input
      bind:this={nativeInput}
      class="native-date"
      type="date"
      {value}
      tabindex="-1"
      aria-hidden="true"
      oninput={handleNativeInput}
    />
  </div>
</div>

<style>
  .date-picker {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  label {
    font-size: 14px;
    font-weight: 700;
  }

  .date-control {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 48px;
    border: 1px solid #212226;
    border-radius: 8px;
    background: var(--color-bg-surface);
    color: var(--color-text-secondary);
    transition: border-color 0.2s ease;
  }

  .date-control:focus-within {
    border-color: var(--color-primary);
  }

  .date-text {
    width: 100%;
    min-width: 0;
    height: 46px;
    border: 0;
    padding: 0 16px 0 52px;
    background: transparent;
    color: var(--color-text);
    font-size: 1rem;
    caret-color: var(--color-primary);
  }

  .date-text::placeholder {
    color: var(--color-text-secondary);
  }

  .date-text:focus {
    outline: none;
  }

  .calendar-button {
    position: absolute;
    left: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
  }

  .calendar-button :global(svg) {
    width: 18px;
    height: 18px;
  }

  .calendar-button:hover {
    color: var(--color-text);
    background: rgba(255, 255, 255, 0.05);
  }

  .calendar-button:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .native-date {
    position: fixed;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  .native-date:focus {
    outline: none;
  }
</style>
