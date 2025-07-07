import { assertNoConflicts } from "@/shared/errors";
import { hashPassword, signToken, verifyPassword } from "@/shared/utils";
import { db } from "../database";
import type {
	CreateUserDto,
	LoginUserDto,
	UpdateUserDto,
	UserResponse,
} from "./user.interface";
import { toResponse } from "./user.mappers";

export const login = async (data: LoginUserDto): Promise<UserResponse> => {
	const user = await db.user.findFirstOrThrow({
		where: { email: data.email },
	});
	if (!(await verifyPassword(data.password, user.password)))
		throw new Error("Invalid credentials");
	return toResponse(
		user,
		await signToken({
			uid: user.id,
			email: user.email,
			username: user.username,
		}),
	);
};

export const count = async (): Promise<number> => {
	const count = await db.user.count();
	return count;
};

export const create = async (data: CreateUserDto): Promise<UserResponse> => {
	const user = await db.user.create({ data });
	await assertNoConflicts(
		"user",
		{
			email: user.email,
			username: user.username,
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
			...user,
			password: await hashPassword(user.password),
		},
	});
	const token = await signToken({
		uid: createdUser.id,
		email: createdUser.email,
		username: createdUser.username,
	});
	return toResponse(createdUser, token);
};

export const update = async (
	id: string,
	data: UpdateUserDto,
): Promise<UserResponse> => {
	const user = await db.user.findFirst({ where: { id } });
	if (!user) throw new Error("User not found");
	const updated = await db.user.update({
		where: { id },
		data,
	});
	return toResponse(
		updated,
		await signToken({
			uid: updated.id,
			email: updated.email,
			username: updated.username,
		}),
	);
};

export const findOne = async (id: string): Promise<UserResponse> => {
	const user = await db.user.findFirst({ where: { id } });
	if (!user) throw new Error("User not found");
	return toResponse(
		user,
		await signToken({
			uid: user.id,
			email: user.email,
			username: user.username,
		}),
	);
};
