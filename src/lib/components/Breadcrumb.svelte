<script lang="ts">
import { resolve } from '$app/paths';

interface Breadcrumb {
	label: string;
	href: Parameters<typeof resolve>[0];
}

export let items: Breadcrumb[] = [];
</script>

<nav aria-label="Breadcrumb">
	<ol class="breadcrumb">
		{#each items as item, index (item.href)}
			<li class="breadcrumb-item">
				{#if index < items.length - 1}
					<a href={resolve(item.href)}>{item.label}</a>
				{:else}
					<span aria-current="page">{item.label}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>

<style>
	.breadcrumb {
		display: flex;
		flex-wrap: wrap;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.breadcrumb-item + .breadcrumb-item::before {
		content: '›';
		padding: 0 0.5em;
		color: var(--color-text-secondary);
	}

	.breadcrumb-item a {
		text-decoration: none;
		color: var(--color-text);
		cursor: pointer;
		font-size: 15px;
		font-weight: 400;
	}

	.breadcrumb-item a:hover {
		text-decoration: underline;
	}

	.breadcrumb-item span[aria-current='page'] {
		font-weight: bold;
		color: var(--color-text);
	}
</style>
