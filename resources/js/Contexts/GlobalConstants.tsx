import { Dispatch, createContext, ReactNode, SetStateAction, useState, useContext } from 'react';

export type GlobalConstantsType = {
    ADMIN_PATH: string;
}
const globalConstants = {
    ADMIN_PATH: ""
}

const GlobalConstantsContext = createContext(globalConstants)


// need not setter
export const GlobalConstantsProvider = ({ children, defaultValue }:
    {
        children: ReactNode;
        defaultValue: GlobalConstantsType;
    }
) => {

    return (
        <GlobalConstantsContext.Provider value={defaultValue} >
            {children}
        </GlobalConstantsContext.Provider>
    );
}

const useGlobalConstantsContext = () => useContext(GlobalConstantsContext)
export default useGlobalConstantsContext

