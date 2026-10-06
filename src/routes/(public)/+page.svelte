<script lang="ts">
import { IconJam, IconVK, IconYoutube } from '$lib/assets/icons';
import ExternalLink from '$lib/assets/icons/external-link.svelte';
import ActivityGraph from '$lib/components/ActivityGraph.svelte';
import BadgeCounter from '$lib/components/BadgeCounter.svelte';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import Button from '$lib/components/Button.svelte';
import Tertiary from '$lib/components/Tertiary.svelte';
import { SHOW_COMMUNITY_STATS } from '$lib/site-config';

import type { PageProps } from './$types';

let { data }: PageProps = $props();

const stats = $derived(data.stats);
const { motd } = $derived(data.motd);
const activity = $derived(data.activity);

const cards = [
	{
		icon: IconVK,
		title: 'ВКонтакте',
		description: 'Наше сообщество',
		link: 'https://vk.com/rgd_discord'
	},
	{
		icon: IconYoutube,
		title: 'YouTube',
		description: 'Записи подведения итогов джемов',
		link: 'https://www.youtube.com/channel/UCZq4wK7UprpSiJRQLIjtbqw'
	},
	{
		icon: IconJam,
		title: 'Последний джем',
		description: '35 игр, 5 часов прохождения',
		link: 'https://youtu.be/bDBhfamPtvo'
	}
];
</script>

<Breadcrumb items={[{ label: "Главная", href: "/" }]} />

<h1>Russian Gamedev — Discord сообщество</h1>

<p class="description">
  Обитель разработчиков игр, где вы услышите экспертное мнение по поводу своих
  игр и идей, найдёте отличных напарников которые не бросят под самый релиз, и
  живой войс где мы регулярно срём новых участников и играем в игры.
</p>

<div class="badges">
  <BadgeCounter label="Участников" count={stats?.total ?? 2263} />
  <BadgeCounter label="Онлайн" count={stats?.online ?? 520} />
</div>

<div class="actions">
  <Button
    as="a"
    class="join-button"
    href="https://join.rgd.chat"
    target="_blank"
    rel="noopener noreferrer"
    data-rybbit-event="join_discord"
    data-rybbit-prop-button="main"
  >
    Присоединиться
    <ExternalLink />
  </Button>

</div>

<section class="links">
  <Tertiary label="Полезные ссылки" />
  <div class="cards">
    {#each cards as card (card.link)}
      <a
        href={card.link}
        target="_blank"
        rel="noopener noreferrer"
        class="card"
        data-rybbit-event="click_card"
        data-rybbit-prop-card={card.title}
      >
        <div class="card-icon">
          <card.icon />
        </div>
        <h4 class="card-title">{card.title}</h4>
        <p class="card-description">{card.description}</p>
      </a>
    {/each}
  </div>
</section>

{#if SHOW_COMMUNITY_STATS && activity}
	<section class="community">
		<Tertiary label="Активность сообщества" />
		<div class="badges">
			<BadgeCounter label="Активных за неделю" count={activity.activeWeekUsers} />
			<BadgeCounter
				label="Часов в голосовых каналах"
				count={Math.round(activity.totals.voiceSeconds / 3600)}
			/>
			<BadgeCounter label="Реакций поставлено" count={activity.totals.reactionCount} />
		</div>
		<ActivityGraph days={activity.days} />
	</section>
{/if}

<Tertiary title="Сообщение дня" label={motd} />

<style>
  .community {
    margin-top: 48px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 48px;
  }

  :global(.join-button) {
    font-weight: bold;
    font-size: 20px;
    margin: 24px 0;
    position: relative;
  }

  .links {
    margin-top: 48px;
  }

  .actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .cards {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    row-gap: 2rem;
    margin-bottom: 3rem;
    margin-top: 1.5rem;
  }

  .card {
    padding: 1rem;
    background-color: var(--color-bg-surface);
    border-radius: 0.5rem;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    flex: 1;
    text-decoration: none;
    transition: transform 500ms;
    color: var(--color-text);

    &:hover {
      transform: translateY(-0.25rem);
    }
  }

  .card-icon {
    color: #fff;
    background-color: var(--color-primary);
    border-radius: 0.75rem;
    padding: 0.625rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    margin-bottom: 1rem;
  }

  .card-title {
    font-weight: 700;
    font-size: 0.875rem;
    line-height: 1.5rem;
    margin: 0;
  }
  .card-description {
    margin-top: 0.375rem;
    font-size: 0.875rem;
    line-height: 1.5rem;
    margin-bottom: 0;
  }

  .badges {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
</style>
