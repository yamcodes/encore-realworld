import { prisma } from "./database";
import type {
	CreateUserDto,
	LoginUserDto,
	Response,
	UpdateUserDto,
	UserResponse,
} from "./user.interface";
import type { User } from "./user.model";
import { getOffset, paginatedData } from "./utils";

const UserService = {
	login: async (data: LoginUserDto): Promise<UserResponse> => {
		const user = await prisma.user.findFirst({ where: { email: data.email } });
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
	},
	count: async (): Promise<number> => {
		const count = await prisma.user.count();
		return count;
	},

	create: async (data: CreateUserDto): Promise<UserResponse> => {
		const user = await prisma.user.create({ data });
		return {
			success: true,
			result: user,
		};
	},

	update: async (id: string, data: UpdateUserDto): Promise<UserResponse> => {
		const user = await prisma.user.findFirst({ where: { id } });
		if (!user) {
			return {
				success: false,
				message: "User not found",
			};
		}
		const updated = await prisma.user.update({
			where: { id },
			data,
		});
		return {
			success: true,
			result: updated,
		};
	},

	find: async (page?: number, limit?: number): Promise<UserResponse> => {
		let users: User[] = [];
		let pagination: any;
		if (page && limit) {
			const offset = getOffset(page, limit);
			const count = await prisma.user.count();
			users = await prisma.user.findMany({ take: limit, skip: offset });
			pagination = paginatedData({ size: limit, page, count });
		} else {
			users = await prisma.user.findMany();
		}
		return {
			success: true,
			result: users.map((user) => user),
			pagination,
		};
	},

	findOne: async (id: string): Promise<UserResponse> => {
		const user = await prisma.user.findFirst({ where: { id } });
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
	},

	delete: async (id: string): Promise<Response> => {
		const user = await prisma.user.findFirst({ where: { id } });
		if (!user) {
			return {
				success: false,
				message: "User not found",
			};
		}
		await prisma.user.delete({ where: { id } });
		return {
			success: true,
			result: "User deleted successfully",
		};
	},
};

export default UserService;
