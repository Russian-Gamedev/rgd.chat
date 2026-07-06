<script lang="ts" generics="Element extends keyof SvelteHTMLElements">
  import type { SvelteHTMLElements } from "svelte/elements";

  interface BadgeProps {
    as?: Element;
  }

  let {
    as = "span" as Element,
    children,
    ...rest
  }: BadgeProps & SvelteHTMLElements[Element] = $props();
</script>

<svelte:element this={as} {...rest} class={["badge", rest.class]}>
  {@render children?.()}
</svelte:element>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    background-color: var(--color-bg-surface);
    color: var(--color-text);
    border-radius: 100px;
    padding: 2px 8px;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    gap: 0.25rem;
    user-select: none;
    height: fit-content;
    border: none;
    outline: none;
  }
</style>
