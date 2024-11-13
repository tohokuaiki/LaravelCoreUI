import { Config, Role } from '@/types/app';
import { Dispatch, createContext, ReactNode, SetStateAction, useState, useContext } from 'react';

export type GlobalConstantsType = {
    ADMIN_PATH: string;
    config: Config;
    roles: Role[];
}

export type GlobalConstantsTypeSet = {
    globalConstants: GlobalConstantsType;
    setGlobalConstatns: Dispatch<SetStateAction<GlobalConstantsType>>;
}
const globalConstants = {
    ADMIN_PATH: "",
    config: {
        pagination: {
            perpage: 0
        }
    },
    roles: [],
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

