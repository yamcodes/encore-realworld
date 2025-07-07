import * as argon2 from "argon2";
import * as bcrypt from "bcrypt";
import * as jose from "jose";
import type { JwtPayload } from "@/shared/types";

export const hashPassword = async (password: string) => {
	const isDevelopment = true; // TODO: change to env.NODE_ENV === "development"
	return isDevelopment
		? await bcrypt.hash(password, 10)
		: await argon2.hash(password);
};

export const verifyPassword = async (password: string, hash: string) => {
	const isDevelopment = true; // TODO: change to env.NODE_ENV === "development"
	return isDevelopment
		? await bcrypt.compare(password, hash)
		: await argon2.verify(hash, password);
};

export const signToken = async (payload: JwtPayload) => {
	const name = "encore-realworld"; // TODO: get this from package.json or an env variable
	const rawSecret = "my-secret"; // TODO: change to env.JWT_SECRET
	const secret = new TextEncoder().encode(rawSecret);

	return await new jose.SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime("24h")
		.setAudience(name)
		.setIssuedAt()
		.sign(secret);
};
