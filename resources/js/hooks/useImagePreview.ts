import Util from "@/lib/util";
import { Config, FileValidateResult } from "@/types/app";
import { ChangeEvent, useCallback, useState } from "react";

export default function useImagePreview(config: Config): {
    imagePreview: Blob | null | undefined ;
    readImagePreview: (files: FileList | null) => void;
} {

    const [imagePreview, setImagePreview] = useState<Blob | null | undefined>()
    const readImagePreview = useCallback((files: FileList | null) => {
        if (!files || files.length === 0) {
            setImagePreview(null);
            return ;
        }
        const file: File = files[0];
        const result: FileValidateResult = Util.validateFile("image", file, config);
        if (result.success) {
            // read
            const reader = new FileReader();
            reader.onloadend = async ({ target }: ProgressEvent<FileReader>) => {
                const result = target?.result;
                if (result) {
                    const selectedImg = new Blob([result], { type: file.type });
                    setImagePreview(selectedImg);
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


    return { imagePreview, readImagePreview };
}