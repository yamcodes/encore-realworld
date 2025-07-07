// See https://encore.dev/docs/ts/develop/auth

import { APIError, Gateway, type Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import log from "encore.dev/log";
import { verifyToken } from "@/shared/utils";

/**
 * Specify the incoming request information
 * the auth handler is interested in. In this case it only
 * cares about requests that contain the `Authorization` header.
 */
interface AuthParams {
	authorization: Header<"Authorization">;
}

/**
 * Specify the information about the authenticated user
 * that the auth handler makes available.
 */
interface AuthData {
	userID: string;
}

/**
 * Get a "<token>" from a "Token <token>" header
 */
const getToken = (
	authorization: Header<"Authorization">,
): string | undefined => {
	const [, token] = authorization.split(" ");
	return token;
};

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
