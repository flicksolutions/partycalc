<script lang="ts">
	import articles from '$lib/articles.json';
	import Recursive from './Recursive.svelte';
	import { order } from './order.svelte.ts';
	import { onMount } from 'svelte';
	import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder';

	let printer: any;
	const encoder = new ReceiptPrinterEncoder();

	let printerID = $state();
	let connected = $state(false);

	onMount(async () => {
		const WebBluetoothReceiptPrinter = (await import('@receipt-printer')).default;
		printer = new WebBluetoothReceiptPrinter();
		printer.addEventListener('connected', (device) => {
			printerID = device.id;
			connected = true;
			console.log('Connected to printer:', device);
			// encoder = new ReceiptPrinterEncoder(); // might be necessary if codepage or language is not default
		});
	});

	const handlePrint = async () => {
		if (!printerID) {
			printerID = await printer.connect();
		} else {
			await printer.reconnect(printerID);
		}
		let data = encoder.initialize().text('Bestellungäöü').newline().encode();
		printer.print(data);
	};
</script>

<div class="grid h-screen gap-5 p-5 md:grid-cols-[4fr_1fr]">
	<h1 class="hidden">Kassensystem</h1>
	<main>
		<div>
			<h2 class="h2">Produkte</h2>
			<Recursive items={articles} />
		</div>
	</main>
	<aside class="grid h-full max-h-full grid-rows-[1fr_auto] overflow-hidden">
		<div class="overflow-y-auto">
			<h2 class="h2">Bestellung</h2>
			<div class="flex max-h-full flex-col gap-2 overflow-y-auto">
				{#if order.list.length === 0}
					<p class="text-center">Keine Artikel in der Bestellung</p>
				{/if}
				{#each order.list as item (item.id)}
					<div class="flex items-center justify-between gap-2">
						<p>{item.title} à {item.price}</p>
						<p class="shrink-0">
							<button
								class="btn-icon btn-icon-lg preset-filled m-2"
								onclick={() => order.reduceOrder(item.id)}>-</button
							>{item.quantity}<button
								class="btn-icon btn-icon-lg preset-filled m-2"
								onclick={() => order.addOrder(item)}>+</button
							>
						</p>
					</div>
				{/each}
			</div>
		</div>
		<div>
			<hr class="hr mt-4 mb-2" />
			<p class="mb-4 text-3xl font-black">Total: {order.sum}</p>
			<div>
				<button class="btn preset-filled-primary-500" onclick={() => order.clearOrders()}>
					Clear
				</button>
				<button class="btn preset-filled-primary-500" onclick={handlePrint}>Print</button>
			</div>
		</div>
	</aside>
</div>
