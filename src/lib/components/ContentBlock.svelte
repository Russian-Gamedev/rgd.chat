<script lang="ts">
	import type { OutputBlockData } from '@editorjs/editorjs';
	import HeadingTag from './HeadingTag.svelte';

	export let block: OutputBlockData;
</script>

{#if block.type === 'header'}
	<HeadingTag>{block.data.text}</HeadingTag>
{:else if block.type === 'paragraph'}
	<p>{block.data.text}</p>
{/if}
