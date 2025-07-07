import { db } from "@/database";

export const getProfile = async (username: string) => {
	const profile = await db.user.findUnique({
		where: {
			username,
		},
	});
};
