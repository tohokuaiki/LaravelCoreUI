import { CCallout, CToast, CToastBody, CToastClose } from "@coreui/react"
import { Colors } from "@coreui/react/dist/esm/types";
import { ReactElement } from "react"

export function ToastResult(
    message: string,
    type: Colors = "success",
    autohide: boolean = true
): ReactElement {

    // Since Toast is a disposable element, use Date.now() as the key...
    const key = Date.now();

    return (<CToast autohide={autohide} className="align-items-center" key={key}>
        <CCallout color={type} className="my-0 py-0">
            <div className="d-flex">
                <CToastBody className="d-flex align-items-center">
                    <span>{message}</span>
                </CToastBody>
                <CToastClose className="me-2 m-auto" />
            </div>
        </CCallout>
    </CToast>)
}
