<script lang="ts">
import { IconExternalLink } from '$lib/assets/icons';

export let href: string;
export let target: string = '_blank';
export let rel: string = 'noopener noreferrer';
export let className: string = '';
</script>

<a {href} {target} {rel} class={className}><slot /><IconExternalLink /></a>
