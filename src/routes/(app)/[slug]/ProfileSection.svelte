<script lang="ts">
import type { Snippet } from 'svelte';

import Tertiary from '$lib/components/Tertiary.svelte';

type ProfileSectionProps = {
	id: string;
	label: string;
	children?: Snippet;
};

let { id, label, children }: ProfileSectionProps = $props();
</script>

<section>
	<Tertiary {label} {id} />
	{@render children?.()}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
</style>
