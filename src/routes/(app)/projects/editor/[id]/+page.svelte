<script lang="ts">
import { page } from '$app/state';
import ProjectEditorPage from '$lib/projects/ProjectEditorPage.svelte';

const projectId = $derived(page.params.id);
</script>

<ProjectEditorPage {projectId} />
