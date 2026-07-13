<script lang="ts">
import type { GameAuthor } from '$lib/api/api.type';

import UserIdentity from './UserIdentity.svelte';

let { authors }: { authors: GameAuthor[] } = $props();
</script>

<span class="authors">
	{#each authors as author, index (author.type + index)}
		{#if author.type === 'discord'}<UserIdentity id={author.discord_user_id} compact />{:else}<span class="text-author">{author.name}</span>{/if}
	{/each}
</span>

<style>
	.authors { align-items: center; display: inline-flex; flex-wrap: wrap; gap: .45rem; }
	.text-author { color: var(--color-text-secondary); }
</style>
