type Fields<T extends string> = Partial<Record<T, string>>;

/**
 * Assert that no conflicts exist in the given fields.
 * @param entity The entity that is being checked for conflicts, singular. (e.g. "user")
 * @param fields A mapping of fields to check for conflicts, keyed by field name, value by field value. (e.g. `{ email: "test@example.com" }`)
 * @param queryFn A function that returns a boolean indicating whether a conflict exists.
 * @throws If a conflict is found ({@link ConflictingFieldsError})
 *
 * @example
 * ```ts
 * await assertNoConflicts("user", { email: "test@example.com" }, async (field, value) => {
 *   const existing = await db.query.users.findFirst({ where: eq(users[field], value) });
 *   return Boolean(existing);
 * });
 * ```
 */
export async function assertNoConflicts<T extends string>(
	entity: string,
	fields: Fields<T>,
	queryFn: (key: T, value: string) => Promise<boolean>,
): Promise<void> {
	const entries = Object.entries(fields) as [T, string | undefined][];

	const conflicts = await Promise.all(
		entries.map(async ([key, value]) =>
			value && (await queryFn(key, value)) ? key : null,
		),
	);

	const conflictingFields = conflicts.filter(
		(f): f is Awaited<T> => f !== null,
	);

	if (conflictingFields.length > 0) {
		// throw new ConflictingFieldsError(entity, conflictingFields);
		throw new Error(
			`Conflicting fields in ${entity}: ${conflictingFields.join(", ")}`,
		);
	}
}
