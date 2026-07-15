<script lang="ts">
import type { GameAuthorInputDto, GamePublicTag } from '$lib/api/api.type';
import Button from '$lib/components/Button.svelte';
import IconPicker from '$lib/components/IconPicker.svelte';

import type { GameFormErrors, GameFormState } from './game-editor';
import { moveItem, normalizeGameSlug, slugifyGameTitle, youtubeEmbedUrl } from './game-editor';
import MarkdownPreview from './MarkdownPreview.svelte';

let {
	form = $bindable(),
	tagOptions,
	errors = {},
	readonly = false
}: {
	form: GameFormState;
	tagOptions: GamePublicTag[];
	errors?: GameFormErrors;
	readonly?: boolean;
} = $props();

let descriptionMode = $state<'editor' | 'preview'>('editor');
let tagInput = $state('');
let showTagDropdown = $state(false);
let tagInputRef: HTMLInputElement | undefined = $state();

function updateAuthor(index: number, author: GameAuthorInputDto) {
	form.authors[index] = author;
}

function removeAt(key: 'authors' | 'links' | 'attachments', index: number) {
	if (key === 'attachments' && form.attachments[index]?.type === 'image') {
		const imageCount = form.attachments.filter((attachment) => attachment.type === 'image').length;
		if (imageCount === 1) return;
	}
	form[key].splice(index, 1);
}

function normalizeTag(value: string): string | null {
	const trimmed = value.trim().replace(/\s+/g, ' ');
	if (!trimmed || trimmed.length > 80) return null;
	return trimmed;
}

function addTag(value: string) {
	const tag = normalizeTag(value);
	if (!tag) return;
	if (form.tags.some((t) => t.name.toLowerCase() === tag.toLowerCase())) return;
	if (form.tags.length >= 10) return;
	const option = tagOptions.find((item) => item.name.toLowerCase() === tag.toLowerCase());
	form.tags = [
		...form.tags,
		option ? { name: option.name, slug: option.slug } : { name: tag, slug: null }
	];
	tagInput = '';
	showTagDropdown = false;
}

function removeTag(index: number) {
	form.tags = form.tags.filter((_, i) => i !== index);
}

function handleTitleInput() {
	if (!form.slugManuallyEdited) form.slug = slugifyGameTitle(form.title);
}

function normalizeSlugInput() {
	form.slug = normalizeGameSlug(form.slug);
}

function handleTagKeydown(event: KeyboardEvent) {
	if (event.key === 'Enter' || event.key === ',') {
		event.preventDefault();
		if (tagInput.trim()) {
			addTag(tagInput);
		}
	} else if (event.key === 'Backspace' && !tagInput && form.tags.length > 0) {
		removeTag(form.tags.length - 1);
	} else if (event.key === 'Escape') {
		showTagDropdown = false;
		tagInputRef?.blur();
	}
}

function handleTagInput() {
	showTagDropdown = tagInput.trim().length > 0;
}

function selectTagOption(name: string) {
	addTag(name);
	tagInputRef?.focus();
}

function onTagInputBlur() {
	setTimeout(() => (showTagDropdown = false), 200);
}

function onTagInputFocus() {
	if (tagInput.trim()) showTagDropdown = true;
}

const filteredTagOptions = $derived(
	tagInput.trim()
		? tagOptions.filter(
				(t) =>
					t.name.toLowerCase().includes(tagInput.toLowerCase()) &&
					!form.tags.some((tag) => tag.name.toLowerCase() === t.name.toLowerCase())
			)
		: tagOptions.filter(
				(t) => !form.tags.some((tag) => tag.name.toLowerCase() === t.name.toLowerCase())
			)
);
</script>

