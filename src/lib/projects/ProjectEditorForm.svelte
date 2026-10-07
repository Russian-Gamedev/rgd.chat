<script lang="ts">
import { createApi } from '$lib/api/api';
import type {
	ProjectAuthorInputDto,
	ProjectPopularTag,
	ProjectPublicTag,
	UserSearchResult
} from '$lib/api/api.type';
import Avatar from '$lib/components/Avatar.svelte';
import Button from '$lib/components/Button.svelte';
import IconPicker from '$lib/components/IconPicker.svelte';
import { showSnackbar } from '$lib/components/snackbar';
import UserIdentity from '$lib/components/UserIdentity.svelte';

import MarkdownPreview from './MarkdownPreview.svelte';
import ProjectImageField from './ProjectImageField.svelte';
import type { ProjectFormAttachment, ProjectFormErrors, ProjectFormState } from './project-editor';
import {
	AUTHOR_DEFAULT_ROLE,
	AUTHOR_ROLE_OPTIONS,
	moveItem,
	normalizeProjectSlug,
	slugifyProjectTitle,
	youtubeEmbedUrl
} from './project-editor';
import { PROJECT_TYPE_OPTIONS } from './project-type';
import { isAcceptableImageSize, isSupportedImage, uploadProjectImage } from './project-uploads';

let {
	form = $bindable(),
	step,
	tagOptions,
	tagsUnavailable = false,
	popularTags = [],
	errors = {},
	readonly = false
}: {
	form: ProjectFormState;
	step: number;
	tagOptions: ProjectPublicTag[];
	tagsUnavailable?: boolean;
	popularTags?: ProjectPopularTag[];
	errors?: ProjectFormErrors;
	readonly?: boolean;
} = $props();

let descriptionMode = $state<'editor' | 'preview'>('editor');
let tagInput = $state('');
let showTagDropdown = $state(false);
let tagInputRef: HTMLInputElement | undefined = $state();
let attachmentFileInput = $state<HTMLInputElement>();
let authorQuery = $state('');
let authorResults = $state<UserSearchResult[]>([]);
let authorSearching = $state(false);
let showAuthorDropdown = $state(false);
let authorSearchTimer: ReturnType<typeof setTimeout> | undefined;

function updateAuthor(index: number, author: ProjectAuthorInputDto) {
	form.authors[index] = author;
}

function handleAuthorInput() {
	const query = authorQuery.trim();
	showAuthorDropdown = query.length > 0;
	clearTimeout(authorSearchTimer);
	if (query.length < 2) {
		authorResults = [];
		authorSearching = false;
		return;
	}
	authorSearching = true;
	authorSearchTimer = setTimeout(async () => {
		try {
			authorResults = await createApi({ fetch }).searchUsers(query);
		} catch {
			authorResults = [];
		} finally {
			authorSearching = false;
		}
	}, 250);
}

function isAuthorAdded(user: UserSearchResult): boolean {
	return form.authors.some(
		(author) => author.type === 'discord' && author.discord_user_id === user.id
	);
}

function addDiscordAuthor(user: UserSearchResult) {
	if (!isAuthorAdded(user)) {
		form.authors.push({
			type: 'discord',
			discord_user_id: user.id,
			role: AUTHOR_DEFAULT_ROLE
		});
	}
	closeAuthorDropdown();
}

function addTextAuthor(role: string) {
	const name = authorQuery.trim();
	if (name) form.authors.push({ type: 'text', name, role });
	closeAuthorDropdown();
}

function closeAuthorDropdown() {
	authorQuery = '';
	authorResults = [];
	showAuthorDropdown = false;
}

function onAuthorInputBlur() {
	setTimeout(() => (showAuthorDropdown = false), 200);
}

function removeAt(key: 'authors' | 'links' | 'attachments', index: number) {
	form[key].splice(index, 1);
}

function pickAttachmentFiles() {
	attachmentFileInput?.click();
}

