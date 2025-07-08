import log from "encore.dev/log";
import { db } from "~/database";
import { SelfDeleteError, SelfUpdateError } from "./article.errors";
import type {
	CreateArticleDto,
	FavoriteArticleResult,
	FeedArticlesQuery,
	ListArticlesQuery,
	UpdateArticleDto,
} from "./article.interface";
import { slugify } from "./article.utils";

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
 * Update an article
 * @param slug - The slug of the article
 * @param article - The article to update
 * @param currentUserId - The ID of the current user
 * @returns The updated article
 */
export const updateArticle = async (
	slug: string,
	article: UpdateArticleDto,
	currentUserId: string,
) => {
	const existingArticle = await db.article.findFirstOrThrow({
		where: { slug },
	});

	if (existingArticle.authorId !== currentUserId) {
		throw SelfUpdateError;
	}

	const newSlug =
		article.title && article.title !== existingArticle.title
			? slugify(article.title)
			: existingArticle.slug;

	return await db.article.update({
		where: { id: existingArticle.id },
		data: {
			...article,
			slug: newSlug,
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
 * Delete an article
 * @param slug - The slug of the article
 * @param currentUserId - The ID of the current user
 */
export const deleteArticle = async (slug: string, currentUserId: string) => {
	const existingArticle = await db.article.findFirstOrThrow({
		where: { slug },
	});

	if (existingArticle.authorId !== currentUserId) {
		log.debug("test", {
			existingArticle,
			currentUserId,
		});
		throw SelfDeleteError;
	}

	await db.article.delete({
		where: { id: existingArticle.id },
	});
};

/**
 * List articles
 * @param query - The query parameters, see {@link ListArticlesQuery}
 * @param currentUserId - (Optional) The ID of the current user
 * @returns The articles
 */
export const listArticles = async (
	{
		author: authorUsername,
		favorited: favoritedByUsername,
		tag: tagName,
		offset,
		limit,
	}: ListArticlesQuery,
	currentUserId?: string,
) => {
	return await db.article.findMany({
		where: {
			...(authorUsername && {
				author: {
					username: authorUsername,
				},
			}),
			...(favoritedByUsername && {
				favoritedBy: {
					some: {
						username: favoritedByUsername,
					},
				},
			}),
			...(tagName && {
				tags: {
					some: {
						name: tagName,
					},
				},
			}),
		},
		orderBy: {
			createdAt: "desc",
		},
		skip: offset,
		take: limit,
		include: {
			author: {
				include: {
					followedBy: {
						where: {
							id: currentUserId,
						},
					},
				},
			},
			tags: true,
			favoritedBy: {
				where: {
					id: currentUserId,
				},
			},
		},
	});
};

/**
 * Get an article by slug
 * @param slug - The slug of the article
 * @param currentUserId - (Optional) The ID of the current user
 * @returns The article
 */
export const getArticle = async (slug: string, currentUserId?: string) => {
	return await db.article.findFirstOrThrow({
		where: { slug },
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
 * Get the feed for the current user
 * @param query - The query parameters, see {@link FeedArticlesQuery}
 * @param currentUserId - The ID of the current user
 * @returns The articles
 */
export const feedArticles = async (
	{ offset, limit }: FeedArticlesQuery,
	currentUserId: string,
) => {
	return await db.article.findMany({
		where: {
			author: {
				followedBy: {
					some: {
						id: currentUserId,
					},
				},
			},
		},
		orderBy: { createdAt: "desc" },
		skip: offset,
		take: limit,
		include: {
			author: {
				include: {
					followedBy: {
						where: {
							id: currentUserId,
						},
					},
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
 * Favorite an article
 * @param slug - The slug of the article
 * @param currentUserId - The ID of the current user
 * @returns Result containing the article and favorite status, see {@link FavoriteArticleResult}
 */
export const favoriteArticle = async (
	slug: string,
	currentUserId: string,
): Promise<FavoriteArticleResult> => {
	return await db.$transaction(async (tx) => {
		// 1. Get the article
		const article = await tx.article.findFirstOrThrow({
			where: { slug },
			include: {
				author: {
					include: {
						followedBy: {
							where: { id: currentUserId },
						},
					},
				},
				tags: true,
				favoritedBy: {
					where: { id: currentUserId },
				},
				_count: {
					select: { favoritedBy: true },
				},
			},
		});

		// 2. Check if already favorited
		if (article.favoritedBy.length > 0) {
			return { article };
		}

		// 3. Create the favorite
		await tx.user.update({
			where: { id: currentUserId },
			data: {
				favorites: {
					connect: {
						id: article.id,
					},
				},
			},
		});

		// 4. Return with updated counts
		return {
			article,
			favorited: true,
			favoritesCount: article._count.favoritedBy + 1,
		};
	});
};

/**
 * Unfavorite an article
 * @param slug - The slug of the article
 * @param currentUserId - The ID of the current user
 * @returns Result containing the article and favorite status, see {@link FavoriteArticleResult}
 */
export const unfavoriteArticle = async (
	slug: string,
	currentUserId: string,
): Promise<FavoriteArticleResult> => {
	return await db.$transaction(async (tx) => {
		// 1. Get the article
		const article = await tx.article.findFirstOrThrow({
			where: { slug },
			include: {
				author: {
					include: {
						followedBy: {
							where: { id: currentUserId },
						},
					},
				},
				tags: true,
				favoritedBy: {
					where: { id: currentUserId },
				},
				_count: {
					select: { favoritedBy: true },
				},
			},
		});

		// 2. Check if not favorited
		if (article.favoritedBy.length === 0) {
			return { article };
		}

		// 3. Delete the favorite
		await tx.user.update({
			where: { id: currentUserId },
			data: {
				favorites: {
					disconnect: {
						id: article.id,
					},
				},
			},
		});

		// 4. Return with updated counts
		return {
			article,
			favorited: false,
			favoritesCount: article._count.favoritedBy - 1,
		};
	});
};
