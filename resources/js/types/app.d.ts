import { DateTime } from 'luxon';
export type DateTimeString = `${string}-${string}-${string} ${string}:${string}:${string}`;
export type DateString = `${string}-${string}-${string}`;

export type WithTimestamps = {
    created_at: Date | null;
    updated_at: Date | null;
}

export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: Date | null;
    password?: string | undefined;
    password_confirmation?: string | undefined;
    profile_image_url?: string ;
    last_login_at: Date | null;
    roles: Role[];
} & WithTimestamps;

export type Role = {
    id: number;
    name: string;
    guard_name: string;
    created_at: DateTimeString;
    updated_at: DateTimeString;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};

type FileRestricts = {
    extensions: string[];
    mimes: string[];
};

export type Config = {
    pagination: {
        perpage: number;
    };
    upload_file_limit: {
        max_file_size: number;
        image: FileRestricts;
        file: FileRestricts;
    }
}

export type JapanCityCode = {
    code: number;
    prefecture: string;
    city_g: string;
    city_g_kana: string;
    city: string;
    city_kana: string;
    abolition_division_date: DateString;
    abolition_division_yn: string;
    created_at: DateTimeString;
    updated_at: DateTimeString;
}

export type LaravelFormError = {
    [key: string]: string[];
}

export type GeneralValidateResult<K extends string> = {
    success: boolean;
    message: Record<K, string[]>;
}

export type FileValidateResult = GeneralValidateResult<"ext" | "mime" | "size">;
