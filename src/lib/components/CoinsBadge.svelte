<script lang="ts">
import type { SvelteHTMLElements } from 'svelte/elements';

import { COINS_TOP } from '$lib/site-config';

import Badge from './Badge.svelte';

interface CoinsBadgeProps {
	balance: string | number;
}

let { balance, ...rest }: CoinsBadgeProps & SvelteHTMLElements['span'] = $props();

const formattedBalance = $derived(Number(balance).toLocaleString('ru-RU'));
</script>

<Badge style="background-color: var(--color-bg);" {...rest}>
  <img class="coin" src={COINS_TOP} alt="" />
  <span class="balance">{formattedBalance}</span>
</Badge>

<style>
  .coin {
    display: inline-flex;
    width: 24px;
    height: 24px;
  }

  .balance {
    color: var(--color-text);
    font-variant-numeric: tabular-nums;
  }
</style>
