<script lang="ts">
import type { Component } from 'svelte';
import type { SvelteHTMLElements } from 'svelte/elements';

import { IconExternalLink } from '$lib/assets/icons';

type LinkProps = {
	href: string;
	target?: string;
	rel?: string;
	className?: string;
	icon?: Component | null;
};

let {
	href,
	target = '_blank',
	rel = 'noopener noreferrer',
	className = '',
	children,
	icon: Icon = IconExternalLink,
	...rest
}: LinkProps & SvelteHTMLElements['a'] = $props();
</script>

<a {href} {target} {rel} class={className} {...rest}
  >{@render children?.()}
  <Icon />
</a>
