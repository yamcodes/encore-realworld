import { api } from "encore.dev/api";
import * as TagService from "./tag.service";

export const listTags = api(
	{ method: "GET", path: "/tags" },
	async (): Promise<string[]> => {
		return await TagService.listTags();
	},
);
