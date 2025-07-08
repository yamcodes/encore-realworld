import { api } from "encore.dev/api";
import { getCurrentUserId, getCurrentUserIdOrThrow } from "~/auth";
import type { ProfileResponse } from "./profile.interface";
import { toResponse } from "./profile.mappers";
import * as ProfileService from "./profile.service";

export const getProfile = api(
	{ method: "GET", path: "/profiles/:username" },
	async ({ username }: { username: string }): Promise<ProfileResponse> => {
		const { profile, following } = await ProfileService.getProfile(
			username,
			getCurrentUserId(),
		);
		return toResponse(profile, following);
	},
);

export const follow = api(
	{ method: "POST", path: "/profiles/:username/follow", auth: true },
	async ({ username }: { username: string }): Promise<ProfileResponse> => {
		const currentUserId = getCurrentUserIdOrThrow();
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
		const currentUserId = getCurrentUserIdOrThrow();
		const { profile, following } = await ProfileService.unfollow(
			username,
			currentUserId,
		);
		return toResponse(profile, following);
	},
);
