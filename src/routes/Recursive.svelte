<script lang="ts">
	import Recursive from './Recursive.svelte';
	import { order } from './order.svelte.ts';

	let { items, colorIndex = 0 } = $props();

	let bgColors = [
		'bg-secondary-100-900',
		'bg-secondary-200-800',
		'bg-secondary-300-700',
		'bg-secondary-400-600',
		'bg-secondary-500'
	];
	let textColors = [
		'text-secondary-contrast-100-900',
		'text-secondary-contrast-200-800',
		'text-secondary-contrast-300-700',
		'text-secondary-contrast-400-600',
		'text-secondary-contrast-500'
	];
</script>

<ul class={['flex flex-wrap', bgColors[colorIndex]]}>
	{#each items as item}
		<li class={[textColors[colorIndex], 'grow p-4']}>
			{#if item.length > 0}
				<Recursive items={item} colorIndex={colorIndex + 1} />
			{:else}
				<button class="hover:bg-primary-200-800 h-full w-full" onclick={() => order.addOrder(item)}>
					<h2>{item.title}</h2>
					<p>{item.price}</p>
				</button>
			{/if}
		</li>
	{/each}
</ul>

<style>
	:global(li:not(:has(ul))) {
		border-left: 1px solid var(--color-secondary-contrast-500);
	}
</style>
