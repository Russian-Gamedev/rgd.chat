<script lang="ts">
import type { SvelteHTMLElements } from 'svelte/elements';

import Badge from './Badge.svelte';
import { formatNumber } from '#lib/utils/format';

interface BadgeProps {
	label: string;
	count?: number;
}

let { label, count, ...rest }: BadgeProps & SvelteHTMLElements['span'] = $props();
</script>

<Badge {...rest}>
  {label}{count !== undefined ? ":" : ""}
  {#if count !== undefined}
    <span class="count">{formatNumber(count)}</span>
  {/if}
</Badge>

<style>
  .count {
    color: var(--color-primary);
  }
</style>
