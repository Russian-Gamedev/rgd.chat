<script lang="ts">
import type { Component } from 'svelte';

import * as icons from '$lib/assets/icons';

let { name }: { name: string } = $props();
const fallback = icons.IconExternalLink as Component;
const Icon = $derived((icons as Record<string, Component>)[name] ?? fallback);
</script>

<Icon />
