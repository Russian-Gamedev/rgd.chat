<script lang="ts">
  import Badge from "$lib/components/Badge.svelte";
  import Breadcrumb from "$lib/components/Breadcrumb.svelte";
  import Tertiary from "$lib/components/Tertiary.svelte";

  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const user = $derived(data.user);
  const isOwnProfile = $derived(data.currentUser?.id === user?.id);

  const bannerImage = $derived(user?.banner_alt ?? user?.banner);
  const bannerColor = $derived(user?.banner_color ?? "var(--color-surface)");

  const tags = $derived(user.tags ?? []);
  const links = []; /// TODO: Fetch links
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
  <div
    style:background-image={`url(${bannerImage})`}
    style:background-color={bannerColor}
    class="header"
  >
    <img
      src={user.avatar_url}
      alt={user.nickname ?? user.username}
      class="avatar"
    />
    <div class="info">
      <div class="tags">
        {#each tags as tag}
          <Badge
            label={tag.name}
            class="tag"
            title={tag.description}
            style={`background-color: ${tag.background}; color: ${tag.color};`}
          />
        {/each}
      </div>
      <h1>{user.nickname ?? user.username}</h1>
      <p>
        {user.about}
      </p>
    </div>
    {#if isOwnProfile}
      <div class="button-group">Редактировать</div>
    {/if}
  </div>

  {#if links.length > 0}
    <section>
      <Tertiary label="Ссылки" id="links" />
      <div></div>
    </section>
  {/if}
  {#if projects.length > 0}
    <section>
      <Tertiary label="Проекты" id="projects" />
      <div></div>
    </section>
  {/if}
  {#if blogs.length > 0}
    <section>
      <Tertiary label="Блоги" id="blogs" />
      <div></div>
    </section>
  {/if}
  {#if other.length > 0}
    <section>
      <Tertiary label="Прочее" id="other" />
      <div></div>
    </section>
  {/if}
</div>

<style>
  .page-content {
    display: flex;
    flex-direction: column;
    gap: 48px;
    margin-top: 20px;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .header {
    position: relative;
    width: 100%;
    background-size: cover;
    background-position: center;
    padding: 16px;
    border-radius: 8px;
    display: flex;
  }
  .header::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
    border-radius: 8px;
  }

  .header > * {
    position: relative;
    z-index: 1;
  }

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 12px;
  }

  .info {
    display: flex;
    flex-direction: column;
    margin-left: 16px;

    & .tags {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }

    & h1 {
      margin: 0;
      font-size: 24px;
    }

    & p {
      margin: 4px 0 0 0;
      font-size: 14px;
      color: var(--color-text-secondary);
    }
  }

  :global(.tags .tag) {
    font-size: 12px;
  }

  .button-group {
    margin-left: auto;
  }
</style>