async function handleAttachmentFiles(event: Event) {
	const input = event.currentTarget as HTMLInputElement;
	const files = Array.from(input.files ?? []);
	input.value = '';
	const pending: { row: Extract<ProjectFormAttachment, { type: 'image' }>; file: File }[] = [];
	for (const file of files) {
		if (form.attachments.length >= 20) break;
		if (!isSupportedImage(file) || !isAcceptableImageSize(file)) {
			showSnackbar({
				message: `${file.name}: поддерживаются изображения до 25 МБ.`,
				variant: 'error'
			});
			continue;
		}
		const row: Extract<ProjectFormAttachment, { type: 'image' }> = {
			type: 'image',
			upload_id: null,
			url: URL.createObjectURL(file),
			uploading: true,
			progress: 0
		};
		form.attachments.push(row);
		pending.push({ row, file });
	}
	await Promise.all(
		pending.map(async ({ row, file }) => {
			try {
				const upload = await uploadProjectImage('attachment', file, (percent) => {
					row.progress = percent;
				});
				row.progress = 100;
				row.upload_id = upload.id;
				row.url = upload.url;
			} catch {
				showSnackbar({
					message: `Не удалось загрузить ${file.name}. Попробуйте ещё раз.`,
					variant: 'error'
				});
				const index = form.attachments.indexOf(row);
				if (index !== -1) removeAt('attachments', index);
			} finally {
				row.uploading = false;
			}
		})
	);
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
	if (!form.slugManuallyEdited) form.slug = slugifyProjectTitle(form.title);
}

