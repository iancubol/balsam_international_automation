import { Locator, Page } from "playwright/test";
import { ItemProperty } from "../types/ItemProperty";
import { CartPrompt } from "./CartPrompt";

export class Product {
	private _page: Page;

	//Locators
	private readonly radBtnHeight: (height: string) => Locator;
	private readonly radBtnCustom1: (custom1: string) => Locator;
	private readonly btnAddToCart: Locator;

	constructor(page: Page) {
		this._page = page;
		this.radBtnHeight = function (height: string): Locator {
			return this._page.getByRole("radio", { name: `Height ${height}′ ft` });
		};
		this.radBtnCustom1 = function (custom1: string): Locator {
			return this._page.getByTestId(`div-pdgf-div-${custom1}-1`);
		};
		this.btnAddToCart = this._page
			.getByTestId("produt-detail-container")
			.getByTestId("pdc-btn-addtocart");
	}

	async modifyProduct(itemProperty: ItemProperty) {
		const height = this.radBtnHeight(itemProperty["itemHeight"].toString());
		if (await height.isVisible()) {
			await height.click();
		} else {
			throw new Error(`Height option ${itemProperty["itemHeight"]} is not available.`);
		}
		console.info(`Selected height: ${itemProperty["itemHeight"]}′ ft`);
	}

	async getItemPrice(): Promise<string> {
		const itemPrice = await this._page
			.getByTestId("produt-detail-container")
			.getByLabel("$")
			.textContent();
		if (!itemPrice) {
			throw new Error("Item price not found");
		}
		console.info("Item Price: ", itemPrice);
		return itemPrice;
	}

	async addToCart(): Promise<CartPrompt> {
		await this.btnAddToCart.click();
		console.info("Item added to cart");
		return new CartPrompt(this._page);
	}
}
