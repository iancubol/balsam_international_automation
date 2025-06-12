import { Page } from "@playwright/test";
import { ItemProperty } from "../types/ItemProperty";
import { ItemData } from "../types/ItemData";

export async function closeUnexpectedPopups(page: Page) {
	page.on("popup", async (popup) => {
		console.log("Closing unexpected pop-up...");
		await popup.close();
	});

	const popUp = page.getByTestId("zineone-widget");
	if (await popUp.isVisible()) {
		await popUp.getByLabel("close icon").click();
	}
}

export const convertJsonToType = (jsonData: any): ItemData => {
	return jsonData as ItemData;
};
