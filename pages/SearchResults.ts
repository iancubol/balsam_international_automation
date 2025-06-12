import { Page } from "playwright/test";
import { Product } from "./Product";

export class SearchResults {
	private _page: Page;
	constructor(page: Page) {
		this._page = page;
	}

	async selectItemFromResults(itemNumber: number): Promise<Product> {
		itemNumber--;
		await this._page.getByTestId("undefined-wrp-undefinedsku").nth(itemNumber).click();
		await this._page.waitForSelector("div.page-content.produt-detail-content", {
			state: "visible",
		});
		return new Product(this._page);
	}
}
