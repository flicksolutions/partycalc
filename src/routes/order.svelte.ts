import type { Item } from '$lib/types';

class Order {
	orders: Item[] = $state<Item[]>([]);
	constructor() {
		this.orders = [];
	}

	addOrder(order: Item) {
		// Check if the order already exists
		const existingOrder = this.orders.find((o) => o.id === order.id);
		if (existingOrder) {
			// If it exists, increase the quantity
			existingOrder.quantity = (existingOrder.quantity || 1) + 1;
		} else {
			// If it doesn't exist, add it to the orders
			this.orders.push({ ...order, quantity: 1 });
		}
	}

	get list() {
		return this.orders;
	}

	get sum() {
		return this.orders.reduce((sum, order) => {
			return sum + order.price * (order.quantity || 1);
		}, 0);
	}

	reduceOrder(orderId: number) {
		const existingOrder = this.orders.find((o) => o.id === orderId);
		if (existingOrder) {
			// If the order exists, decrease the quantity
			if (existingOrder.quantity && existingOrder.quantity > 1) {
				existingOrder.quantity -= 1;
			} else {
				// If quantity is 1 or undefined, remove the order
				this.orders = this.orders.filter((o) => o.id !== orderId);
			}
		}
	}

	clearOrders() {
		this.orders = [];
	}
}

export const order = new Order();
