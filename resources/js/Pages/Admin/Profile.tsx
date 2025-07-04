import { Head, usePage } from "@inertiajs/react";
import { ReactNode } from "react";
import DeleteUserForm from "../Profile/Partials/DeleteUserForm";
import UpdatePasswordForm from "../Profile/Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "../Profile/Partials/UpdateProfileInformationForm";
import { PageProps } from "@/types";
import { CCard, CCardBody, CCardHeader } from "@coreui/react";
import useGlobalConstantsContext from "@/Contexts/GlobalConstants";

export default function Profile(): ReactNode {

    const { globalConstants } = useGlobalConstantsContext()
    const { mustVerifyEmail  } = globalConstants;

    return (
        <>
            <Head title="アカウント情報の変更" />
            <CCard className="mb-4">
                <CCardHeader>
                    アカウント情報の変更
                </CCardHeader>
                <CCardBody>

                    <div className="mx-auto max-w-7xl space-y-6">
                        <div className="p-4 sm:rounded-lg sm:p-8">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>

                        <div className="p-4 sm:rounded-lg sm:p-8">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>
                        
                        <div className="p-4 sm:rounded-lg sm:p-8 shwdow">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </div>

                </CCardBody>
            </CCard>
        </>
    );
}