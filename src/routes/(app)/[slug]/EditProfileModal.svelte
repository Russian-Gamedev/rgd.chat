<script lang="ts">
import type { ProfileLink, User } from '$lib/api/api.type';
import Button from '$lib/components/Button.svelte';
import DatePicker from '$lib/components/DatePicker.svelte';
import IconPicker from '$lib/components/IconPicker.svelte';
import Input from '$lib/components/Input.svelte';
import Modal from '$lib/components/Modal.svelte';
import { showSnackbar } from '$lib/components/snackbar';

import { updateProfile } from './EditProfileModal.api';
import {
	buildProfilePayload,
	DEFAULT_LINK_ICON,
	type EditableProfileLink,
	MAX_LINKS,
	normalizeIconKey
} from './EditProfileModal.validation';

type EditProfileModalProps = {
	open: boolean;
	user: User;
	onClose: () => void;
	onSaved: (user: User) => void;
};

let { open, user, onClose, onSaved }: EditProfileModalProps = $props();

let bannerAlt = $state('');
let birthDate = $state('');
let about = $state('');
let links = $state<EditableProfileLink[]>([]);
let errorMessage = $state('');
let closeError = $state('');
let shakeToken = $state(0);
let isSubmitting = $state(false);
let nextLinkId = 1;

const canAddLink = $derived(links.length < MAX_LINKS);
const aboutLength = $derived(about.length);
const isDirty = $derived.by(() => {
	const initialBannerAlt = user.bannerAlt ?? '';
	if (bannerAlt !== initialBannerAlt) {
		return true;
	}

	const initialBirthDate = toDateInputValue(user.birthDate);
	if (birthDate !== initialBirthDate) {
		return true;
	}

	const initialAbout = user.info?.about ?? user.about ?? '';
	if (about !== initialAbout) {
		return true;
	}

	const initialLinks = (user.info?.links ?? [])
		.slice(0, 5)
		.map((link) => ({ label: link.label, icon: normalizeIconKey(link.icon), url: link.url }));

	if (links.length !== initialLinks.length) {
		return true;
	}

	return links.some(
		(link, index) =>
			link.label !== initialLinks[index].label ||
			link.icon !== initialLinks[index].icon ||
			link.url !== initialLinks[index].url
	);
});

function toDateInputValue(value: string | null | undefined) {
	if (!value) {
		return '';
	}

	const parsedDate = new Date(value);

	if (Number.isNaN(parsedDate.getTime())) {
		return '';
	}

	return parsedDate.toISOString().slice(0, 10);
}

function toEditableLink(link: ProfileLink): EditableProfileLink {
	return {
		id: nextLinkId++,
		label: link.label,
		icon: normalizeIconKey(link.icon),
		url: link.url
	};
}

