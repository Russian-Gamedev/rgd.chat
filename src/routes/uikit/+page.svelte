<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Button from '$lib/components/Button.svelte';
	import Tertiary from '$lib/components/Tertiary.svelte';
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
	<Breadcrumb items={[{ href: '/home', label: 'Home' }]} />
	<Breadcrumb
		items={[
			{ href: '/home', label: 'Home' },
			{ href: '/uikit', label: 'UI Kit' }
		]}
	/>

	<Breadcrumb
		items={[
			{ href: '/home', label: 'Home' },
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
		gap: 1rem;
	}
</style>
