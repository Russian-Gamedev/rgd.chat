<script lang="ts">
	function openDiscordDialog(e) {
		console.log('What?');
		e.target.blur();
	}
</script>

<button on:click={openDiscordDialog}>
	<img src="icons/discord.svg" alt="Discord" />
	Присоединится
</button>

<style>
	button {
		display: flex;
		align-items: center;
		gap: 1em;
		padding: 0.75em 2.5em;
		margin: 0.8rem 0;

		font-weight: bold;
		letter-spacing: 0.04em;

		background-color: var(--discord-color);

		cursor: pointer;
	}

	img {
		width: 2rem;
	}
</style>
