import { db } from "@/database";
import { slugify } from "@/shared/utils";
import type { CreateArticleDto } from "./article.interface";

export const createArticle = async (
	article: CreateArticleDto,
	currentUserId: string,
) => {
	return await db.article.create({
		data: {
			slug: slugify(article.title),
			title: article.title,
			description: article.description,
			body: article.body,
			authorId: currentUserId,
			tags: {
				connectOrCreate: article.tagList?.map((name) => ({
					where: { name },
					create: { name },
				})),
			},
		},
		include: {
			author: {
				include: {
					followedBy: true,
				},
			},
			tags: true,
			favoritedBy: {
				where: {
					id: currentUserId,
				},
			},
			_count: {
				select: { favoritedBy: true },
			},
		},
	});
};

/**
 * Simple list articles
 */
export const listArticles = async () => {
	const articles = await db.article.findMany({
		include: {
			author: true,
		},
	});

	// return toArticlesResponse(articles);
	return articles;
};
