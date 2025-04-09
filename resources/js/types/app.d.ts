import { DateTime } from 'luxon';
export type DateTimeString = `${string}-${string}-${string} ${string}:${string}:${string}`;
export type DateString = `${string}-${string}-${string}`;

export type Role = {
    id: number;
    name: string;
    guard_name: string;
    created_at: DateTimeString;
    updated_at: DateTimeString;
}

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
