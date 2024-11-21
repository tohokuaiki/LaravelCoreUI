import { ToastResult } from "@/Components/ToastResult";
import { Colors } from "@coreui/react/dist/esm/types";
import { createContext, Dispatch, ReactElement, SetStateAction, useContext, useState } from "react";


type ToastResultContextSet = {
    toast: ReactElement | null;
    setToast: Dispatch<SetStateAction<ReactElement | null>>;
}

const ToastResultContext = createContext<ToastResultContextSet>({
    toast: null,
    setToast: () => { }
});

export const ToastResultProvider = ({ children, defaultValue }: {
    children: ReactElement;
    defaultValue: ReactElement | null;
}) => {

    const [toast, setToast] = useState<ReactElement | null>(defaultValue);

    const value: ToastResultContextSet = { toast, setToast }

    return <ToastResultContext.Provider value={value}>{children}</ToastResultContext.Provider>
}

export const useToastResultContext = (): ToastResultContextSet => {
    return useContext(ToastResultContext);
}
