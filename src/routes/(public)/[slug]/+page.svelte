<script lang="ts">
import Breadcrumb from '$lib/components/Breadcrumb.svelte';

import type { PageProps } from './$types';
import EditProfileModal from './EditProfileModal.svelte';
import ProfileHeader from './ProfileHeader.svelte';
import ProfileLinks from './ProfileLinks.svelte';
import ProfileSection from './ProfileSection.svelte';

let { data }: PageProps = $props();

let savedUser = $state<typeof data.user | null>(null);
let isEditProfileOpen = $state(false);

const routeUser = $derived(data.user);
const user = $derived(savedUser ?? routeUser);

$effect(() => {
	if (savedUser && savedUser.id !== routeUser.id) {
		savedUser = null;
	}
});

const isOwnProfile = $derived(data.currentUser?.id === user?.id);

const links = $derived(user.info?.links ?? []);
const projects = []; /// TODO: Fetch projects
const blogs = []; /// TODO: Fetch blogs
const other = []; /// TODO: Fetch other
</script>

<Breadcrumb
  items={[
    { label: "Главная", href: "/" },
    { label: user.username, href: `/${user.username}` },
  ]}
/>

<div class="page-content">
  <ProfileHeader
    {user}
    {isOwnProfile}
    onEdit={() => (isEditProfileOpen = true)}
  />

  <ProfileLinks {links} />
  {#if projects.length > 0}
    <ProfileSection label="Проекты" id="projects">
      <div></div>
    </ProfileSection>
  {/if}
  {#if blogs.length > 0}
    <ProfileSection label="Блоги" id="blogs">
      <div></div>
    </ProfileSection>
  {/if}
  {#if other.length > 0}
    <ProfileSection label="Прочее" id="other">
      <div></div>
    </ProfileSection>
  {/if}
</div>

{#if isOwnProfile}
  <EditProfileModal
    open={isEditProfileOpen}
    {user}
    onClose={() => (isEditProfileOpen = false)}
    onSaved={(updatedUser) => (savedUser = updatedUser)}
  />
{/if}

<style>
  .page-content {
    display: flex;
    flex-direction: column;
    gap: 48px;
    margin-top: 20px;
  }

</style>
