import type { Header } from "encore.dev/api";

/**
 * Specify the incoming request information
 * the auth handler is interested in. In this case it only
 * cares about requests that contain the `Authorization` header.
 */
export interface AuthParams {
	authorization: Header<"Authorization">;
}

/**
 * Specify the information about the authenticated user
 * that the auth handler makes available.
 */
export interface AuthData {
	userID: string;
}
