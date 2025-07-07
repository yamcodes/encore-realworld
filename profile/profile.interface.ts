export type ProfileResponse = {
	profile: {
		username: string;
		bio: string | null;
		image: string | null;
		following: boolean;
	};
};
