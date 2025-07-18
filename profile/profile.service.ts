import type { User } from "@prisma/client";
import { db } from "~/database";
import { SelfFollowError, SelfUnfollowError } from "./profile.errors";

export const getProfile = async (
	username: string,
	currentUserId?: string,
): Promise<{
	profile: User;
	following: boolean;
}> => {
	const profile = await db.user.findFirstOrThrow({
		where: { username },
	});
	const [{ exists: following } = { exists: false }] = await db.$queryRaw<
		{ exists: boolean }[]
	>`
  SELECT EXISTS (
    SELECT 1
    FROM "_UserFollows"
    WHERE "A" = ${currentUserId} AND "B" = ${profile.id}
  ) AS "exists"
`;
	return { profile, following };
};

export const follow = async (username: string, currentUserId: string) => {
	const profile = await db.user.findFirstOrThrow({
		where: { username },
	});
	// TODO: Make this a db constraint
	if (profile.id === currentUserId) throw SelfFollowError;
	await db.user.update({
		where: { id: currentUserId },
		data: { following: { connect: { id: profile.id } } },
	});
	return { profile, following: true };
};

export const unfollow = async (username: string, currentUserId: string) => {
	const profile = await db.user.findFirstOrThrow({
		where: { username },
	});
	// TODO: Make this a db constraint
	if (profile.id === currentUserId) throw SelfUnfollowError;
	await db.user.update({
		where: { id: currentUserId },
		data: { following: { disconnect: { id: profile.id } } },
	});
	return { profile, following: false };
};
