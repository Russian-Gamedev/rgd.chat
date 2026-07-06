<script lang="ts">
import type { ProfileLink } from '$lib/api/api.type';
import * as Icons from '$lib/assets/icons';

import ProfileSection from './ProfileSection.svelte';

type ProfileLinksProps = {
	links: ProfileLink[];
};

let { links }: ProfileLinksProps = $props();

function getIcon(icon: string) {
	// biome-ignore lint/performance/noDynamicNamespaceImportAccess: icon key is user-selected, cannot be statically determined
	return icon in Icons ? Icons[icon as keyof typeof Icons] : Icons.IconGlobe;
}
</script>

{#if links.length > 0}
	<ProfileSection label="Ссылки" id="links">
		<div class="profile-links">
			{#each links as link}
				{@const Icon = getIcon(link.icon)}
				<a href={link.url} class="profile-link" title={link.icon} target="_blank" rel="noopener noreferrer">
					<Icon />
					{link.label}
				</a>
			{/each}
		</div>
	</ProfileSection>
{/if}

<style>
	.profile-links {
		display: flex;
		gap: 48px;
	}

  .profile-link {
		width: 100%;
    padding: 16px;
    background-color: var(--color-bg-surface);
    border-radius: 8px;
    display: flex;
    align-items: center;
    color: var(--color-text-primary);
    gap: 8px;
	}

  :global(.profile-link svg) {
    color: #fff;
    background-color: var(--color-primary);
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 6px;
  }
</style>
