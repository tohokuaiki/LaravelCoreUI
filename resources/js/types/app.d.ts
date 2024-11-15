import { DateTime } from 'luxon';
export type DateTimeString = `${string}-${string}-${string} ${string}:${string}:${string}`;

export type Role = {
    id: number;
    name : string;
    guard_name: string;
    created_at: DateTimeString;
    updated_at: DateTimeString;
}

export type Config = {
    pagination: {
        perpage: number;
    };
}

export type AxiosFormError = {
    [key: string]: string[];
}
