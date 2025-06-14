<script lang="ts">
	import articles from '$lib/articles.json';
	import Recursive from './Recursive.svelte';
	import { order } from './order.svelte.ts';
</script>

<div class="grid h-screen gap-5 p-5 md:grid-cols-[4fr_1fr]">
	<h1 class="hidden">Kassensystem</h1>
	<main>
		<div>
			<h2 class="h2">Produkte</h2>
			<Recursive items={articles} />
		</div>
	</main>
	<aside>
		<h2 class="h2">Bestellung</h2>
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
			<button class="btn preset-filled-primary-500" onclick={() => order.clearOrders()}>
				Clear
			</button>
			<button class="btn preset-filled-primary-500" disabled>Print</button>
		</div>
	</aside>
</div>
