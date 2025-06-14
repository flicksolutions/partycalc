<script lang="ts">
	import Recursive from './Recursive.svelte';
	import { order } from './order.svelte.ts';

	let { items } = $props();
</script>

<ul>
	{#each items as item}
		<li>
			{#if item.length > 0}
				<Recursive items={item} />
			{:else}
				<button onclick={() => order.addOrder(item)}>
					<h2>{item.title}</h2>
					<p>{item.price}</p>
				</button>
			{/if}
		</li>
	{/each}
</ul>
