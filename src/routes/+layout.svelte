<script lang="ts">
  import { deepMerge, MetaTags } from "svelte-meta-tags";

  import { onNavigate } from "$app/navigation";
  import "../styles/globals.css";

  import { page } from "$app/state";
  import {
    SITE_DESCRIPTION,
    SITE_LOGO,
    SITE_NAME,
    SITE_SOCIAL_LINKS,
    SITE_URL,
  } from "$lib/site-config";
  import { startPageViewTransition } from "$lib/view-transition";

  import type { LayoutProps } from "./$types";
  import Navbar from "./navbar.svelte";

  onNavigate((navigation) => {
    return startPageViewTransition(navigation);
  });

  let { children, data }: LayoutProps = $props();

  const metaTags = $derived(
    deepMerge(data.baseMetaTags, page.data.pageMetaTags),
  );
  const themeColor = $derived(data.themeColor);
</script>

<MetaTags {...metaTags} />

<svelte:head>
  <link rel="icon" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content={themeColor} />
  <meta name="robots" content="index, follow" />
  <meta name="language" content="Russian" />
  <link rel="alternate" href="https://rgd.chat" hreflang="ru" />
  <link rel="alternate" href="https://rgd.chat" hreflang="x-default" />
  <link rel="preload" as="image" href="https://assets.rgd.chat/banner.jpg" />
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
      "logo": SITE_LOGO,
      "description": SITE_DESCRIPTION,
      "sameAs": SITE_SOCIAL_LINKS
    })}
  </script>
</svelte:head>

<div class="root">
  <Navbar />
  <main>
    {@render children()}
  </main>
</div>

<style>
  .root {
    display: flex;
    min-height: 100vh;
  }

  main {
    flex: 1;
    min-width: 0;
    padding: 64px 40px;
  }

  @media (max-width: 767px) {
    .root {
      flex-direction: column;
    }

    main {
      padding: 24px 16px;
    }
  }
</style>
