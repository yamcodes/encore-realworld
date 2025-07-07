import { db } from "~/database";

export const listTags = async (): Promise<string[]> => {
	const allTags = await db.tag.findMany();
	return allTags.map((tag) => tag.name);
};
