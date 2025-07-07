import { getAuthData } from "@encore/auth";
import { APIError, api } from "encore.dev/api";
import log from "encore.dev/log";
import type { ArticleResponse, CreateArticleDto } from "./article.interface";
import { toResponse } from "./article.mappers";
import * as ArticleService from "./article.service";

export const createArticle = api(
	{ method: "POST", path: "/articles", auth: true },
	async (data: CreateArticleDto): Promise<ArticleResponse> => {
		const currentUserId = getAuthData()?.userID;
		if (!currentUserId) throw APIError.unauthenticated("no user id");
		const createdArticle = await ArticleService.createArticle(
			data,
			currentUserId,
		);
		return toResponse(createdArticle, {
			currentUserId,
		});
	},
);

export const listArticles = api(
	{ method: "GET", path: "/articles" },
	async (): Promise<{
		articles: {
			id: string;
			slug: string;
			title: string;
			description: string;
			body: string;
		}[];
	}> => {
		log.info("listArticles");
		const articles = await ArticleService.listArticles();
		return {
			articles,
		};
	},
);
