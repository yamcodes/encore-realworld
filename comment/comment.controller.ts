import { getAuthData } from "@encore/auth";
import type { Comment } from "@prisma/client";
import { APIError, api } from "encore.dev/api";
import * as CommentService from "./comment.service";

export const listComments = api(
	{ method: "GET", path: "/articles/:slug/comments" },
	async ({ slug }: { slug: string }): Promise<Comment[]> => {
		return await CommentService.listComments(slug);
	},
);

export const createComment = api(
	{ method: "POST", path: "/articles/:slug/comments" },
	async ({ slug, body }: { slug: string; body: string }): Promise<Comment> => {
		const currentUserId = getAuthData()?.userID;
		if (!currentUserId) throw APIError.unauthenticated("no user id");
		return await CommentService.createComment(slug, body, currentUserId);
	},
);

export const deleteComment = api(
	{ method: "DELETE", path: "/articles/:slug/comments/:id" },
	async ({ slug, id }: { slug: string; id: string }): Promise<void> => {
		const currentUserId = getAuthData()?.userID;
		if (!currentUserId) throw APIError.unauthenticated("no user id");
		return await CommentService.deleteComment(slug, id, currentUserId);
	},
);
