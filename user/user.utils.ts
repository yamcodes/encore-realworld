import * as argon2 from "argon2";
import * as bcrypt from "bcrypt";
import { secret } from "encore.dev/config";
import * as jose from "jose";
import type { JwtPayload } from "~/shared/types";
import { name } from "../package.json";

const jwtSecret = secret("JWT_SECRET");

export const hashPassword = async (password: string) => {
	const isDevelopment = process.env.NODE_ENV === "development";
	return isDevelopment
		? await bcrypt.hash(password, 10)
		: await argon2.hash(password);
};

export const verifyPassword = async (password: string, hash: string) => {
	const isDevelopment = process.env.NODE_ENV === "development";
	return isDevelopment
		? await bcrypt.compare(password, hash)
		: await argon2.verify(hash, password);
};

export const signToken = async (payload: JwtPayload) => {
	const secret = new TextEncoder().encode(jwtSecret());

	return await new jose.SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime("24h")
		.setAudience(name)
		.setIssuedAt()
		.sign(secret);
};
