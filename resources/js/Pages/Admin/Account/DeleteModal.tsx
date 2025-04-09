import { ErrorMessage } from "@/Components/InputError";
import Util from "@/lib/util";
import { LaravelFormError } from "@/types/app";
import { User } from "@/types/index"
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CCol, CRow, CBadge, CAlert } from "@coreui/react"
import axios from "axios";
import { ReactNode, useState } from "react"
import { useToastResultContext } from "@/Contexts/ToastResultsContext";
import { ToastResult } from "@/Components/ToastResult";

export default function DeleteModal({
    user, isVisible, closeHandler, deleteHandler
}:
    {
        user: User;
        isVisible: boolean;
        closeHandler: () => void;
        deleteHandler: (user: User) => void;
    }): ReactNode {

    const { setToast } = useToastResultContext();
    const [errors, setErrors] = useState<LaravelFormError>({});

    const deleteDo = async () => {
        setErrors({});
        try {
            const resp = await axios.delete(route('users.destroy', user.id))
            deleteHandler(user)
            setToast(ToastResult(user.name + "のアカウントを削除しました。"));            
        } catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response!.data.errors) {
                    setErrors(e.response!.data.errors);
                } else if (e.response!.data.message) {
                    setErrors({ message: [e.response!.data.message] });
                }
            }
        }
    }

    const closeModal = () => {
        setErrors({});
        closeHandler();
    }

    return (
        <CModal
            alignment="center"
            visible={isVisible}
            onClose={closeModal}
        >
            <CModalHeader>
                <CModalTitle>管理者アカウントの削除</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CAlert color="danger" hidden={Object.keys(errors).length === 0}>
                    {Object.entries(errors).map(([key, value]) =>
                        <ErrorMessage errors={value} key={key} />
                    )}
                </CAlert>
                <p>このアカウントを削除してよろしいですか？</p>
                <CRow className="mb-3 mt-4">
                    <CCol sm={4}>名前</CCol>
                    <CCol sm={8}>{user.name}</CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol sm={4}>メールアドレス</CCol>
                    <CCol sm={8}>{user.email}</CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol sm={4}>役割</CCol>
                    <CCol sm={8}>{user.roles.map((role, i) =>
                        <CBadge key={i} color="success" shape="rounded-pill">{role.name}</CBadge>
                    )}</CCol>
                </CRow>
                <CRow className="mb-3 mt-4">
                    <CCol sm={4}>作成日時</CCol>
                    <CCol sm={8}>{Util.datetime(user.created_at).toFormat('yyyy-MM-dd HH:mm:ss')}</CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol sm={4}>更新日時</CCol>
                    <CCol sm={8}>{Util.datetime(user.updated_at).toFormat('yyyy-MM-dd HH:mm:ss')}</CCol>
                </CRow>

            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={closeModal}>
                    キャンセル
                </CButton>
                <CButton color="danger" onClick={deleteDo}>削除する</CButton>
            </CModalFooter>
        </CModal>
    )
}