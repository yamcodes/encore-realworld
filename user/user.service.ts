import type { User } from "@prisma/client";
import { db } from "../database";
import type {
	CreateUserDto,
	LoginUserDto,
	Response,
	UpdateUserDto,
	UserResponse,
} from "./user.interface";
import { getOffset, paginatedData } from "./utils";

export const login = async (data: LoginUserDto): Promise<UserResponse> => {
	const user = await db.user.findFirst({ where: { email: data.email } });
	if (!user) {
		return {
			success: false,
			message: "User not found",
		};
	}
	if (user.password !== data.password) {
		return {
			success: false,
			message: "Invalid password",
		};
	}
	return {
		success: true,
		result: user,
	};
};

export const count = async (): Promise<number> => {
	const count = await db.user.count();
	return count;
};

export const create = async (data: CreateUserDto): Promise<UserResponse> => {
	const user = await db.user.create({ data });
	return {
		success: true,
		result: user,
	};
};

export const update = async (
	id: string,
	data: UpdateUserDto,
): Promise<UserResponse> => {
	const user = await db.user.findFirst({ where: { id } });
	if (!user) {
		return {
			success: false,
			message: "User not found",
		};
	}
	const updated = await db.user.update({
		where: { id },
		data,
	});
	return {
		success: true,
		result: updated,
	};
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
	return {
		success: true,
		result: users.map((user) => user),
		pagination,
	};
};

export const findOne = async (id: string): Promise<UserResponse> => {
	const user = await db.user.findFirst({ where: { id } });
	if (!user) {
		return {
			success: false,
			message: "User not found",
		};
	}
	return {
		success: true,
		result: user,
	};
};

export const deleteUser = async (id: string): Promise<Response> => {
	const user = await db.user.findFirst({ where: { id } });
	if (!user) {
		return {
			success: false,
			message: "User not found",
		};
	}
	await db.user.delete({ where: { id } });
	return {
		success: true,
		result: "User deleted successfully",
	};
};