<fieldset disabled={readonly}>
  <section class="field-section">
    <label for="game-title">Название <span>{form.title.length}/120</span></label>
    <input id="game-title" bind:value={form.title} oninput={handleTitleInput} maxlength="120" required />
    {#if errors.title}<p class="error">{errors.title}</p>{/if}
  </section>

  <section class="field-section">
    <label for="game-slug">Публичный адрес <span>{form.slug.length}/120</span></label>
    <input id="game-slug" bind:value={form.slug} oninput={() => (form.slugManuallyEdited = true)} onblur={normalizeSlugInput} maxlength="120" placeholder="my-game" />
    <p class="muted">Публичная ссылка: /games/{form.slug || '…'}</p>
    {#if errors.slug}<p class="error">{errors.slug}</p>{/if}
  </section>

  <section class="field-section">
    <div class="label-row">
      <label for="game-description">Описание <span>{form.description.length}/20 000</span></label>
      <div class="tabs" role="tablist" aria-label="Режим описания">
        <button
          type="button"
          class:active={descriptionMode === 'editor'}
          onclick={() => (descriptionMode = 'editor')}
        >Редактор</button>
        <button
          type="button"
          class:active={descriptionMode === 'preview'}
          onclick={() => (descriptionMode = 'preview')}
        >Предпросмотр</button>
      </div>
    </div>
    {#if descriptionMode === 'editor'}
      <textarea id="game-description" bind:value={form.description} maxlength="20000" rows="12"></textarea>
    {:else}
      <div class="markdown-preview">
        <MarkdownPreview source={form.description} />
      </div>
    {/if}
    {#if errors.description}<p class="error">{errors.description}</p>{/if}
  </section>

  <div class="columns">
    <section class="field-section">
      <label for="release-date">Дата релиза</label>
      <input id="release-date" type="date" bind:value={form.releaseDate} required />
      {#if errors.releaseDate}<p class="error">{errors.releaseDate}</p>{/if}
    </section>

    <section class="field-section">
      <span class="field-label">Теги <span>{form.tags.length}/10</span></span>
      <div class="tags-input" class:focus={showTagDropdown}>
        {#each form.tags as tag, index (`${tag.slug ?? tag.name}-${index}`)}
          <span class="tag-pill">
            {tag.name}
            {#if !readonly}
              <button type="button" class="tag-remove" onclick={() => removeTag(index)} aria-label="Удалить тег {tag}">×</button>
            {/if}
          </span>
        {/each}
        {#if !readonly}
          <input
            bind:this={tagInputRef}
            class="tag-autocomplete"
            type="text"
            placeholder={form.tags.length < 10 ? 'Введите тег…' : ''}
            bind:value={tagInput}
            oninput={handleTagInput}
            onkeydown={handleTagKeydown}
            onblur={onTagInputBlur}
            onfocus={onTagInputFocus}
            disabled={form.tags.length >= 10}
          />
        {/if}
      </div>
      {#if showTagDropdown && tagInput.trim() && filteredTagOptions.length > 0}
        <div class="tag-dropdown" role="listbox">
			{#each filteredTagOptions as option (option.slug)}
            <button
              type="button"
              class="tag-option"
              onclick={() => selectTagOption(option.name)}
            >{option.name}</button>
          {/each}
        </div>
      {/if}
      {#if tagOptions.length === 0}<p class="muted">Справочник тегов недоступен.</p>{/if}
      {#if errors.tags}<p class="error">{errors.tags}</p>{/if}
    </section>
  </div>

  <section class="collection">
    <div class="section-header">
      <div><h2>Авторы</h2><span>{form.authors.length}/20</span></div>
      <Button type="button" variant="outline" disabled={readonly || form.authors.length >= 20} onclick={() => form.authors.push({ type: 'text', name: '' })}>Добавить автора</Button>
    </div>
    {#each form.authors as author, index (`${index}-${author.type}`)}
      <div class="collection-row author-row">
        <select
          value={author.type}
          aria-label="Тип автора"
          onchange={(event) => updateAuthor(index, event.currentTarget.value === 'discord' ? { type: 'discord', discord_user_id: '' } : { type: 'text', name: '' })}
        >
          <option value="text">Текст</option>
          <option value="discord">Discord</option>
        </select>
        {#if author.type === 'discord'}
          <input
            aria-label="Discord ID"
            inputmode="numeric"
            placeholder="Discord user ID"
            value={author.discord_user_id}
            oninput={(event) => updateAuthor(index, { type: 'discord', discord_user_id: event.currentTarget.value })}
          />
        {:else}
          <input
            aria-label="Имя автора"
            placeholder="Имя автора или команды"
            value={author.name}
            oninput={(event) => updateAuthor(index, { type: 'text', name: event.currentTarget.value })}
          />
        {/if}
        <div class="row-actions">
          <button type="button" aria-label="Переместить выше" disabled={readonly || index === 0} onclick={() => (form.authors = moveItem(form.authors, index, -1))}>↑</button>
          <button type="button" aria-label="Переместить ниже" disabled={readonly || index === form.authors.length - 1} onclick={() => (form.authors = moveItem(form.authors, index, 1))}>↓</button>
          <button type="button" aria-label="Удалить автора" onclick={() => removeAt('authors', index)}>×</button>
        </div>
      </div>
    {/each}
    {#if errors.authors}<p class="error">{errors.authors}</p>{/if}
  </section>

  <section class="collection">
    <div class="section-header">
      <div><h2>Ссылки</h2><span>{form.links.length}/5</span></div>
      <Button type="button" variant="outline" disabled={readonly || form.links.length >= 5} onclick={() => form.links.push({ icon: 'IconGlobe', label: '', link: '' })}>Добавить ссылку</Button>
    </div>
    {#each form.links as link, index (index)}
      <div class="collection-row link-row">
        <IconPicker
          label=""
          value={link.icon || 'IconGlobe'}
          onSelect={(value) => (link.icon = value)}
        />
        <input aria-label="Подпись" placeholder="Подпись" bind:value={link.label} />
        <input aria-label="URL ссылки" type="url" placeholder="https://…" bind:value={link.link} />
        <div class="row-actions">
          <button type="button" aria-label="Переместить выше" disabled={readonly || index === 0} onclick={() => (form.links = moveItem(form.links, index, -1))}>↑</button>
          <button type="button" aria-label="Переместить ниже" disabled={readonly || index === form.links.length - 1} onclick={() => (form.links = moveItem(form.links, index, 1))}>↓</button>
          <button type="button" aria-label="Удалить ссылку" onclick={() => removeAt('links', index)}>×</button>
        </div>
      </div>
    {/each}
    {#if errors.links}<p class="error">{errors.links}</p>{/if}
  </section>

  <section class="collection">
    <div class="section-header">
      <div><h2>Вложения</h2><span>{form.attachments.length}/20</span></div>
      <Button type="button" variant="outline" disabled={readonly || form.attachments.length >= 20} onclick={() => form.attachments.push({ type: 'image', url: '' })}>Добавить вложение</Button>
    </div>
    {#each form.attachments as attachment, index (`${index}-${attachment.type}`)}
      <div class="attachment">
        <div class="collection-row attachment-row">
          {#if attachment.type === 'image' && form.attachments.findIndex((item) => item.type === 'image') === index}
            <span class="cover-label">Обложка</span>
          {/if}
          <select bind:value={attachment.type} aria-label="Тип вложения">
            <option value="image">Изображение</option>
            <option value="external_video">Внешнее видео</option>
          </select>
          <input aria-label="URL вложения" type="url" placeholder="https://…" bind:value={attachment.url} />
          <div class="row-actions">
            <button type="button" aria-label="Переместить выше" disabled={readonly || index === 0} onclick={() => (form.attachments = moveItem(form.attachments, index, -1))}>↑</button>
            <button type="button" aria-label="Переместить ниже" disabled={readonly || index === form.attachments.length - 1} onclick={() => (form.attachments = moveItem(form.attachments, index, 1))}>↓</button>
            <button type="button" aria-label="Удалить вложение" disabled={attachment.type === 'image' && form.attachments.filter((item) => item.type === 'image').length === 1} onclick={() => removeAt('attachments', index)}>×</button>
          </div>
        </div>
        {#if attachment.url.startsWith('https://')}
          {#if attachment.type === 'image'}
            <img src={attachment.url} alt="Предпросмотр вложения" onerror={(event) => ((event.currentTarget as HTMLImageElement).hidden = true)} />
          {:else if youtubeEmbedUrl(attachment.url)}
            <iframe
              src={youtubeEmbedUrl(attachment.url) ?? ''}
              title="Предпросмотр видео"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              referrerpolicy="strict-origin-when-cross-origin"
            ></iframe>
          {:else}
            <a href={attachment.url} target="_blank" rel="noopener noreferrer">Открыть внешнее видео</a>
          {/if}
        {/if}
      </div>
    {/each}
    {#if errors.attachments}<p class="error">{errors.attachments}</p>{/if}
  </section>
</fieldset>

<style>
  fieldset {
    border: 0;
    margin: 0;
    padding: 0;
  }

  fieldset:disabled {
    opacity: 0.82;
  }

  .field-section,
  .collection {
    margin-bottom: 1.5rem;
  }

  label,
  .field-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 700;
    margin-bottom: 0.45rem;
  }

  label span,
  .field-label span,
  .section-header span {
    color: var(--color-text-secondary);
    font-weight: 400;
  }

  input,
  textarea,
  select,
  .markdown-preview {
    background: var(--color-bg-surface);
    border: 1px solid #303238;
    border-radius: 0.5rem;
    color: var(--color-text);
    font: inherit;
    padding: 0.75rem;
    width: 100%;
  }

  textarea {
    line-height: 1.55;
    resize: vertical;
  }

  input:focus,
  textarea:focus,
  select:focus {
    border-color: var(--color-primary);
    outline: none;
  }

  .label-row,
  .section-header,
  .section-header > div,
  .row-actions,
  .tabs {
    align-items: center;
    display: flex;
  }

  .label-row,
  .section-header {
    gap: 1rem;
    justify-content: space-between;
  }

  .tabs,
  .row-actions {
    gap: 0.35rem;
  }

  .tabs button,
  .row-actions button {
    background: transparent;
    border: 1px solid #3a3c43;
    border-radius: 0.4rem;
    color: var(--color-text);
    cursor: pointer;
    padding: 0.35rem 0.55rem;
  }

  .tabs button.active {
    background: var(--color-primary);
    border-color: var(--color-primary);
  }

  .markdown-preview {
    min-height: 18rem;
  }

  .columns {
    display: grid;
    gap: 1rem;
    grid-template-columns: minmax(12rem, 0.65fr) minmax(18rem, 1.35fr);
  }

  .tags-input {
    align-items: center;
    background: var(--color-bg-surface);
    border: 1px solid #303238;
    border-radius: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    padding: 0.4rem;
  }

  .tags-input.focus {
    border-color: var(--color-primary);
  }

  .tag-pill {
    align-items: center;
    background: color-mix(in srgb, var(--color-primary) 15%, transparent);
    border-radius: 0.25rem;
    color: var(--color-primary);
    display: flex;
    font-size: 0.8125rem;
    font-weight: 500;
    gap: 0.2rem;
    padding: 0.2rem 0.35rem;
  }

  .tag-remove {
    background: transparent;
    border: 0;
    color: var(--color-primary);
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    padding: 0;
  }

  .tag-autocomplete {
    background: transparent;
    border: 0 !important;
    flex: 1;
    min-width: 120px;
    padding: 0.3rem 0.5rem !important;
  }

  .tag-autocomplete:focus {
    border-color: transparent !important;
    outline: none;
  }

  .tag-dropdown {
    background: var(--color-bg-surface);
    border: 1px solid #303238;
    border-radius: 0.5rem;
    margin-top: 0.25rem;
    max-height: 200px;
    overflow-y: auto;
    position: absolute;
    z-index: 10;
  }

  .tag-option {
    background: transparent;
    border: 0;
    color: var(--color-text);
    cursor: pointer;
    display: block;
    font: inherit;
    padding: 0.5rem 0.75rem;
    text-align: left;
    width: 100%;
  }

  .tag-option:hover {
    background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  }

  .section-header {
    margin-bottom: 0.75rem;
  }

  .section-header > div {
    gap: 0.5rem;
  }

  h2 {
    font-size: 1.2rem;
    margin: 0;
  }

  .collection-row {
    align-items: center;
    display: grid;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .author-row,
  .attachment-row {
    grid-template-columns: 10rem minmax(12rem, 1fr) auto;
  }

  .link-row {
    grid-template-columns: 48px minmax(8rem, 0.7fr) minmax(14rem, 1.3fr) auto;
  }

  .link-row :global(.icon-picker-field) {
    width: 48px;
  }

  .link-row :global(.popout-trigger),
  .link-row :global(.icon-picker-button) {
    width: 48px;
  }

  .link-row :global(.icon-picker-button) {
    aspect-ratio: 1 / 1;
    height: 48px;
    min-height: 0;
    padding: 0;
  }

  .attachment {
    background: color-mix(in srgb, var(--color-bg-surface) 55%, transparent);
    border-radius: 0.5rem;
    margin-bottom: 0.75rem;
    padding: 0.75rem;
  }

  .attachment img,
  .attachment iframe {
    aspect-ratio: 16 / 9;
    border: 0;
    border-radius: 0.5rem;
    display: block;
    margin-top: 0.75rem;
    max-width: 36rem;
    object-fit: contain;
    width: 100%;
  }

  .error {
    color: var(--color-error);
    font-size: 0.85rem;
    margin: 0.4rem 0 0;
  }

  .muted {
    color: var(--color-text-secondary);
  }

  @media (max-width: 800px) {
    .columns,
    .author-row,
    .link-row,
    .attachment-row {
      grid-template-columns: 1fr;
    }

    .label-row,
    .section-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .row-actions {
      justify-content: flex-end;
    }
  }
</style>
