import { APIError } from "encore.dev/api";

export const conflictingFieldsError = (
	entity: string,
	fields: string[],
): APIError => {
	return APIError.alreadyExists(
		`${entity} with ${fields.join(", ")} already exists`,
	).withDetails({
		[entity]: fields.map((field) => `${entity}.${field}`),
	});
};
