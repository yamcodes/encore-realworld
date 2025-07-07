import type { Header } from "encore.dev/api";
import * as jose from "jose";
import type { JwtPayload } from "@/shared/types";

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
