import { test, expect } from "../tests/testFixture";
import { closeUnexpectedPopups } from "../utils/Helper";

test("remove item on cart", async ({ page, baseURL, homePage, testData }) => {
	// Go to https://www.balsamhill.com/
	await homePage.goto(baseURL);

	await homePage.validateHomePageTitle();
	await homePage.closeCookieBanner();

	await closeUnexpectedPopups(page);

	// Search for 'Christmas Tree' using the search bar.
	const itemToSearch = testData.searchItem.itemName;
	const searchResults = await homePage.searchForProduct(itemToSearch);

	// Select the third result that appears on the results page. (Check data.json for itemNumber)
	const itemNumber = testData.selectItem.itemNumber;
	const product = await searchResults.selectItemFromResults(itemNumber);

	// On the product selection page, choose any available customization options. (Check data.json for height)
	await product.modifyProduct(testData.selectItem);

	const itemPrice = await product.getItemPrice();

	// Click Add to Cart.
	const cartPrompt = await product.addToCart();

	closeUnexpectedPopups(page);

	const itemName = await cartPrompt.getCartPromptItemName();

	// Click View Cart.
	const cart = await cartPrompt.viewCart();

	closeUnexpectedPopups(page);

	const cartItemPrice = await cart.getItemPrice(itemName);

	// Validate that the price displayed on the results page is the same on the product page and the cart page.
	expect(cartItemPrice, "Item price in cart does not match").toBe(itemPrice);

	const cartItemCount = await cart.getCartItemCount();

	// Validate that the Cart icon shows the number 1, indicating an item has been added.
	expect(cartItemCount, "Cart item count does not match").toContain("1");

	// Click the trash can icon to remove the item from the cart.
	await cart.removeItemFromCart(itemName);

	closeUnexpectedPopups(page);

	// Validate the removal confirmation dialog that states '<Item> has been removed'.
	await cart.validateItemIsRemovedSuccessfully(itemName);

	// Close the webpage. (handled by Playwright's test teardown)
});
