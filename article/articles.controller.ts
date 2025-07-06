import { APIError, api } from "encore.dev/api";

export const createArticle = api(
	{
		method: "POST",
		path: "/articles",
	},
	async (req) => {
		const { title, content } = req.body;
	},
);
