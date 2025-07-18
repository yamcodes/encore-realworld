import { api } from "encore.dev/api";
import { getCurrentUserIdOrThrow } from "~/auth";
import {
	UserCountError,
	UserCreateError,
	UserGetError,
	UserLoginError,
	UserUpdateError,
} from "./user.errors";
import type {
	CreateUserDto,
	LoginUserDto,
	UpdateUserDto,
	UserResponse,
} from "./user.interface";
import { toResponse } from "./user.mappers";
import * as UserService from "./user.service";

/**
 * Counts and returns the number of existing users
 */
export const count = api(
	{ method: "GET", path: "/count/users", auth: true },
	async (): Promise<{
		count: number;
	}> => {
		try {
			const result = await UserService.count();
			return { count: result };
		} catch {
			throw UserCountError;
		}
	},
);

/**
 * Registration
 *
 * No authentication required
 * @returns a User
 */
export const registration = api(
	{ method: "POST", path: "/users", auth: false },
	async (data: CreateUserDto): Promise<UserResponse> => {
		try {
			const result = await UserService.create(data);
			return toResponse(result.user, result.token);
		} catch {
			throw UserCreateError;
		}
	},
);

/**
 * Authentication
 *
 * No authentication required
 * @returns a User
 */
export const authentication = api(
	{ method: "POST", path: "/users/login", auth: false },
	async (data: LoginUserDto): Promise<UserResponse> => {
		try {
			const { user, token } = await UserService.login(data);
			return toResponse(user, token);
		} catch {
			throw UserLoginError;
		}
	},
);

export const getCurrentUser = api(
	{ method: "GET", path: "/user", auth: true },
	async (): Promise<UserResponse> => {
		try {
			const id = getCurrentUserIdOrThrow();
			const result = await UserService.findOne(id);
			return toResponse(result.user, result.token);
		} catch {
			throw UserGetError;
		}
	},
);

export const updateCurrentUser = api(
	{ method: "PUT", path: "/user", auth: true },
	async (data: UpdateUserDto): Promise<UserResponse> => {
		try {
			const id = getCurrentUserIdOrThrow();
			const result = await UserService.update(id, data);
			return toResponse(result.user, result.token);
		} catch {
			throw UserUpdateError;
		}
	},
);
