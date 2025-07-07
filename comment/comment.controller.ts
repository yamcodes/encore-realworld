import { getAuthData } from "@encore/auth";
import { APIError, api } from "encore.dev/api";
import type { CommentResponse, CommentsResponse } from "./comment.interface";
import { toCommentResponse, toCommentsResponse } from "./comment.mappers";
import * as CommentService from "./comment.service";

export const listComments = api(
	{ method: "GET", path: "/articles/:slug/comments" },
	async ({ slug }: { slug: string }): Promise<CommentsResponse> => {
		const currentUserId = getAuthData()?.userID;
		const comments = await CommentService.listComments(slug, currentUserId);
		return toCommentsResponse(comments, { currentUserId });
	},
);

export const createComment = api(
	{ method: "POST", path: "/articles/:slug/comments" },
	async ({
		slug,
		body,
	}: {
		slug: string;
		body: string;
	}): Promise<CommentResponse> => {
		const currentUserId = getAuthData()?.userID;
		if (!currentUserId) throw APIError.unauthenticated("no user id");
		const createdComment = await CommentService.createComment(
			slug,
			body,
			currentUserId,
		);
		return toCommentResponse(createdComment);
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