function resetForm() {
	bannerAlt = user.bannerAlt ?? '';
	birthDate = toDateInputValue(user.birthDate);
	about = user.info?.about ?? user.about ?? '';
	links = (user.info?.links ?? []).slice(0, 5).map(toEditableLink);
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

function addLink() {
	if (!canAddLink) {
		return;
	}

	links = [...links, { id: nextLinkId++, label: '', icon: DEFAULT_LINK_ICON, url: '' }];
}

function removeLink(id: number) {
	links = links.filter((link) => link.id !== id);
}

function updateLink(id: number, field: keyof ProfileLink, value: string) {
	links = links.map((link) => (link.id === id ? { ...link, [field]: value } : link));
}

async function handleSubmit(event: SubmitEvent) {
	event.preventDefault();

	if (isSubmitting) {
		return;
	}

	errorMessage = '';
	isSubmitting = true;

	try {
		const payload = buildProfilePayload({ bannerAlt, birthDate, about, links });
		const updatedUser = await updateProfile(payload);
		onSaved(updatedUser);
		showSnackbar({
			message: 'Профиль обновлен.',
			variant: 'success'
		});
		onClose();
	} catch (error) {
		errorMessage = error instanceof Error ? error.message : 'Не удалось сохранить профиль.';
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

<Modal {open} title="Редактирование профиля" onClose={requestClose} {shakeToken}>
  <form class="profile-form" onsubmit={handleSubmit}>
    {#if closeError}
      <p class="error" role="alert">{closeError}</p>
    {/if}

    <label class="field">
      <span>Кастомный баннер</span>
      <Input
        type="url"
        inputmode="url"
        bind:value={bannerAlt}
        placeholder="https://example.com/banner-alt.png"
      />
      <span class="hint">
        Используется только внутри сайта. Формат: прямая ссылка на изображение.
      </span>
    </label>

    <DatePicker label="Дата рождения" bind:value={birthDate} />

    <label class="field">
      <span>О себе</span>
      <textarea bind:value={about} maxlength="2000" rows="7"></textarea>
      <span class="counter">{aboutLength}/2000</span>
    </label>

    <div class="links-header">
      <h3>Ссылки</h3>
      <Button
        type="button"
        variant="outline"
        onclick={addLink}
        disabled={!canAddLink}
      >
        Добавить
      </Button>
    </div>

    <div class="links-list">
      {#each links as link (link.id)}
        <div class="link-row">
          <IconPicker
            label=""
            value={link.icon || DEFAULT_LINK_ICON}
            onSelect={(value) => updateLink(link.id, "icon", value)}
          />
          <div class="link-fields">
            <Input
              label="Label"
              value={link.label}
              oninput={(event) =>
                updateLink(link.id, "label", event.currentTarget.value)}
            />
            <Input
              label="URL"
              type="url"
              inputmode="url"
              value={link.url}
              oninput={(event) =>
                updateLink(link.id, "url", event.currentTarget.value)}
            />
          </div>
          <button
            class="remove-link"
            type="button"
            aria-label={`Удалить ссылку ${link.label || link.id}`}
            onclick={() => removeLink(link.id)}
          >
            ×
          </button>
        </div>
      {/each}
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
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Сохранение..." : "Сохранить"}
      </Button>
    </div>

    {#if errorMessage}
      <p class="error" role="alert">{errorMessage}</p>
    {/if}
  </form>
</Modal>

<style>
  .profile-form {
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

  .hint {
    color: var(--color-text-secondary);
    font-size: 12px;
    font-weight: 500;
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

  .counter {
    align-self: flex-end;
    color: var(--color-text-secondary);
    font-size: 12px;
    font-weight: 500;
  }

  .links-header,
  .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  h3 {
    margin: 0;
    font-size: 16px;
  }

  .links-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .link-row {
    display: grid;
    grid-template-columns: 48px minmax(0, 1fr) 48px;
    gap: 8px;
    align-items: end;
  }

  .link-row :global(.icon-picker-field) {
    width: 48px;
  }

  .link-row :global(.icon-picker-button) {
    aspect-ratio: 1 / 1;
    min-height: 0;
    height: auto;
    padding: 0;
  }

  .link-fields {
    display: grid;
    grid-template-columns: minmax(120px, 0.9fr) minmax(160px, 1.5fr);
    gap: 8px;
    min-width: 0;
  }

  .link-row :global(input) {
    box-sizing: border-box;
    height: 48px;
    min-height: 48px;
    padding-top: 18px;
    padding-bottom: 6px;
    font-size: 14px;
  }

  .link-row :global(label.floating) {
    top: 5px;
  }

  .remove-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border: 1px solid #2a2c33;
    border-radius: 8px;
    background: var(--color-bg-surface);
    color: var(--color-text);
    font-size: 22px;
    cursor: pointer;
    align-self: end;
  }

  .remove-link:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
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

  .actions {
    justify-content: flex-end;
    padding-top: 6px;
  }

  @media (max-width: 767px) {
    .link-row {
      grid-template-columns: 48px 1fr 48px;
    }

    .link-fields {
      grid-template-columns: 1fr;
    }

    .remove-link {
      grid-column: 3;
    }

    .links-header,
    .actions {
      align-items: stretch;
      flex-direction: column;
    }

    .links-header :global(.button),
    .actions :global(.button) {
      width: 100%;
    }
  }
</style>
