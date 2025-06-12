import { Locator, Page } from "playwright/test";
import { Cart } from "./Cart";

export class CartPrompt {
	private _page: Page;

	private readonly itemNameLocator: Locator;
	private readonly btnViewCart: Locator;
	constructor(page: Page) {
		this._page = page;
		this.itemNameLocator = this._page.locator(
			'div[class*="productAddToCartModal_content-wrapper_"] div[class*="productAddToCartModal_title_"] span'
		);
		this.btnViewCart = this._page.getByTestId("pdc-add-to-cart-modal-btn-viewcart");
	}

	async getCartPromptItemName(): Promise<string> {
		const itemName = await this.itemNameLocator.first().innerText();
		if (!itemName) {
			throw new Error("Item name not found");
		}
		console.info("Item Name: ", itemName);
		return itemName;
	}

	async viewCart(): Promise<Cart> {
		await this.btnViewCart.click();
		console.info("Navigating to cart...");
		return new Cart(this._page);
	}
}
