<script lang="ts">
import * as icons from '$lib/assets/icons';
import Breadcrumb from '$lib/components/Breadcrumb.svelte';
import Button from '$lib/components/Button.svelte';
import Input from '$lib/components/Input.svelte';
import Tertiary from '$lib/components/Tertiary.svelte';

const iconEntries = Object.entries(icons).sort(([a], [b]) => a.localeCompare(b));
</script>

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

<style>
	:global(main) {
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
