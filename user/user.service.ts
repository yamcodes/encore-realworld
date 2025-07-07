import type { User } from "@prisma/client";
import { db } from "@/database";
import { assertNoConflicts } from "@/shared/errors";
import type {
	CreateUserDto,
	LoginUserDto,
	UpdateUserDto,
} from "./user.interface";
import { hashPassword, signToken, verifyPassword } from "./user.utils";

export const login = async (
	data: LoginUserDto,
): Promise<{
	user: User;
	token: string;
}> => {
	const user = await db.user.findFirstOrThrow({
		where: { email: data.email },
	});
	if (!(await verifyPassword(data.password, user.password)))
		throw new Error("Invalid credentials");

	const token = await signToken({
		uid: user.id,
		email: user.email,
		username: user.username,
	});
	return {
		user,
		token,
	};
};

export const count = async (): Promise<number> => {
	const count = await db.user.count();
	return count;
};

export const create = async (
	data: CreateUserDto,
): Promise<{
	user: User;
	token: string;
}> => {
	await assertNoConflicts(
		"user",
		{
			email: data.email,
			username: data.username,
		},
		async (key, value) => {
			const existing = await db.user.findFirst({
				where: { [key]: value },
			});
			return Boolean(existing);
		},
	);
	const createdUser = await db.user.create({
		data: {
			...data,
			password: await hashPassword(data.password),
		},
	});
	const token = await signToken({
		uid: createdUser.id,
		email: createdUser.email,
		username: createdUser.username,
	});
	return { user: createdUser, token };
};

export const update = async (
	id: string,
	data: UpdateUserDto,
): Promise<{
	user: User;
	token: string;
}> => {
	await assertNoConflicts(
		"user",
		{
			email: data.email,
			username: data.username,
		},
		async (key, value) => {
			const existing = await db.user.findFirst({
				where: { [key]: value },
			});
			return Boolean(existing);
		},
	);
	const updatedUser = await db.user.update({
		where: { id },
		data: {
			...data,
			password: data.password ? await hashPassword(data.password) : undefined,
		},
	});
	const token = await signToken({
		uid: updatedUser.id,
		email: updatedUser.email,
		username: updatedUser.username,
	});
	return { user: updatedUser, token };
};

export const findOne = async (
	id: string,
): Promise<{
	user: User;
	token: string;
}> => {
	const user = await db.user.findFirstOrThrow({ where: { id } });
	const token = await signToken({
		uid: user.id,
		email: user.email,
		username: user.username,
	});
	return { user, token };
};
