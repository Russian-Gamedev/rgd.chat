<script lang="ts">
	function openDiscordDialog(e) {
		alert('Open authorization dialog');
		e.target.blur();
	}
</script>

<button on:click={openDiscordDialog}>
	<img src="icons/discord.svg" alt="Discord" />
	Войти
</button>

<style>
	button {
		display: flex;
		align-items: center;
		gap: 1em;
		padding: 0.75em 2.25em;
		margin: 0.8rem 0;

		font-weight: bold;
		letter-spacing: 0.04em;

		background-color: var(--primary);
		cursor: pointer;
	}

	img {
		width: 2rem;
	}
</style>
