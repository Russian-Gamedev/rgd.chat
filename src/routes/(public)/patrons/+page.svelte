<script lang="ts">
import { onMount } from 'svelte';

import type { Donation, DonationsPage } from '$lib/api/api.type';
import patronsBanner from '$lib/assets/backgrounds/patrons-banner.webp';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import SkeletonImage from '$lib/components/SkeletonImage.svelte';
import Tertiary from '$lib/components/Tertiary.svelte';
import { createInfiniteScrollObserver } from '$lib/utils/infinite-scroll';

import type { PageProps } from './$types';

let { data }: PageProps = $props();

const patrons = $derived(data.patrons);
const donations = $derived(data.donations);

let loadedPages = $state<DonationsPage[]>([]);
let isLoadingMore = $state(false);
let hasLoadError = $state(false);
let sentinel: HTMLElement | undefined = $state();

const donationItems = $derived(
	uniqueDonations([...(donations?.items ?? []), ...loadedPages.flatMap((page) => page.items)])
);
const currentPage = $derived(loadedPages.at(-1)?.page ?? donations?.page ?? 1);
const perPage = $derived(loadedPages.at(-1)?.per_page ?? donations?.per_page ?? 20);
const total = $derived(loadedPages.at(-1)?.total ?? donations?.total ?? 0);
const hasMore = $derived(donations !== null && currentPage * perPage < total);

async function loadNextPage(options?: { force?: boolean }) {
	if (isLoadingMore || !hasMore) return;
	if (hasLoadError && !options?.force) return;

	isLoadingMore = true;
	hasLoadError = false;

	try {
		const response = await fetch(`/api/donations?page=${currentPage + 1}&per_page=${perPage}`);
		if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

		loadedPages = [...loadedPages, (await response.json()) as DonationsPage];
	} catch (error) {
		console.error('Failed to load donations page', error);
		hasLoadError = true;
	} finally {
		isLoadingMore = false;

		if (hasMore && sentinel && !hasLoadError) {
			const rect = sentinel.getBoundingClientRect();
			const threshold = window.innerHeight + 400;
			if (rect.top <= threshold && rect.bottom >= 0) {
				loadNextPage();
			}
		}
	}
}

onMount(() => {
	if (!sentinel) return;

	return createInfiniteScrollObserver(sentinel, () => void loadNextPage());
});

function uniqueDonations(items: Donation[]): Donation[] {
	const seen = new Set<string>();

	return items.filter((donation) => {
		const key = `${donation.date}|${donation.username}`;
		if (seen.has(key)) return false;

		seen.add(key);
		return true;
	});
}

function formatDonation(value: number): string {
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
		maximumFractionDigits: 2,
		minimumFractionDigits: 0
	}).format(value);
}

function formatDonationDate(date: string): string {
	return new Date(date).toLocaleString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

function getFallbackAvatar(username: string): string {
	return `https://blobatar.dev/avatar/${username}?size=64`;
}

function getBannerImageUrl(banner: string): string | null {
	if (!banner?.startsWith('http://') && !banner?.startsWith('https://')) return null;
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
      {#each patrons.slice(0, 3) as patron, index (patron.user.username)}
        {@const hasProfile = Boolean(patron.user.id)}
        {@const bannerImageUrl = getBannerImageUrl(patron.user.banner)}
        {@const bannerColor = getBannerColor(patron.user.banner)}

        <svelte:element
          this={hasProfile ? 'a' : 'div'}
          href={hasProfile ? `/${patron.user.username}` : undefined}
          class="patron"
        >
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
                fallbackSrc={getFallbackAvatar(patron.user.username)}
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
        </svelte:element>
      {/each}
    </div>

    <div class="regular-patrons">
      {#each patrons.slice(3) as patron (patron.user.username)}
        {@const hasProfile = Boolean(patron.user.id)}
        <svelte:element
          this={hasProfile ? 'a' : 'div'}
          href={hasProfile ? `/${patron.user.username}` : undefined}
          class="patron without-banner"
        >
          <div class="content">
            <div class="identity">
              <SkeletonImage
                class="avatar"
                src={patron.user.avatar_url}
                fallbackSrc={getFallbackAvatar(patron.user.username)}
                alt={patron.user.username}
              />
              <h2>{patron.user.username}</h2>
            </div>

            <span class="value-badge">{formatDonation(patron.value)}</span>
          </div>
        </svelte:element>
      {/each}
    </div>
  </section>
{/if}

<section class="recent-donations" aria-label="Последние донаты">
  <Tertiary label="Последние донаты" />

  {#if donations === null}
    <p>Не удалось загрузить последние донаты.</p>
  {:else if donationItems.length === 0}
    <p>Донаты не найдены.</p>
  {:else}
    <div class="donations">
      {#each donationItems as donation (donation.date + donation.username)}
        <article class="donation">
          {#if donation.message}
            <p class="donation-message">{donation.message}</p>
          {/if}

          {#if donation.image}
            <img
              class="donation-image"
              src={donation.image}
              alt={`Донат от ${donation.username}`}
              loading="lazy"
            />
          {/if}

          <time datetime={donation.date}>{formatDonationDate(donation.date)}</time>
        </article>
      {/each}
    </div>

    <div class="loader" bind:this={sentinel}>
      {#if isLoadingMore}
        <p>Загружаем ещё донаты...</p>
      {:else if hasLoadError}
        <button class="retry-button" type="button" onclick={() => loadNextPage({ force: true })}>
          Повторить загрузку
        </button>
      {:else if !hasMore}
        <p>Больше донатов нет.</p>
      {/if}
    </div>
  {/if}
</section>

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
    text-decoration: none;
    color: inherit;
    display: block;
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

  .recent-donations {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 2.5rem;
  }

  .donations {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .donation {
    background-color: var(--color-bg-surface);
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .donation-message {
    color: var(--color-text);
    font-size: 14px;
    line-height: 1.4;
    margin: 0;
    overflow-wrap: anywhere;
  }

  .donation-image {
    aspect-ratio: 565 / 95;
    border-radius: 8px;
    display: block;
    height: auto;
    margin-top: 0.5rem;
    max-width: 565px;
    width: 100%;
  }

  .loader {
    display: flex;
    justify-content: center;
    min-height: 4rem;
    padding: 1.5rem 0;
  }

  .loader p {
    font-size: 1rem;
  }

  .retry-button {
    border: 0;
    border-radius: 0.5rem;
    background-color: var(--color-primary);
    color: var(--color-text);
    cursor: pointer;
    font: inherit;
    font-weight: 700;
    padding: 0.75rem 1rem;
  }

  time {
    color: var(--color-text-secondary);
    display: block;
    font-size: 12px;
    margin-top: 0.375rem;
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
