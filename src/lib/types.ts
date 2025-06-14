export interface Item {
	id: number;
	title: string;
	price: number;
	quantity?: number; // Optional, used for cart items
}
