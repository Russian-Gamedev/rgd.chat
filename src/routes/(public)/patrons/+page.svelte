<script lang="ts">
import patronsBanner from '$lib/assets/backgrounds/patrons-banner.webp';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import SkeletonImage from '$lib/components/SkeletonImage.svelte';
import Tertiary from '$lib/components/Tertiary.svelte';

import type { PageProps } from './$types';

let { data }: PageProps = $props();

const patrons = $derived(data.patrons);

function formatDonation(value: number): string {
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
		maximumFractionDigits: 2,
		minimumFractionDigits: 0
	}).format(value);
}

function getBannerImageUrl(banner: string): string | null {
	if (!banner.startsWith('http://') && !banner.startsWith('https://')) return null;
	return banner;
}

function getBannerColor(banner: string): string | undefined {
	return /^#[0-9a-f]{3,8}$/i.test(banner) ? banner : undefined;
}
</script>

<Breadcrumb
  items={[
    { label: "Главная", href: "/" },
    { label: "Донатеры", href: "/patrons" },
  ]}
/>

<section
  class="main-banner"
  style:background-image={`linear-gradient(180deg, transparent 60%, rgba(0, 0, 0, 0.6) 100%), url(${patronsBanner})`}
>
  <p>Возможность внести свою лепту</p>
</section>

<Tertiary label="Поддержавшие" />

{#if patrons === null}
  <p>Не удалось загрузить список донатеров.</p>
{:else if patrons.length === 0}
  <p>Донатеры не найдены.</p>
{:else}
  <section class="patrons" aria-label="Список донатеров">
    <div class="top-patrons">
      {#each patrons.slice(0, 3) as patron, index (patron.user.id)}
        {@const bannerImageUrl = getBannerImageUrl(patron.user.banner)}
        {@const bannerColor = getBannerColor(patron.user.banner)}

        <article class="patron">
          {#if bannerImageUrl}
            <SkeletonImage class="banner" src={bannerImageUrl} alt="" />
          {:else}
            <div
              class="banner fallback-banner"
              style:background-color={bannerColor}
            ></div>
          {/if}

          <div class="content">
            <div class="identity">
              <SkeletonImage
                class="avatar"
                src={patron.user.avatar_url}
                alt={patron.user.username}
              />
              <h2>{patron.user.username}</h2>
            </div>

            <span
              class="value-badge"
              class:rank-first={index === 0}
              class:rank-second={index === 1}
              class:rank-third={index === 2}
            >
              {formatDonation(patron.value)}
            </span>
          </div>
        </article>
      {/each}
    </div>

    <div class="regular-patrons">
      {#each patrons.slice(3) as patron (patron.user.id)}
        <article class="patron without-banner">
          <div class="content">
            <div class="identity">
              <SkeletonImage
                class="avatar"
                src={patron.user.avatar_url}
                alt={patron.user.username}
              />
              <h2>{patron.user.username}</h2>
            </div>

            <span class="value-badge">{formatDonation(patron.value)}</span>
          </div>
        </article>
      {/each}
    </div>
  </section>
{/if}

<style>
  .patrons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .main-banner {
    align-items: flex-end;
    background-position: center;
    background-size: cover;
    border-radius: 0.5rem;
    display: flex;
    height: 420px;
    margin: 1.5rem 0;
    overflow: hidden;
    padding: 1.5rem;
  }

  .main-banner p {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.3;
    margin: 0;
    max-width: 520px;
  }

  .top-patrons {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .top-patrons .patron {
    flex: 1 1 280px;
  }

  .regular-patrons {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .patron {
    background-color: var(--color-bg-surface);
    border-radius: 0.5rem;
    overflow: hidden;
    transition: transform 180ms ease;
  }

  .patron:hover {
    transform: translateY(-2px);
  }

  .patron.without-banner {
    height: 60px;
  }

	.banner,
	:global(.banner) {
		aspect-ratio: 5 / 2;
		background-color: var(--color-bg);
		display: block;
    object-fit: cover;
    width: 100%;
  }

  .fallback-banner {
    background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--color-primary) 32%, transparent),
        transparent
      ),
      var(--color-bg);
  }

  .content {
    align-items: center;
    display: flex;
    gap: 0.75rem;
    justify-content: space-between;
    padding: 1rem;
  }

  .identity {
    align-items: center;
    display: flex;
    gap: 0.625rem;
    min-width: 0;
  }

	:global(.avatar) {
		background-color: var(--color-bg);
		border-radius: 9px;
		flex: 0 0 auto;
    height: 28px;
    object-fit: cover;
    width: 28px;
  }

  h2 {
    font-size: 14px;
    font-weight: 700;
    line-height: 1.4;
    margin: 0;
    overflow-wrap: anywhere;
  }

  .value-badge {
    background-color: var(--color-primary);
    border-radius: 999px;
    color: var(--color-text);
    flex: 0 0 auto;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
    height: 20px;
    padding: 0 0.5rem;
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
  }

  .value-badge.rank-first {
    background-color: #deab43;
  }

  .value-badge.rank-second {
    background-color: #9fa7ab;
  }

  .value-badge.rank-third {
    background-color: #de9c65;
  }

  @media (max-width: 1264px) {
    .top-patrons .patron:first-child {
      flex-basis: 100%;
    }

    .top-patrons .patron:not(:first-child) {
      flex-basis: calc((100% - 1rem) / 2);
    }

    .regular-patrons {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 767px) {
    .main-banner {
      height: 420px;
      padding: 1rem;
    }

    .main-banner p {
      font-size: 14px;
    }

    .top-patrons .patron {
      flex-basis: 100%;
    }

    .regular-patrons {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .patron {
      transition: none;
    }

    .patron:hover {
      transform: none;
    }
  }
</style>
