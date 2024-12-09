import { User } from "@/types";
import { Config, DateTimeString, FileValidateResult } from "@/types/app"
import { DateTime } from 'luxon';

export const getDefaultUser = (): User => {
    return {
        id: 0, name: "", email: "", password: "",
        roles: [],
        email_verified_at: "0000-00-00 00:00:00", last_login_at: "0000-00-00 00:00:00", created_at: "0000-00-00 00:00:00", updated_at: "0000-00-00 00:00:00"
    };
}

const Util = {
    // 透明な1x1のPNG画像
    transparentBase64:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wIAAgkBDXz5ZQAAAABJRU5ErkJggg==",
    // DateTimeStringな文字列をDateTimeオブジェクトに変更
    datetime: (datetimestring: DateTimeString): DateTime => DateTime.fromISO(datetimestring).setLocale('ja'),
    // Userがロールを持っているか
    hasRole: (user: User, roleName: string): boolean => user.roles.filter((_role, i) => _role.name === roleName).length > 0,
    // Window topに
    returnTop: () => {
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth", }), 1);
    },
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
    }
}

export default Util;
