import { User } from "@/types";
import { LaravelFormError, Config, DateString, DateTimeString, FileValidateResult, WithTimestamps } from "@/types/app"
import { DateTime } from 'luxon';

export const getDefaultUser = (): User => {
    return {
        id: 0, name: "", email: "", password: "",
        roles: [],
        email_verified_at: null,
        last_login_at: null,
        created_at: null,
        updated_at: null
    };
}

export const CONSTANT: Record<string, string> = {
    FORMAT_DATETIME: 'yyyy/MM/dd HH:mm:ss',
    FORMAT_DATE: 'yyyy/MM/dd',
}

const Util = {
    // 透明な1x1のPNG画像
    transparentBase64:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wIAAgkBDXz5ZQAAAABJRU5ErkJggg==",
    japanPref: ['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県', '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'],
    // DateTimeStringな文字列をDateTimeオブジェクトに変更
    datetime: (datetimestring: DateTimeString | DateString | null): DateTime => {
        if (datetimestring === null) {
            return DateTime.now();
        } else {
            return DateTime.fromISO(datetimestring).setLocale('ja');
        }
    },

    castDates: <T extends WithTimestamps>(data: T, append: (keyof T)[] = []): T => {
        const targetKeys: (keyof T)[] = ['created_at', 'updated_at'];
        if (append) {
            targetKeys.push(...append);
        }

        targetKeys.forEach((key) => {
            if (data[key]) {
                if (typeof (data[key]) === 'string') {
                    data[key] = DateTime.fromISO(data[key]).setLocale('ja').toJSDate() as T[keyof T];
                }
            }
        });

        return data;
    },

    // Userがロールを持っているか
    hasRole: (user: User, roleName: string): boolean => user.roles.filter((_role, i) => _role.name === roleName).length > 0,
    // Window topに
    returnTop: () => {
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth", }), 1);
    },
    // now
    now: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss') as DateTimeString,
    // 画像ファイルのチェック
    validateFile: (
        filetype: "image" | "file", { type, size, name }: File, config: Config
    ): FileValidateResult => {

        const { max_file_size } = config.upload_file_limit;
        const { mimes, extensions } = config.upload_file_limit[filetype];
        const errors: FileValidateResult = {
            success: true,
            message: { 'ext': [], 'mime': [], 'size': [] }
        };

        const mimeOK: boolean = mimes.filter((mime) => mime === type.toLowerCase()).length > 0;
        if (!mimeOK) {
            errors.success = false;
            errors.message.mime.push("有効なファイルのMIMEタイプは、「" + mimes.join(',') + "」のみです。")
        }

        const extOK: boolean = extensions.filter((ext) => name.toLowerCase().endsWith(ext)).length > 0;
        if (!extOK) {
            errors.success = false;
            errors.message.mime.push("有効なファイルの拡張子は、「" + extensions.join('/') + "」のみです。")
        }
        if (size > max_file_size) {
            errors.success = false;
            errors.message.size.push("有効なファイルサイズは、" + max_file_size + "バイト以下です。")
        }
        return errors;
    },
    isAsciiOnly: (input: string): boolean => {
        return /^[\x20-\x7E]*$/.test(input);
    },
    toUnicodeEscaped: (input: string | number | undefined | null): string | number => {
        if (typeof (input) === 'number') return input;

        if (!input) return "";

        if (Util.isAsciiOnly(input)) return input;

        return Array.from(input)
            .map((char) => {
                const codePoint = char.codePointAt(0);
                if (codePoint === undefined) return ""; // 安全チェック
                return `\\u${codePoint.toString(16).padStart(4, "0")}`;
            })
            .join("");
    },
    objectFilter: <T>(obj: Record<string, T>, predicate: (key: string, value: T) => boolean): Record<string, T> => {
        return Object.fromEntries(
            Object.entries(obj).filter(([key, value]) => predicate(key, value))
        )
    },
    sleep: (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms)),
    laravel: {
        error: {
            exists: (name: string, errors: LaravelFormError): boolean => {
                if (errors[name]) return true;
                const nameMatch = new RegExp('^' + name + '(.[0-9]+)');
                return Object.entries(errors).filter(([key, value]) => {
                    return key.match(nameMatch) && value.length > 0;
                }).length > 0;
            },
            toArray: (errors: LaravelFormError) => {
                const result: Record<string, string[]> = {}

                for (const [key, messages] of Object.entries(errors)) {
                    const [baseKey, index] = key.split('.')

                    if (index !== undefined && !isNaN(Number(index))) {
                        if (!result[baseKey]) result[baseKey] = []
                        result[baseKey].push(...messages)
                    } else {
                        result[key] = messages
                    }
                }
                return result;
            },
        }
    }
}

export default Util;
