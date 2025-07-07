// See https://encore.dev/docs/ts/develop/auth

import { APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import log from "encore.dev/log";
import { getToken, verifyToken } from "@/auth/auth.utils";
import type { AuthData, AuthParams } from "./auth.interface";

/**
 * Auth handler
 */
export const auth = authHandler<AuthParams, AuthData>(async (params) => {
	try {
		const token = getToken(params.authorization);
		if (!token) throw APIError.unauthenticated("no token provided");
		const decoded = await verifyToken(token);
		return { userID: decoded.uid };
	} catch (e) {
		log.error(e);
		throw APIError.unauthenticated("invalid token", e as Error);
	}
});

/**
 * API Gateway to execute the auth handler
 */
export const gateway = new Gateway({
	authHandler: auth,
});
