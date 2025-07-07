import * as argon2 from "argon2";
import * as bcrypt from "bcrypt";

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
