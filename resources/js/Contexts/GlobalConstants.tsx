import { getDefaultUser } from '@/lib/util';
import { User } from '@/types';
import { Config, Role } from '@/types/app';
import { Dispatch, createContext, ReactNode, SetStateAction, useState, useContext } from 'react';

export type GlobalConstantsType = {
    user: User;
    ADMIN_PATH: string;
    config: Config;
    roles: Role[];
    mustVerifyEmail: boolean;
}

export type GlobalConstantsTypeSet = {
    globalConstants: GlobalConstantsType;
    setGlobalConstatns: Dispatch<SetStateAction<GlobalConstantsType>>;
}
const globalConstants = {
    user: getDefaultUser(),
    ADMIN_PATH: "",
    config: {
        pagination: {
            perpage: 0
        },
        upload_file_limit: {
            max_file_size: 0,
            image: { mimes: [], extensions: [] },
            file: { mimes: [], extensions: [] }
        }
    },
    roles: [],
    mustVerifyEmail: false,
}

const GlobalConstantsContext = createContext<GlobalConstantsTypeSet>({ globalConstants, setGlobalConstatns: () => { } })


// need not setter
export const GlobalConstantsProvider = ({ children, defaultValue }:
    {
        children: ReactNode;
        defaultValue: GlobalConstantsType;
    }
) => {

    const [globalConstants, setGlobalConstatns] = useState<GlobalConstantsType>(defaultValue);

    const value: GlobalConstantsTypeSet = {
        globalConstants, setGlobalConstatns
    }

    return (
        <GlobalConstantsContext.Provider value={value} >
            {children}
        </GlobalConstantsContext.Provider>
    );
}

const useGlobalConstantsContext = () => useContext(GlobalConstantsContext)
export default useGlobalConstantsContext

