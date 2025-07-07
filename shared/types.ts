import type * as jose from "jose";

export type AuditFields = "createdAt" | "updatedAt";

export interface JwtPayload extends jose.JWTPayload {
	uid: string;
	email: string;
	username: string;
}
