<script lang="ts">
	import Recursive from './Recursive.svelte';

	let { items } = $props();
</script>

<ul>
	{#each items as item}
		<li>
			{#if item.length > 0}
				<Recursive items={item} />
			{:else}
				<button onclick={() => addItem(1)}>
					<h2>{item.title}</h2>
					<p>{item.price}</p>
				</button>
			{/if}
		</li>
	{/each}
</ul>
