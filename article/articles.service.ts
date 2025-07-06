import { db } from "@/database";
import { slugify } from "@/shared/utils";
import type { CreateArticleDto } from "./article.interface";
import { toResponse } from "./article.mappers";

export const createArticle = async (
	article: CreateArticleDto,
	currentUserId: string,
) => {
	const createdArticle = await db.article.create({
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

	return toResponse(createdArticle, {
		currentUserId,
	});
};
