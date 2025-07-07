import argon2 from "argon2";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { nanoid } from "nanoid";

export function slugify(...parts: string[]): string {
	const baseSlug = parts
		.join("-")
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.trim();

	const suffix = nanoid(8);
	return `${baseSlug}-${suffix}`;
}

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

interface JwtPayload extends jose.JWTPayload {
	uid: string;
	email: string;
	username: string;
}

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
