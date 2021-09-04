<script lang="ts">
	export let href: string;
	export let rel: string | null = null;
</script>

<a class={$$props.class} {href} {rel}> <slot /> </a>

<style lang="scss">
	a {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.6rem 1rem;
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.3rem;
		color: var(--pure-white);
		border-radius: 0.4rem;
		background-color: var(--primary);

		&:hover {
			text-decoration: none;
		}

		&:visited {
			color: var(--pure-white);
		}
	}
</style>
