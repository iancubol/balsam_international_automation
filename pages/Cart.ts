import { Locator, Page, expect } from "playwright/test";

export class Cart {
	private _page: Page;

	// Locator
	private readonly itemRow: (itemName: string) => Locator;
	private readonly cartItemCount: Locator;
	private readonly itemRemovalMessage: (itemName: string) => Locator;
	constructor(page: Page) {
		this._page = page;
		this.itemRow = (itemName: string) =>
			this._page
				.locator("div")
				.filter({ has: this._page.getByText(itemName) })
				.filter({
					has: this._page.locator('[class^="cartProductDetailItem_new_price__"]'),
				});
		this.cartItemCount = this._page.getByRole("link", { name: /Cart \d+ items/ });
		this.itemRemovalMessage = (itemName: string) =>
			this._page.locator("a").filter({ hasText: `${itemName} has been removed.` });
	}

	async getItemPrice(itemName: string): Promise<string> {
		const actualItemPrice = await this.itemRow(itemName)
			.locator('[class^="cartProductDetailItem_new_price__"]')
			.getByLabel("$")
			.textContent();
		if (!actualItemPrice) {
			throw new Error(`Item price not found for item: ${itemName}`);
		}
		console.info("Cart Item Price: ", actualItemPrice);
		return actualItemPrice;
	}

	async getCartItemCount(): Promise<string> {
		const cartItemCount = await this.cartItemCount.textContent();
		if (!cartItemCount) {
			throw new Error("Cart item count not found");
		}
		console.info("Cart Item Count: ", cartItemCount);
		return cartItemCount;
	}

	async removeItemFromCart(itemName: string) {
		const btnRemove = this.itemRow(itemName).getByTestId(/cc-btn-remove-\d+/);
		if (!btnRemove) {
			throw new Error(`Remove button not found for item: ${itemName}`);
		}
		await btnRemove.click();
		console.info(`Removing ${itemName} from cart...`);
	}

	async validateItemIsRemovedSuccessfully(itemName: string) {
		await expect(
			this.itemRemovalMessage(itemName),
			`${itemName} was not removed from the cart.`
		).toBeVisible();

		console.info(`${itemName} has been removed from the cart.`);
	}
}
