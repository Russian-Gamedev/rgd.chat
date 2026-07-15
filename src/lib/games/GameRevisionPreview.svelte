<script lang="ts">
import type { GameEditor } from '$lib/api/api.type';
import Button from '$lib/components/Button.svelte';
import GameAuthorsIdentity from '$lib/components/GameAuthorsIdentity.svelte';
import IconPreview from '$lib/components/IconPreview.svelte';
import UserIdentity from '$lib/components/UserIdentity.svelte';

import MarkdownPreview from './MarkdownPreview.svelte';
import { isAllowedIcon, safeExternalVideoUrl, safeLinkHost } from './review-utils';

let { game }: { game: GameEditor } = $props();
let markdownMode = $state<'preview' | 'source'>('preview');
let failedImages = $state<string[]>([]);

function markImageFailed(url: string) {
	if (!failedImages.includes(url)) failedImages = [...failedImages, url];
}
</script>

<section class="preview">
	<section><h2>{game.title}</h2><p class="muted">{game.title.length} символов</p></section>
	<section><div class="section-header"><h3>Описание</h3><div class="switch" role="group" aria-label="Режим описания"><Button type="button" variant={markdownMode === 'preview' ? 'solid' : 'outline'} aria-pressed={markdownMode === 'preview'} onclick={() => (markdownMode = 'preview')}>Preview</Button><Button type="button" variant={markdownMode === 'source' ? 'solid' : 'outline'} aria-pressed={markdownMode === 'source'} onclick={() => (markdownMode = 'source')}>Markdown</Button></div></div>
		{#if markdownMode === 'preview'}<MarkdownPreview source={game.description} />{:else}<pre class="source">{game.description}</pre>{/if}
	</section>
	<section class="facts"><div><strong>Дата релиза</strong><span>{game.metadata.release_date}</span></div><div><strong>Теги</strong><span class="tags">{#each game.tags as tag (tag.slug)}<span class="tag">{tag.name}</span>{/each}</span></div></section>
	<section><h3>Владелец</h3><UserIdentity id={game.credits.owner_id} /></section>
	<section><h3>Авторы</h3><GameAuthorsIdentity authors={game.credits.authors} /></section>
	<section><h3>Ссылки</h3><ul class="links-list">{#each game.resources.links as item (item.link)}<li><span class="link-icon"><IconPreview name={isAllowedIcon(item.icon) ? item.icon : 'IconExternalLink'} /></span><span class="link-label">{item.label}</span><a href={item.link} target="_blank" rel="noopener noreferrer">{safeLinkHost(item.link)}</a></li>{/each}</ul></section>
	<section><h3>Вложения</h3><div class="attachments">{#each game.resources.attachments as item (item.type + item.url)}
		{#if item.type === 'image'}<figure>{#if failedImages.includes(item.url)}<span>Изображение недоступно</span>{:else}<a href={item.url} target="_blank" rel="noopener noreferrer"><img src={item.url} alt="Открыть изображение" onerror={() => markImageFailed(item.url)} /></a>{/if}<figcaption>{item.url}</figcaption></figure>
		{:else if safeExternalVideoUrl(item.url)}{@const embedUrl = safeExternalVideoUrl(item.url)}<iframe title="Внешнее видео" src={embedUrl} loading="lazy" allowfullscreen></iframe>
		{:else}<a href={item.url} target="_blank" rel="noopener noreferrer">Открыть видео: {item.url}</a>{/if}
	{/each}</div></section>
</section>

<style>
	.preview { background: var(--color-bg-surface); border-radius: .65rem; display: grid; gap: 0; overflow: hidden; }
	.preview > section { border-bottom: 1px solid #303238; padding: 1.25rem; }
	.preview > section:last-child { border-bottom: 0; }
	h2, h3 { margin: 0; }
	.section-header { align-items: center; display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between; margin-bottom: .75rem; }
	.muted, figcaption { color: var(--color-text-secondary); font-size: .85rem; }
	.switch { display: flex; gap: .4rem; }
	.source { white-space: pre-wrap; overflow-wrap: anywhere; }
	.facts { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
	.facts div { display: grid; gap: .3rem; }
	.tags { display: flex; flex-wrap: wrap; gap: .4rem; }
	.tag { background: color-mix(in srgb, var(--color-primary) 20%, transparent); border-radius: 999px; padding: .2rem .5rem; }
	.attachments { display: grid; gap: .75rem; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
	figure { margin: 0; overflow: hidden; } img, iframe { aspect-ratio: 16 / 9; border: 0; max-width: 100%; object-fit: cover; width: 100%; } figcaption { overflow-wrap: anywhere; }
	ul { margin: 0; padding-left: 1.25rem; }
	.links-list { display: grid; gap: .65rem; list-style: none; padding: 0; }
	.links-list li { align-items: center; display: grid; gap: .65rem; grid-template-columns: 2rem minmax(8rem, .5fr) minmax(12rem, 1fr); min-height: 2.5rem; }
	.link-icon { align-items: center; background: var(--color-bg); border-radius: .45rem; display: inline-flex; height: 2rem; justify-content: center; width: 2rem; }
	.link-icon :global(svg) { height: 1.1rem; width: 1.1rem; }
	.link-label { overflow-wrap: anywhere; }
	@media (max-width: 700px) { .links-list li { grid-template-columns: 2rem 1fr; } .links-list li a { grid-column: 2; } }
</style>
