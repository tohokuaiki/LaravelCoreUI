import { User } from "@/types";
import { DateTimeString, Role } from "@/types/app"
import { usePage } from "@inertiajs/react";
import { DateTime } from 'luxon';


const Util = {
    // DateTimeStringな文字列をDateTimeオブジェクトに変更
    datetime: (datetimestring: DateTimeString): DateTime => DateTime.fromISO(datetimestring).setLocale('ja'),
    // Userがロールを持っているか
    hasRole: (user: User, roleName: string): boolean => user.roles.filter((_role, i) => _role.name === roleName).length > 0,
    // Window topに
    returnTop: () => window.scrollTo({ top: 0, behavior: "smooth", }),
}

export default Util;
