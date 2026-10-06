<script lang="ts">
import type { DiscordComponentEmbedPayload } from '$lib/discord/component-embed';

let { payload }: { payload: DiscordComponentEmbedPayload } = $props();

// "<" экранируется как \u003c, чтобы пользовательский текст не закрыл script-тег.
const json = $derived(
	`${'<scri' + 'pt id="discord:component-embed" type="application/json">'}${JSON.stringify(payload).replace(/</g, '\\u003c')}${'</scri' + 'pt>'}`
);
</script>

<svelte:head>
	{@html json}
</svelte:head>
