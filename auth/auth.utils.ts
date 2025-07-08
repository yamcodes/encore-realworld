import type { Header } from "encore.dev/api";
import { APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";
import * as jose from "jose";
import type { JwtPayload } from "~/shared/types";
import { getAuthData } from "~encore/auth";
import { name } from "../package.json";
import { InvalidTokenError, NoUserIdError } from "./auth.errors";

const jwtSecret = secret("JWT_SECRET");

export const verifyToken = async (token: string) => {
	const secret = new TextEncoder().encode(jwtSecret());

	try {
		const { payload } = await jose.jwtVerify(token, secret, {
			audience: name,
		});
		return payload as JwtPayload;
	} catch {
		throw InvalidTokenError;
	}
};

/**
 * Get a "<token>" from a "Token <token>" header
 */
export const getToken = (
	authorization: Header<"Authorization">,
): string | undefined => {
	const [, token] = authorization.split(" ");
	return token;
};

/**
 * Get the current user id or undefined if no user id is found
 * @returns the current user id or undefined if no user id is found
 */
export const getCurrentUserId = () => {
	const id = getAuthData()?.userID;
	return id;
};

/**
 * Get the current user id or throw an error if no user id is found
 * @returns the current user id
 * @throws an error if no user id is found, see {@link APIError.unauthenticated}
 */
export const getCurrentUserIdOrThrow = () => {
	const id = getCurrentUserId();
	if (!id) throw NoUserIdError;
	return id;
};
