<button on:click class={$$props.class}> <slot /> </button>

<style lang="scss">
	button {
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
	}
</style>
