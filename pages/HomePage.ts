import { Locator, Page, expect } from "@playwright/test";
import { SearchResults } from "./SearchResults";

export class HomePage {
	private _page: Page;

	//Locators
	private readonly btnCookieBannerClose: Locator;
	private readonly inputSearch: Locator;
	private readonly btnSearchSubmit: Locator;

	constructor(page: Page) {
		this._page = page;
		this.btnCookieBannerClose = this._page.getByTestId("close-cookie-banner");
		this.inputSearch = this._page.getByTestId("constructor-search-input");
		this.btnSearchSubmit = this._page.getByTestId("constructor-search-submit");
	}

	async goto(url: string) {
		await this._page.goto(url);
		console.info(`Navigated to ${url}`);
	}

	async validateHomePageTitle() {
		await expect(this._page, "Home page title did not appear").toHaveTitle(
			"Artificial Christmas Trees, Christmas Ornaments & Spring Décor | Balsam Hill"
		);
		console.info("Home page title validated successfully.");
	}

	async closeCookieBanner() {
		await this.btnCookieBannerClose.click();
		console.info("Cookie banner closed successfully.");
	}

	async searchForProduct(searchItem: string): Promise<SearchResults> {
		await this.inputSearch.fill(searchItem);
		await this.btnSearchSubmit.click();
		await this._page.getByTestId("results-grid").isVisible();
		console.info(`Searched for product: ${searchItem}`);
		return new SearchResults(this._page);
	}
}
