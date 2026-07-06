<script lang="ts">
import * as icons from '$lib/assets/icons';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import Button from '$lib/components/Button.svelte';
import IconPicker from '$lib/components/IconPicker.svelte';
import Input from '$lib/components/Input.svelte';
import { Popout, type PopoutApi } from '$lib/components/popout';
import Tertiary from '$lib/components/Tertiary.svelte';

const iconEntries = Object.entries(icons).sort(([a], [b]) => a.localeCompare(b));

let manualPopout: PopoutApi | undefined = $state();
let selectedIcon = $state('IconGlobe');
</script>

<div class="page-content">

<section>
	<Tertiary label="Typography" id="typography" />

	<h1>H1</h1>
	<h2>H2</h2>
	<h3>H3</h3>
	<h4>H4</h4>
	<h5>H5</h5>
	<h6>H6</h6>

	<p>
		This is a paragraph demonstrating the default text styling in this UI kit. It provides a clear
		and readable format for content presentation.
	</p>
	<p>
		<strong>Bold text</strong> is used to emphasize important information, while
		<em>italic text</em> can be used for emphasis or to denote titles of works.
	</p>
</section>

<section>
	<Tertiary label="Breadcrumb" id="breadcrumb" />

	<Breadcrumb items={[]} />
	<Breadcrumb items={[{ href: '/', label: 'Home' }]} />
	<Breadcrumb
		items={[
			{ href: '/', label: 'Home' },
			{ href: '/uikit', label: 'UI Kit' }
		]}
	/>

	<Breadcrumb
		items={[
			{ href: '/', label: 'Home' },
			{ href: '/uikit', label: 'UI Kit' },
			{ href: '/uikit#typography', label: 'Typography' }
		]}
	/>
</section>

<section>
	<Tertiary label="Buttons" id="buttons" />

	<div class="inline-buttons">
		<Button color="primary">Primary Solid</Button>
		<Button color="success">Success Solid</Button>
		<Button color="error">Error Solid</Button>
		<Button color="warning">Warning Solid</Button>
		<Button color="primary" disabled>Disabled</Button>
	</div>

	<div class="inline-buttons">
		<Button variant="outline" color="primary">Primary Outline</Button>
		<Button variant="outline" color="success">Success Outline</Button>
		<Button variant="outline" color="error">Error Outline</Button>
		<Button variant="outline" color="warning">Warning Outline</Button>
		<Button variant="outline" color="primary" disabled>Disabled</Button>
	</div>

	<div class="inline-buttons">
		<Button variant="ghost" color="primary">Primary Ghost</Button>
		<Button variant="ghost" color="success">Success Ghost</Button>
		<Button variant="ghost" color="error">Error Ghost</Button>
		<Button variant="ghost" color="warning">Warning Ghost</Button>
		<Button variant="ghost" color="primary" disabled>Disabled</Button>
	</div>

	<Button as="a" href="/uikit">Link Button</Button>
</section>

<section>
	<Tertiary label="Inputs" id="inputs" />

	<div style="background:var(--color-bg);flex-direction:column;display:flex;gap:1rem;padding:1rem;">
		<Input label="Text Input:" type="text" />
		<Input label="Password Input:" type="password" />
		<Input label="Email Input:" type="email" />
		<Input type="text" />
	</div>
</section>

<section>
	<Tertiary label="Icon Picker" id="icon-picker" />

	<div class="picker-demo">
		<IconPicker bind:value={selectedIcon} />
	</div>
</section>

<section>
	<Tertiary label="Popout" id="popout" />

	<div class="inline-buttons">
		<Popout mode="hover" placement="top" role="tooltip">
			{#snippet trigger()}
				<Button variant="outline">Hover tooltip</Button>
			{/snippet}

			{#snippet content()}
				<span>Short contextual hint with focus and hover support.</span>
			{/snippet}
		</Popout>

		<Popout mode="click" placement="bottom-start" role="dialog" interactive>
			{#snippet trigger()}
				<Button>Click popover</Button>
			{/snippet}

			{#snippet content()}
				<div class="popout-demo-card">
					<strong>Popover content</strong>
					<p>Any Svelte content can live here: text, controls, links, lists.</p>
					<Button variant="ghost" color="success">Action</Button>
				</div>
			{/snippet}
		</Popout>

		<Popout mode="always" placement="right" collisionPadding={16}>
			{#snippet trigger()}
				<Button variant="ghost" color="warning">Always open</Button>
			{/snippet}

			{#snippet content()}
				<span>Permanent popout, useful for pinned UI or visual debugging.</span>
			{/snippet}
		</Popout>
	</div>

	<div class="inline-buttons">
		<Popout bind:api={manualPopout} mode="manual" placement="top-end" interactive>
			{#snippet trigger()}
				<Button variant="outline" color="success">Manual anchor</Button>
			{/snippet}

			{#snippet content()}
				<div class="popout-demo-card">
					<strong>Manual API</strong>
					<p>Opened by function calls through bind:api.</p>
				</div>
			{/snippet}
		</Popout>

		<Button variant="ghost" onclick={() => manualPopout?.open()}>Open</Button>
		<Button variant="ghost" onclick={() => manualPopout?.close()}>Close</Button>
		<Button variant="ghost" onclick={() => manualPopout?.toggle()}>Toggle</Button>
	</div>

	<div class="inline-buttons">
		<Popout mode="hover" placement="bottom" tailSize={12} tailPadding={8}>
			{#snippet trigger()}
				<Button variant="outline" color="warning">Custom tail</Button>
			{/snippet}

			{#snippet tail({ side })}
				<span class="custom-tail" data-side={side}></span>
			{/snippet}

			{#snippet content()}
				<span>The tail snippet receives the actual flipped side.</span>
			{/snippet}
		</Popout>

		<Popout mode="hover" placement="left" tail={false}>
			{#snippet trigger()}
				<Button variant="outline" color="error">No tail</Button>
			{/snippet}

			{#snippet content()}
				<span>Tail can be disabled for compact overlays.</span>
			{/snippet}
		</Popout>
	</div>
</section>

<section>
	<Tertiary label="Icons" id="icons" />

	<div class="icon-grid">
		{#each iconEntries as [name, Icon] (name)}
			<article class="icon-card">
				<div class="icon-preview">
					<Icon />
				</div>
				<span>{name}</span>
			</article>
		{/each}
	</div>
</section>

</div>

<style>
	.page-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	section {
		background: var(--color-bg-surface);
		padding: 1rem;
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		gap: 10px;

		:global(.tertiary) {
			margin-bottom: 1rem !important;
		}
	}

	.inline-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.picker-demo {
		width: min(220px, 100%);
	}

	.popout-demo-card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: min(260px, calc(100vw - 48px));

		p {
			margin: 0;
			color: var(--color-text-secondary);
		}
	}

	.custom-tail {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 2px;
		background: var(--color-primary);
	}

	.icon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 1rem;
	}

	.icon-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		border-radius: 8px;
		background: var(--color-bg);
		color: var(--color-text);
	}

	.icon-preview {
		display: grid;
		place-items: center;
		width: 3.5rem;
		height: 3.5rem;
		transition: color 300ms ease-in-out;
	}

	.icon-preview :global(svg) {
		width: 32px;
		height: 32px;
	}

	.icon-preview:hover {
		color: var(--color-primary);
	}

	.icon-card span {
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		line-height: 1.25rem;
		text-align: center;
		overflow-wrap: anywhere;
	}
</style>
