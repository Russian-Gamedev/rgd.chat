<script lang="ts">
import type { GameAuthorInputDto, GameGenreDto } from '$lib/api/api.type';
import Button from '$lib/components/Button.svelte';
import IconPicker from '$lib/components/IconPicker.svelte';

import type { GameFormErrors, GameFormState } from './game-editor';
import { moveItem, youtubeEmbedUrl } from './game-editor';
import MarkdownPreview from './MarkdownPreview.svelte';

let {
	form = $bindable(),
	genres,
	errors = {},
	readonly = false
}: {
	form: GameFormState;
	genres: GameGenreDto[];
	errors?: GameFormErrors;
	readonly?: boolean;
} = $props();

let descriptionMode = $state<'editor' | 'preview'>('editor');

function updateAuthor(index: number, author: GameAuthorInputDto) {
	form.authors[index] = author;
}

function removeAt(key: 'authors' | 'links' | 'attachments', index: number) {
	form[key].splice(index, 1);
}

function toggleGenre(id: string) {
	const index = form.genreIds.indexOf(id);
	if (index === -1) form.genreIds.push(id);
	else form.genreIds.splice(index, 1);
}
</script>

<fieldset disabled={readonly}>
  <section class="field-section">
    <label for="game-title">Название <span>{form.title.length}/120</span></label>
    <input id="game-title" bind:value={form.title} maxlength="120" required />
    {#if errors.title}<p class="error">{errors.title}</p>{/if}
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
      <span class="field-label">Жанры <span>{form.genreIds.length}/10</span></span>
      <div class="genres">
        {#each genres as genre (genre.id)}
          <label class="genre">
            <input
              type="checkbox"
              checked={form.genreIds.includes(genre.id)}
              disabled={readonly || (!form.genreIds.includes(genre.id) && form.genreIds.length >= 10)}
              onchange={() => toggleGenre(genre.id)}
            />
            {genre.name}
          </label>
        {/each}
      </div>
      {#if genres.length === 0}<p class="muted">Справочник жанров недоступен.</p>{/if}
      {#if errors.genreIds}<p class="error">{errors.genreIds}</p>{/if}
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
          <select bind:value={attachment.type} aria-label="Тип вложения">
            <option value="image">Изображение</option>
            <option value="external_video">Внешнее видео</option>
          </select>
          <input aria-label="URL вложения" type="url" placeholder="https://…" bind:value={attachment.url} />
          <div class="row-actions">
            <button type="button" aria-label="Переместить выше" disabled={readonly || index === 0} onclick={() => (form.attachments = moveItem(form.attachments, index, -1))}>↑</button>
            <button type="button" aria-label="Переместить ниже" disabled={readonly || index === form.attachments.length - 1} onclick={() => (form.attachments = moveItem(form.attachments, index, 1))}>↓</button>
            <button type="button" aria-label="Удалить вложение" onclick={() => removeAt('attachments', index)}>×</button>
          </div>
        </div>
        {#if attachment.url.startsWith('https://')}
          {#if attachment.type === 'image'}
            <img src={attachment.url} alt="Предпросмотр вложения" />
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

  .genres {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .genre {
    align-items: center;
    background: var(--color-bg-surface);
    border: 1px solid #303238;
    border-radius: 999px;
    cursor: pointer;
    display: flex;
    font-weight: 400;
    gap: 0.4rem;
    margin: 0;
    padding: 0.4rem 0.75rem;
  }

  .genre input {
    width: auto;
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
