<script lang="ts">
let {
	src = null,
	name,
	size = '2rem'
}: {
	src?: string | null;
	name: string;
	size?: string;
} = $props();

let broken = $state(false);

/**
 * Дефолтная аватарка — как в боте: `cdn.discordapp.com/embed/avatars/{n}.png`,
 * где n % 6. Для свободного имени (без id) n — хеш строки, чтобы одно имя
 * всегда давало одну и ту же аватарку.
 */
function fallbackUrl(seed: string): string {
	let hash = 2166136261;
	for (const character of seed) {
		hash ^= character.codePointAt(0) ?? 0;
		hash = Math.imul(hash, 16777619);
	}
	return `https://cdn.discordapp.com/embed/avatars/${(hash >>> 0) % 6}.png`;
}

const url = $derived(!src || broken ? fallbackUrl(name) : src);
</script>

<img
	class="avatar"
	src={url}
	alt={name}
	style:width={size}
	style:height={size}
	onerror={() => (broken = true)}
/>

<style>
	.avatar {
		background: var(--color-bg);
		border-radius: 50%;
		flex-shrink: 0;
		object-fit: cover;
	}
</style>