function normalizeSlugInput() {
	form.slug = normalizeProjectSlug(form.slug);
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

const popularSuggestions = $derived(
	popularTags.filter(
		(suggestion) =>
			!form.tags.some((tag) => tag.name.toLowerCase() === suggestion.name.toLowerCase())
	)
);

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
  {#if step === 0}
    <section class="field-section">
      <label for="project-title">Название <span>{form.title.length}/120</span></label>
      <input id="project-title" bind:value={form.title} oninput={handleTitleInput} maxlength="120" required placeholder="Например: Мой игровой сервер" />
      {#if errors.title}<p class="error">{errors.title}</p>{/if}
    </section>

    <section class="field-section">
      <label for="project-slug">Публичный адрес <span>{form.slug.length}/120</span></label>
      <input id="project-slug" bind:value={form.slug} oninput={() => (form.slugManuallyEdited = true)} onblur={normalizeSlugInput} maxlength="120" placeholder="my-project" />
      {#if errors.slug}<p class="error">{errors.slug}</p>{/if}
    </section>

    <section class="field-section">
      <div class="label-row">
        <label for="project-description">Описание <span>{form.description.length}/20 000</span></label>
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
        <textarea id="project-description" bind:value={form.description} maxlength="20000" rows="12" placeholder="Расскажите о вашем проекте: что это такое, в чём его особенность, какие у него цели и возможности…"></textarea>
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
    </div>

    <section class="field-section">
      <span class="field-label">Баннер</span>
      <ProjectImageField bind:value={form.banner} disabled={readonly} error={errors.banner} />
      {#if errors.cover}<p class="error">{errors.cover}</p>{/if}
    </section>
  {:else if step === 1}
    <section class="field-section">
      <label for="project-type">Тип</label>
      <select id="project-type" bind:value={form.type} aria-label="Тип проекта">
        {#each PROJECT_TYPE_OPTIONS as option (option.value)}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
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
      {#if tagsUnavailable && tagOptions.length === 0}
        <p class="muted">Справочник тегов недоступен.</p>
      {/if}
      {#if !readonly && popularSuggestions.length > 0}
        <div class="popular-tags">
          <span class="muted">Частые теги:</span>
          {#each popularSuggestions as suggestion (suggestion.slug)}
            <button
              type="button"
              class="popular-tag"
              onclick={() => addTag(suggestion.name)}
            >+ {suggestion.name}</button>
          {/each}
        </div>
      {/if}
      {#if errors.tags}<p class="error">{errors.tags}</p>{/if}
    </section>
  {:else if step === 2}
    <section class="collection">
      <div class="section-header">
        <div><h2>Авторы</h2><span>{form.authors.length}/20</span></div>
      </div>
      <p class="muted team-hint">Укажите людей и команды, которые участвовали в проекте.</p>

      <div class="author-search">
        <input
          type="text"
          placeholder="Добавить автора, команду, Discord ID"
          bind:value={authorQuery}
          oninput={handleAuthorInput}
          onfocus={handleAuthorInput}
          onblur={onAuthorInputBlur}
          onkeydown={(event) => {
            if (event.key === 'Escape') showAuthorDropdown = false;
          }}
          maxlength="120"
        />
        {#if showAuthorDropdown}
          <!-- preventDefault на mousedown: не уводим фокус из инпута,
               иначе blur успевает размонтировать дропдаун до клика -->
          <div
            class="author-dropdown"
            role="listbox"
            onmousedown={(event) => event.preventDefault()}
          >
            {#if authorSearching}
              <p class="muted dropdown-pad">Поиск…</p>
            {:else if authorQuery.trim().length >= 2 && authorResults.length > 0}
              <p class="dropdown-section">Пользователи RGD</p>
              {#each authorResults as user (user.id)}
                <div class="dropdown-row">
                  <Avatar src={user.avatarUrl} name={user.nickname ?? user.username} />
                  <span class="who">
                    <strong>{user.nickname ?? user.username}</strong>
                    <small>{user.username} · {user.id}</small>
                  </span>
                  {#if isAuthorAdded(user)}
                    <span class="muted">Добавлен</span>
                  {:else}
                    <Button type="button" onclick={() => addDiscordAuthor(user)}>Добавить</Button>
                  {/if}
                </div>
              {/each}
            {:else if authorQuery.trim().length >= 2}
              <p class="muted dropdown-pad">Пользователи RGD не найдены.</p>
            {/if}
            {#if authorQuery.trim().length > 0}
              <p class="dropdown-section">Команды / Группы</p>
              <div class="dropdown-row">
                <span class="who">
                  <strong>{authorQuery}</strong>
                  <small>Добавить как название команды</small>
                </span>
                <Button type="button" variant="outline" onclick={() => addTextAuthor('Команда')}>+</Button>
              </div>
              <div class="dropdown-row">
                <span class="who">
                  <strong>{authorQuery}</strong>
                  <small>Добавить имя как имя автора — текст, без профиля</small>
                </span>
                <Button type="button" variant="outline" onclick={() => addTextAuthor('Автор')}>+</Button>
              </div>
            {/if}
          </div>
        {/if}
      </div>

      {#if form.authors.length > 0}
        <p class="field-label added-label">Уже добавленные</p>
        {#each form.authors as author, index (`${index}-${author.type}`)}
          <div class="collection-row author-row">
            {#if author.type === 'discord'}
              <UserIdentity id={author.discord_user_id} stacked />
            {:else}
              <span class="author-identity">
                <Avatar name={author.name || 'Без названия'} />
                <span class="who">
                  <strong>{author.name || 'Без названия'}</strong>
                  <small>{author.role}</small>
                </span>
              </span>
            {/if}
            <select
              aria-label="Роль автора"
              value={author.role}
              disabled={readonly}
              onchange={(event) => updateAuthor(index, { ...author, role: event.currentTarget.value })}
            >
              {#each AUTHOR_ROLE_OPTIONS as role (role)}
                <option value={role}>{role}</option>
              {/each}
            </select>
            <button type="button" class="row-remove" aria-label="Удалить автора" onclick={() => removeAt('authors', index)}>×</button>
          </div>
        {/each}
      {/if}
      {#if errors.authors}<p class="error">{errors.authors}</p>{/if}
    </section>
  {:else if step === 3}
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
  {:else if step === 4}
    <section class="collection">
      <div class="section-header">
        <div><h2>Файлы</h2><span>{form.attachments.length}/20</span></div>
        <div class="section-actions">
          <Button
            type="button"
            variant="outline"
            disabled={readonly || form.attachments.length >= 20}
            onclick={pickAttachmentFiles}>Загрузить изображения</Button
          >
          <Button
            type="button"
            variant="outline"
            disabled={readonly || form.attachments.length >= 20}
            onclick={() => form.attachments.push({ type: 'external_video', url: '' })}
            >Добавить видео</Button
          >
        </div>
      </div>
      {#each form.attachments as attachment, index (`${index}-${attachment.type}`)}
        <div class="attachment">
          {#if attachment.type === 'image'}
            <div class="attachment-file">
              {#if attachment.url}
                <img class="thumb" src={attachment.url} alt="Предпросмотр изображения" />
              {/if}
              <span class="attachment-status">
                {#if attachment.uploading}
                  <span class="muted">Загрузка… {attachment.progress ?? 0}%</span>
                  <span class="progress"><i style:width={`${attachment.progress ?? 0}%`}></i></span>
                {:else}
                  <span class="muted">Изображение загружено</span>
                {/if}
              </span>
              <div class="row-actions">
                <button type="button" aria-label="Переместить выше" disabled={readonly || index === 0} onclick={() => (form.attachments = moveItem(form.attachments, index, -1))}>↑</button>
                <button type="button" aria-label="Переместить ниже" disabled={readonly || index === form.attachments.length - 1} onclick={() => (form.attachments = moveItem(form.attachments, index, 1))}>↓</button>
                <button type="button" aria-label="Удалить вложение" onclick={() => removeAt('attachments', index)}>×</button>
              </div>
            </div>
          {:else}
            <div class="collection-row attachment-row">
              <input aria-label="URL вложения" type="url" placeholder="https://…" bind:value={attachment.url} />
              <div class="row-actions">
                <button type="button" aria-label="Переместить выше" disabled={readonly || index === 0} onclick={() => (form.attachments = moveItem(form.attachments, index, -1))}>↑</button>
                <button type="button" aria-label="Переместить ниже" disabled={readonly || index === form.attachments.length - 1} onclick={() => (form.attachments = moveItem(form.attachments, index, 1))}>↓</button>
                <button type="button" aria-label="Удалить вложение" onclick={() => removeAt('attachments', index)}>×</button>
              </div>
            </div>
            {#if attachment.url.startsWith('https://')}
              {#if youtubeEmbedUrl(attachment.url)}
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
          {/if}
        </div>
      {/each}
      <input bind:this={attachmentFileInput} type="file" accept="image/*" multiple hidden onchange={handleAttachmentFiles} />
      {#if errors.attachments}<p class="error">{errors.attachments}</p>{/if}
    </section>
  {/if}
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
    grid-template-columns: 1fr 1fr;
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

  .section-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .team-hint {
    font-size: 0.8125rem;
    margin: -0.75rem 0 0.75rem;
  }

  .author-search {
    position: relative;
    margin-bottom: 1rem;
  }

  .author-dropdown {
    background: var(--color-bg-surface);
    border: 1px solid #303238;
    border-radius: 0.5rem;
    margin-top: 0.25rem;
    max-height: 320px;
    overflow-y: auto;
    position: absolute;
    width: 100%;
    z-index: 20;
  }

  .dropdown-pad {
    padding: 0.5rem 0.75rem;
  }

  .dropdown-section {
    border-top: 1px solid #303238;
    color: var(--color-text-secondary);
    font-size: 0.75rem;
    letter-spacing: 0.04em;
    margin: 0;
    padding: 0.5rem 0.75rem 0.25rem;
    text-transform: uppercase;
  }

  .dropdown-section:first-child {
    border-top: 0;
  }

  .dropdown-row {
    align-items: center;
    display: flex;
    gap: 0.6rem;
    padding: 0.45rem 0.75rem;
  }

  .dropdown-row:hover {
    background: color-mix(in srgb, var(--color-primary) 8%, transparent);
  }

  .who {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
    flex: 1;
  }

  .who strong {
    font-size: 0.875rem;
  }

  .who small {
    color: var(--color-text-secondary);
    font-size: 0.75rem;
  }

  .added-label {
    margin-top: 0.25rem;
  }

  .author-row {
    align-items: center;
    background: color-mix(in srgb, var(--color-bg-surface) 55%, transparent);
    border-radius: 0.5rem;
    display: grid;
    grid-template-columns: minmax(10rem, 1fr) auto auto;
    margin-bottom: 0.5rem;
    padding: 0.5rem 0.65rem;
  }

  .author-row select {
    padding-right: 1.75rem;
    width: auto;
  }

  .author-identity {
    align-items: center;
    display: inline-flex;
    gap: 0.5rem;
    min-width: 0;
  }

  .row-remove {
    background: transparent;
    border: 1px solid #3a3c43;
    border-radius: 0.4rem;
    color: var(--color-text);
    cursor: pointer;
    padding: 0.35rem 0.55rem;
  }

  .popular-tags {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.5rem;
  }

  .popular-tag {
    background: transparent;
    border: 1px solid #3a3c43;
    border-radius: 999px;
    color: var(--color-text-secondary);
    cursor: pointer;
    font: inherit;
    font-size: 0.8125rem;
    padding: 0.2rem 0.55rem;
  }

  .popular-tag:hover {
    border-color: var(--color-primary);
    color: var(--color-text);
  }

  .attachment-status {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
  }

  .progress {
    background: color-mix(in srgb, var(--color-text-secondary) 25%, transparent);
    border-radius: 999px;
    display: block;
    height: 0.3rem;
    overflow: hidden;
    width: 100%;
  }

  .progress i {
    background: var(--color-primary);
    display: block;
    height: 100%;
    transition: width 0.15s ease-out;
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

  .attachment-row {
    grid-template-columns: 10rem minmax(12rem, 1fr) auto;
  }

  .attachment-row {
    grid-template-columns: minmax(12rem, 1fr) auto;
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

  .attachment .thumb {
    border: 1px solid #303238;
    border-radius: 0.5rem;
    height: 4.5rem;
    object-fit: cover;
    width: 7rem;
  }

  .attachment-file {
    align-items: center;
    display: flex;
    gap: 0.75rem;
    justify-content: space-between;
  }

  .attachment iframe {
    aspect-ratio: 16 / 9;
    border: 0;
    border-radius: 0.5rem;
    display: block;
    margin-top: 0.75rem;
    max-width: 36rem;
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
