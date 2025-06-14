<script lang="ts">
	import articles from '$lib/articles.json';
	import Recursive from './Recursive.svelte';
	import { order } from './order.svelte.ts';
</script>

<div>
	<div>
		List of items
		<Recursive items={articles} />
	</div>
	<div>
		calculations
		<div>
			{#each order.list as item (item.id)}
				<h2>{item.title}</h2>
				<p>{item.price}</p>
				<p>
					<button class="btn-icon preset-filled" onclick={() => order.reduceOrder(item.id)}
						>-</button
					>{item.quantity}<button
						class="btn-icon preset-filled"
						onclick={() => order.addOrder(item)}>+</button
					>
				</p>
			{/each}
		</div>
		<p>Total: {order.sum}</p>
		<div>
			<button class="btn preset-filled-primary-500" onclick={() => order.clearOrders()}
				>Clear</button
			>
			<button class="btn preset-filled-primary-500" disabled>Print</button>
		</div>
	</div>
</div>
