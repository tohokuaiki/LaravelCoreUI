import Util from "@/lib/util";
import { Config, FileValidateResult } from "@/types/app";
import { ChangeEvent, useCallback, useState } from "react";

export default function useFileRead(filetype: "image" | "file", config: Config): {
    fileBuffer: Blob | null | undefined;
    readFileBuffer: (files: FileList | null) => void;
} {

    const [fileBuffer, setFileBuffer] = useState<Blob | null | undefined>()
    const readFileBuffer = useCallback((files: FileList | null) => {
        if (!files || files.length === 0) {
            setFileBuffer(null);
            return;
        }
        const file: File = files[0];
        const result: FileValidateResult = Util.validateFile(filetype, file, config);
        if (result.success) {
            // read
            const reader = new FileReader();
            reader.onloadend = async ({ target }: ProgressEvent<FileReader>) => {
                const result = target?.result;
                if (result) {
                    setFileBuffer(new Blob([result], { type: file.type }));
                }
            };
            reader.readAsArrayBuffer(file);
        }
        else {
            throw result;
        }
    },
        [],
    );


    return { fileBuffer, readFileBuffer };
}