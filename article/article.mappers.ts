import type { ArticlesResponse, EnrichedArticle } from "./article.interface";

/**
 * Parameters for the toResponse function
 */
type ToResponseParams = {
	/**
	 * The current user's ID. If provided, the article will be mapped to the current user's perspective.
	 */
	currentUserId?: string;
	/**
	 * The favorited status for the current user. If provided, the article will be mapped to the current user's perspective.
	 */
	favorited?: boolean;
	/**
	 * The favorites count for the current user. If provided, the article will be mapped to the current user's perspective.
	 */
	favoritesCount?: number;
};

/**
 * Map an article to a response
 * @param article The article to map
 * @param params The parameters to map the article
 * @returns The mapped article
 */
export function toResponse(
	article: EnrichedArticle,
	{
		currentUserId,
		favorited: favoritedParam,
		favoritesCount: favoritesCountParam,
	}: ToResponseParams = {},
): {
	article: {
		slug: string;
		title: string;
		description: string;
		body: string;
		tagList: string[];
		createdAt: string;
		updatedAt: string;
		favorited: boolean;
		favoritesCount: number;
		author: {
			username: string;
			bio: string | null;
			image: string | null;
			following: boolean;
		};
	};
} {
	const favorited =
		favoritedParam ?? article.favoritedBy?.some((f) => f.id === currentUserId);
	const favoritesCount =
		favoritesCountParam ??
		article._count?.favoritedBy ??
		article.favoritedBy.length;
	const following = article.author.followedBy?.some(
		(f) => f.id === currentUserId,
	);

	return {
		article: {
			slug: article.slug,
			title: article.title,
			description: article.description,
			body: article.body,
			tagList: article.tags
				.map((t) => t.name)
				.sort((a, b) => a.localeCompare(b)),
			createdAt: article.createdAt.toISOString(),
			updatedAt: article.updatedAt.toISOString(),
			favorited: favorited ?? false,
			favoritesCount: favoritesCount ?? 0,
			author: {
				username: article.author.username,
				bio: article.author.bio,
				image: article.author.image,
				following: following ?? false,
			},
		},
	};
}

/**
 * Parameters for the toArticlesResponse function
 */
type ToArticlesResponseParams = {
	/**
	 * The current user's ID. If provided, the articles will be mapped to the current user's perspective.
	 */
	currentUserId?: string;
};

/**
 * Map an array of articles to a response
 * @param enrichedArticles The articles to map, each article is enriched with the user's favorites, follow status, and favorites count
 * @param params The parameters to map the articles to the current user's perspective. See {@link ToArticlesResponseParams}
 * @returns The mapped articles
 */
export function toArticlesResponse(
	enrichedArticles: EnrichedArticle[],
	{ currentUserId }: ToArticlesResponseParams = {},
): ArticlesResponse {
	const myArticles = enrichedArticles.map((article) => {
		const myFavorites =
			article.favoritedBy?.filter((f) => f.id === currentUserId) ?? [];
		const myFollows =
			article.author.followedBy?.filter((f) => f.id === currentUserId) ?? [];
		const favoritesCount =
			article._count?.favoritedBy ?? article.favoritedBy.length;
		const isFavorited = myFavorites.length > 0;
		const isFollowing = myFollows.length > 0;
		return {
			slug: article.slug,
			title: article.title,
			description: article.description,
			tagList: article.tags
				.map((t) => t.name)
				.sort((a, b) => a.localeCompare(b)),
			createdAt: article.createdAt.toISOString(),
			updatedAt: article.updatedAt.toISOString(),
			favorited: isFavorited,
			favoritesCount,
			author: {
				username: article.author.username,
				bio: article.author.bio,
				image: article.author.image,
				following: isFollowing,
			},
		};
	});

	return {
		articlesCount: enrichedArticles.length,
		articles: myArticles,
	};
}
