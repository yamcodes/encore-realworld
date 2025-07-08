import type { Header } from "encore.dev/api";
import { APIError } from "encore.dev/api";
import * as jose from "jose";
import type { JwtPayload } from "~/shared/types";
import { getAuthData } from "~encore/auth";

export const verifyToken = async (token: string) => {
	const name = "encore-realworld"; // TODO: get this from package.json or an env variable
	// TODO: use `import { secret } from "encore.dev/config"`
	const rawSecret = "my-secret"; // TODO: change to env.JWT_SECRET
	const secret = new TextEncoder().encode(rawSecret);

	try {
		const { payload } = await jose.jwtVerify(token, secret, {
			audience: name,
		});
		return payload as JwtPayload;
	} catch {
		throw new Error("Invalid token");
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
	if (!id) throw APIError.unauthenticated("no user id");
	return id;
};
