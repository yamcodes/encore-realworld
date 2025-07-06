import { api } from "encore.dev/api";
import type { CreateArticleDto } from "./article.interface";
import * as ArticleService from "./articles.service";

export const createArticle = api(
	{ method: "POST", path: "/articles" },
	async (data: CreateArticleDto) => {
		const currentUserId = "123"; // TODO: get current user id from request
		return ArticleService.createArticle(data, currentUserId);
	},
);
