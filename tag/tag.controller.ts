import { api } from "encore.dev/api";
import type { TagsResponse } from "./tag.interface";
import * as TagService from "./tag.service";

export const listTags = api(
	{ method: "GET", path: "/tags" },
	async (): Promise<TagsResponse> => {
		const tags = await TagService.listTags();
		return { tags };
	},
);
