import { Role } from "./app";

export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at?: DateTimeString;
    password?: string | undefined;
    password_confirmation?: string | undefined;
    profile_image_url?: string ;
    last_login_at: DateTimeString | null;
    created_at: DateTimeString;
    updated_at: DateTimeString;
    roles: Role[];
};

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
