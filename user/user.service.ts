import type { User } from "@prisma/client";
import { assertNoConflicts } from "@/shared/errors";
import { hashPassword, signToken } from "@/shared/utils";
import { db } from "../database";
import type {
	CreateUserDto,
	LoginUserDto,
	Response,
	UpdateUserDto,
	UserResponse,
} from "./user.interface";
import { toResponse } from "./user.mappers";
import { getOffset, paginatedData } from "./utils";

export const login = async (data: LoginUserDto): Promise<UserResponse> => {
	const user = await db.user.findFirst({ where: { email: data.email } });
	if (!user) throw new Error("User not found");
	if (user.password !== data.password) {
		throw new Error("Invalid password");
	}
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

export const find = async (
	page?: number,
	limit?: number,
): Promise<UserResponse> => {
	let users: User[] = [];
	let pagination: any;
	if (page && limit) {
		const offset = getOffset(page, limit);
		const count = await db.user.count();
		users = await db.user.findMany({ take: limit, skip: offset });
		pagination = paginatedData({ size: limit, page, count });
	} else {
		users = await db.user.findMany();
	}
	return Promise.all(
		users.map(async (user) => toResponse(user, await signToken(user.id))),
	);
};

export const findOne = async (id: string): Promise<UserResponse> => {
	const user = await db.user.findFirst({ where: { id } });
	if (!user) throw new Error("User not found");
	return toResponse(user, await signToken(user.id));
};

export const deleteUser = async (id: string): Promise<Response> => {
	const user = await db.user.findFirst({ where: { id } });
	if (!user) throw new Error("User not found");
	await db.user.delete({ where: { id } });
	return "User deleted successfully";
};
