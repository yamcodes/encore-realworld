import type { Article, Tag, User } from "@prisma/client";

export interface ArticleResponse {
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
}

export interface ArticlesResponse {
	articles: Array<{
		slug: string;
		title: string;
		description: string;
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
	}>;
	articlesCount: number;
}

export type EnrichedArticle = Article & {
	author: User & {
		followedBy: User[];
	};
	tags: Tag[];
	favoritedBy: User[];
	_count?: {
		favoritedBy: number;
	};
};

export type CreateArticleDto = {
	title: string;
	description: string;
	body: string;
	tagList: string[];
};

export type UpdateArticleDto = Partial<CreateArticleDto>;

/**
 * Result containing the article and favorite status
 */
export type FavoriteArticleResult = {
	/**
	 * The article
	 */
	article: EnrichedArticle;
	/**
	 * Whether the article is favorited
	 */
	favorited?: boolean;
	/**
	 * The number of favorites
	 */
	favoritesCount?: number;
};

/**
 * Query parameters for listing articles
 */
export type ListArticlesQuery = {
	authorUsername?: string;
	favoritedByUsername?: string;
	tagName?: string;
	offset?: number;
	limit?: number;
};

/**
 * Query parameters for getting the feed
 */
export type FeedArticlesQuery = {
	offset?: number;
	limit?: number;
};
