import { db } from "~/database";
import { CommentNotFoundError, SelfDeleteError } from "./comment.errors";

export const listComments = async (
	articleSlug: string,
	currentUserId?: string,
) => {
	// Verify the article exists
	const article = await db.article.findFirstOrThrow({
		where: { slug: articleSlug },
	});
	return await db.comment.findMany({
		where: { articleId: article.id },
		orderBy: {
			createdAt: "desc",
		},
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
		},
	});
};

export const createComment = async (
	articleSlug: string,
	body: string,
	currentUserId: string,
) => {
	// Verify the article exists
	const article = await db.article.findFirstOrThrow({
		where: { slug: articleSlug },
	});
	return await db.comment.create({
		data: {
			body,
			article: {
				connect: {
					id: article.id,
				},
			},
			author: {
				connect: {
					id: currentUserId,
				},
			},
		},
		include: {
			author: true,
		},
	});
};

export const deleteComment = async (
	articleSlug: string,
	commentId: string,
	currentUserId: string,
): Promise<void> => {
	const article = await db.article.findFirstOrThrow({
		where: { slug: articleSlug },
	});

	// Verify comment exists and user owns it
	const existingComment = await db.comment.findFirstOrThrow({
		where: { id: commentId },
	});

	if (existingComment.articleId !== article.id) {
		throw CommentNotFoundError;
	}

	if (existingComment.authorId !== currentUserId) {
		throw SelfDeleteError;
	}

	await db.comment.delete({ where: { id: commentId } });
};
