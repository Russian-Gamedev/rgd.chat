<span on:click class={$$props.class}>
	<slot />
</span>

<style lang="scss">
	span {
		display: inline-flex;
		gap: 0.2rem;
		padding: 0.1rem 0.4rem;
		font-size: 0.5rem;
		font-weight: 700;
		line-height: 0.8rem;
		letter-spacing: 0.025rem;
		border-radius: 2em;
		color: var(--pure-white);
		background-color: var(--secondary-background);
	}
</style>
