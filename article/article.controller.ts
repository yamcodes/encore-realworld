import { APIError, api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type {
	ArticleResponse,
	ArticlesResponse,
	CreateArticleDto,
	FeedArticlesQuery,
	ListArticlesQuery,
	UpdateArticleDto,
} from "./article.interface";
import { toArticlesResponse, toResponse } from "./article.mappers";
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

export const updateArticle = api(
	{ method: "PUT", path: "/articles/:slug", auth: true },
	async ({
		slug,
		data,
	}: {
		slug: string;
		data: UpdateArticleDto;
	}): Promise<ArticleResponse> => {
		const currentUserId = getAuthData()?.userID;
		if (!currentUserId) throw APIError.unauthenticated("no user id");
		const updatedArticle = await ArticleService.updateArticle(
			slug,
			data,
			currentUserId,
		);
		return toResponse(updatedArticle, { currentUserId });
	},
);

export const deleteArticle = api(
	{ method: "DELETE", path: "/articles/:slug", auth: true },
	async ({ slug }: { slug: string }): Promise<void> => {
		const currentUserId = getAuthData()?.userID;
		if (!currentUserId) throw APIError.unauthenticated("no user id");
		await ArticleService.deleteArticle(slug, currentUserId);
	},
);

/**
 * Returns most recent articles globally by default, provide tag, author or favorited query parameter to filter results
 */
export const listArticles = api(
	{ method: "GET", path: "/articles" },
	async (query: ListArticlesQuery): Promise<ArticlesResponse> => {
		const currentUserId = getAuthData()?.userID;
		const enrichedArticles = await ArticleService.listArticles(
			query,
			currentUserId,
		);
		return toArticlesResponse(enrichedArticles, { currentUserId });
	},
);

/**
 * Get an article by slug
 */
export const getArticle = api(
	{ method: "GET", path: "/articles/:slug" },
	async ({ slug }: { slug: string }): Promise<ArticleResponse> => {
		const currentUserId = getAuthData()?.userID;
		const article = await ArticleService.getArticle(slug, currentUserId);
		return toResponse(article, { currentUserId });
	},
);

export const feedArticles = api(
	{ method: "GET", path: "/articles/feed", auth: true },
	async (query: FeedArticlesQuery): Promise<ArticlesResponse> => {
		const currentUserId = getAuthData()?.userID;
		if (!currentUserId) throw APIError.unauthenticated("no user id");
		const enrichedArticles = await ArticleService.feedArticles(
			query,
			currentUserId,
		);
		return toArticlesResponse(enrichedArticles, { currentUserId });
	},
);

export const favoriteArticle = api(
	{ method: "POST", path: "/articles/:slug/favorite", auth: true },
	async ({ slug }: { slug: string }): Promise<ArticleResponse> => {
		const currentUserId = getAuthData()?.userID;
		if (!currentUserId) throw APIError.unauthenticated("no user id");
		const { article, favorited, favoritesCount } =
			await ArticleService.favoriteArticle(slug, currentUserId);
		return toResponse(article, {
			currentUserId,
			favorited,
			favoritesCount,
		});
	},
);

export const unfavoriteArticle = api(
	{ method: "DELETE", path: "/articles/:slug/favorite", auth: true },
	async ({ slug }: { slug: string }): Promise<ArticleResponse> => {
		const currentUserId = getAuthData()?.userID;
		if (!currentUserId) throw APIError.unauthenticated("no user id");
		const { article, favorited, favoritesCount } =
			await ArticleService.unfavoriteArticle(slug, currentUserId);
		return toResponse(article, { currentUserId, favorited, favoritesCount });
	},
);
