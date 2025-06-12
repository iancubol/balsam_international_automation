import { test as base } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { HomePage } from "../pages/HomePage";
import jsonData from "./test-data/data.json";
import { ItemData } from "../types/ItemData";
import { convertJsonToType } from "../utils/Helper";

dotenv.config({ path: path.resolve(__dirname, "../env") });

type TestFixture = {
	baseURL: string;
	homePage: HomePage;
	testData: ItemData;
};

export const test = base.extend<TestFixture>({
	baseURL: async ({}, use) => {
		await use(process.env.BASE_URL);
	},
	homePage: async ({ page }, use) => {
		const homePage = new HomePage(page);
		await use(homePage);
	},
	testData: async ({}, use) => {
		if (!jsonData) {
			throw new Error("Test data file not found");
		}

		const data = convertJsonToType(jsonData);

		await use(data);
	},
});

export { expect } from "@playwright/test";
