<script lang="ts">
import SvelteMarkdown, {
	buildUnsupportedHTML,
	defaultRenderers
} from '@humanspeak/svelte-markdown';

let { source }: { source: string } = $props();

const renderers = {
	...defaultRenderers,
	html: buildUnsupportedHTML()
};

const hasSource = $derived(source.trim().length > 0);
</script>

<div class="preview">
  {#if !hasSource}
    <p class="muted">Описание пока пустое.</p>
  {:else}
    <SvelteMarkdown {source} {renderers} />
  {/if}
</div>

<style>
  .preview {
    line-height: 1.6;
  }

  .preview :global(h1),
  .preview :global(h2),
  .preview :global(h3),
  .preview :global(h4),
  .preview :global(h5),
  .preview :global(h6) {
    margin: 1rem 0 0.4rem;
  }

  .preview :global(p),
  .preview :global(ul),
  .preview :global(blockquote),
  .preview :global(pre) {
    margin: 0 0 0.8rem;
  }

  .preview :global(blockquote) {
    border-left: 3px solid var(--color-primary);
    color: var(--color-text-secondary);
    padding-left: 0.8rem;
  }

  .preview :global(pre) {
    background: var(--color-bg);
    border-radius: 0.4rem;
    overflow-x: auto;
    padding: 0.75rem;
  }

  .muted {
    color: var(--color-text-secondary);
  }
</style>
