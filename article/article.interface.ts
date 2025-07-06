import type { Article, Tag, User } from "@prisma/client";

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
