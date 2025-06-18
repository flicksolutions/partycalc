<script lang="ts">
	import articles from '$lib/articles.json';
	import Recursive from './Recursive.svelte';
	import { order } from './order.svelte.ts';
	import { onMount } from 'svelte';
	import { ElementSize, PersistedState } from 'runed';
	import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder';

	let printer: any;
	const encoder = new ReceiptPrinterEncoder();

	let printerID = new PersistedState('printerID', null, { syncTabs: false });
	let connected = $state(false);

	let orderCounter = new PersistedState('orderCounter', 1, { syncTabs: false });

	onMount(async () => {
		const WebBluetoothReceiptPrinter = (await import('@receipt-printer')).default;
		printer = new WebBluetoothReceiptPrinter();
		printer.addEventListener('connected', (device: { id: null }) => {
			printerID.current = device.id;
			connected = true;
			console.log('Connected to printer:', device);
			// encoder = new ReceiptPrinterEncoder(); // might be necessary if codepage or language is not default
		});
	});

	const resetAll = () => {
		order.clearOrders();
		orderCounter.current = 1;
		printerID.current = null;
		connected = false;
	};

	const checkConnection = async () => {
		if (!connected) {
			if (printerID.current) {
				printer.reconnect(printerID.current);
				// wait until connected is true
				console.log('Waiting for printer connection...', printerID.current);
				let couldConnect = await new Promise((resolve) => {
					let attempts = 0;
					const interval = setInterval(() => {
						console.log('Checking printer connection...');
						if (connected) {
							clearInterval(interval);
							console.log('Printer connected:', printerID.current);
							resolve(true);
						} else if (++attempts >= 10) {
							clearInterval(interval);
							console.log('Printer connection timeout');
							resolve(false);
						}
					}, 200);
				});
				if (couldConnect) {
					return true;
				}
			}
			printerID.current = await printer.connect();
		}
		return true;
	};

	const handlePrint = async () => {
		if (!(await checkConnection())) {
			alert('Printer not connected');
			return;
		}
		let data = encoder
			.initialize()
			.size(2, 2)
			.line(`Nr. ${orderCounter.current}`)
			.size(1, 1)
			.newline()
			.width(2)
			.line('-'.repeat(encoder.columns / 2))
			.width(1);
		const firstColumnWidth = Math.round(encoder.columns * 0.1);
		data = data.table(
			[
				{ width: firstColumnWidth, marginRight: 1, align: 'right' },
				{
					width: encoder.columns - firstColumnWidth - 1,
					align: 'left'
				}
			],
			order.list.map((order) => [order.quantity?.toString(), order.title])
		);
		data = data
			.width(2)
			.line('-'.repeat(encoder.columns / 2))
			.width(1)
			.newline()
			.newline()
			.newline()
			.encode();

		printer.print(data);
		orderCounter.current++;
		order.clearOrders();
	};

	const handleOrderNrPrint = async () => {
		if (!(await checkConnection())) {
			alert('Printer not connected');
			return;
		}
		let data = encoder
			.initialize()
			.box({ width: encoder.columns, align: 'center', style: 'double' }, (encoder) =>
				encoder.size(2, 2).line(`Bestellung`).line(`Nr. ${orderCounter.current}`)
			)
			.newline()
			.newline()
			.newline()
			.encode();

		printer.print(data);
	};
</script>

<div class="grid h-screen gap-5 p-5 md:grid-cols-[4fr_1fr]">
	<h1 class="hidden">Kassensystem</h1>
	<main class="flex flex-col justify-between gap-5">
		<h2 class="h2">Produkte</h2>
		<Recursive items={articles} />
		<button class="btn preset-filled-error-500 w-fit" onclick={resetAll}>reset</button>
	</main>
	<aside class="grid h-full max-h-full grid-rows-[1fr_auto] overflow-hidden">
		<div class="overflow-y-auto">
			<h2 class="h2">Bestellung {orderCounter.current}</h2>
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
			<div class="grid gap-6">
				<button class="btn preset-filled-primary-500" onclick={() => order.clearOrders()}>
					Clear
				</button>
				<button class="btn-lg preset-filled-primary-500" onclick={handleOrderNrPrint}
					>Druck Kunde</button
				>
				<button class="btn-lg preset-filled-primary-500" onclick={handlePrint}>Druck Küche</button>
			</div>
		</div>
	</aside>
</div>
