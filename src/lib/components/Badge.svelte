<script lang="ts">
import type { SvelteHTMLElements } from 'svelte/elements';

interface BadgeProps {
	label: string;
	count?: number;
}

let { label, count, ...rest }: BadgeProps & SvelteHTMLElements['span'] = $props();

const classes = $derived(['badge', rest.class].filter(Boolean).join(' '));
</script>

<span {...rest} class={classes}>
  {label}{count !== undefined ? ":" : ""}
  {#if count !== undefined}
    <span class="count">{count}</span>
  {/if}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    background-color: var(--color-bg-surface);
    color: var(--color-text);
    border-radius: 100px;
    padding: 2px 8px;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    gap: 0.25rem;
    user-select: none;
  }

  .count {
    color: var(--color-primary);
  }
</style>
