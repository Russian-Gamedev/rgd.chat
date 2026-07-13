<script lang="ts">
import type { GameDetailsDto, GameEditorDto } from '$lib/api/api.type';

import { compareRevisions } from './review-utils';

let { working, published }: { working: GameEditorDto; published: GameDetailsDto | null } = $props();
const rows = $derived(compareRevisions(working, published));
</script>

{#if !published}<p class="muted">Опубликованной версии для сравнения нет.</p>{:else}<section class="comparison"><div class="columns"><strong>Новая редакция</strong><strong>Опубликованная версия</strong></div>{#each rows as row (row.field)}<div class:changed={row.changed} class="row"><strong>{row.field}</strong><div>{row.working || '—'}</div><div>{row.published || '—'}</div></div>{/each}</section>{/if}

<style>
	.columns, .row { display: grid; gap: .75rem; grid-template-columns: 150px 1fr 1fr; padding: .75rem; }
	.columns { background: var(--color-bg-surface); }
	.row { border-bottom: 1px solid #303238; overflow-wrap: anywhere; }
	.row.changed { background: color-mix(in srgb, var(--color-warning) 12%, transparent); }
	.muted { color: var(--color-text-secondary); }
	@media (max-width: 700px) { .columns, .row { grid-template-columns: 1fr; } }
</style>
