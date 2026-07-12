<script lang="ts">
import { page } from '$app/state';
import GameEditorPage from '$lib/games/GameEditorPage.svelte';

const gameId = $derived(page.params.id);
</script>

<GameEditorPage {gameId} />
