import { getAuthData } from "@encore/auth";
import { APIError, api } from "encore.dev/api";
import type { ProfileResponse } from "./profile.interface";
import { toResponse } from "./profile.mappers";
import * as ProfileService from "./profile.service";

export const getProfile = api(
	{ method: "GET", path: "/profiles/:username", auth: true },
	async ({ username }: { username: string }): Promise<ProfileResponse> => {
		const { profile, following } = await ProfileService.getProfile(
			username,
			getAuthData()?.userID,
		);
		return toResponse(profile, following);
	},
);

export const follow = api(
	{ method: "POST", path: "/profiles/:username/follow", auth: true },
	async ({ username }: { username: string }): Promise<ProfileResponse> => {
		const currentUserId = getAuthData()?.userID;
		if (!currentUserId) throw APIError.unauthenticated("no user id");
		const { profile, following } = await ProfileService.follow(
			username,
			currentUserId,
		);
		return toResponse(profile, following);
	},
);

export const unfollow = api(
	{ method: "DELETE", path: "/profiles/:username/follow", auth: true },
	async ({ username }: { username: string }): Promise<ProfileResponse> => {
		const currentUserId = getAuthData()?.userID;
		if (!currentUserId) throw APIError.unauthenticated("no user id");
		const { profile, following } = await ProfileService.unfollow(
			username,
			currentUserId,
		);
		return toResponse(profile, following);
	},
);
