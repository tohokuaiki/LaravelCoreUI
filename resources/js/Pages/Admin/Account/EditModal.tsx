import useGlobalConstantsContext from "@/Contexts/GlobalConstants";
import Util from "@/lib/util";
import { AxiosFormError } from "@/types/app";
import { User } from "@/types/index"
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CFormInput, CCol, CRow, CFormSwitch, CAlert, CForm } from "@coreui/react"
import axios from "axios";
import { ChangeEvent, ReactNode, useEffect, useState } from "react"
import { getDefaultUser } from "@/lib/util";
import { ErrorMessage } from "@/Components/InputError";

export default function EditModal({
    user, isVisible, closeHandler, updateHandler
}:
    {
        user: User;
        isVisible: boolean;
        closeHandler: () => void;
        updateHandler: (user: User, isNew: boolean) => void;
    }): ReactNode {

    const { globalConstants } = useGlobalConstantsContext()

    const { roles } = globalConstants

    const [_user, _setUser] = useState<User>(getDefaultUser())
    useEffect(() => {
        _setUser(user)
    }, [user]);

    // error
    const [errors, setErrors] = useState<AxiosFormError>({});

    const updateUserInfo = async () => {
        setErrors({});
        try {
            const isNew: boolean = _user.id == 0;
            const resp = await axios.request({
                method: isNew ? 'post' : 'put',
                url: isNew ? route('users.store') : route('users.update', user.id),
                data: _user
            });
            updateHandler(resp.data as User, isNew)
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

    const onCloseModal = () => {
        setErrors({});
        _setUser(user);
        closeHandler();
    }


    return (
        <CModal
            alignment="center"
            visible={isVisible}
            onClose={onCloseModal}
        >
            <CModalHeader>
                <CModalTitle id="LiveDemoExampleLabel">管理者アカウントの{_user.id > 0 ? "編集" : "作成"}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CAlert color="danger" hidden={Object.keys(errors).length === 0}>
                    {Object.entries(errors).map(([key, value]) =>
                        <ErrorMessage errors={value} key={key} />
                    )}
                </CAlert>
                <CFormInput
                    type="text"
                    label="名前"
                    defaultValue={_user.name}
                    required={true}
                    className="mb-3"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        _setUser({ ..._user, name: e.target.value })
                    }}
                    invalid={'name' in errors}
                    feedbackInvalid={<ErrorMessage errors={errors.name} />}
                />
                <CFormInput
                    type="email"
                    label="メールアドレス"
                    placeholder="name@example.com"
                    defaultValue={_user.email}
                    required={true}
                    className="mb-3"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        _setUser({ ..._user, email: e.target.value })
                    }}
                    invalid={'email' in errors}
                    feedbackInvalid={<ErrorMessage errors={errors.email} />}
                />
                <CFormInput
                    type="password"
                    label="パスワード"
                    defaultValue=""
                    text="変更する場合に入力してください。"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        _setUser({ ..._user, password: e.target.value })
                    }}
                    invalid={'password' in errors}
                    feedbackInvalid={<ErrorMessage errors={errors.password} />}
                />
                <CRow className="mb-3 mt-4">
                    <CCol sm={4}>役割</CCol>
                    <CCol sm={8}>
                        {roles.map((role, i) =>
                            <CFormSwitch key={i} label={role.name} value={1} defaultChecked={Util.hasRole(_user, role.name)} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const _roles = Array.from(_user.roles);
                                if (e.target.checked) {
                                    _roles.push(role);
                                } else {
                                    const index = _roles.findIndex(_r => _r.id === role.id)
                                    if (index >= 0) {
                                        _roles.splice(index, 1)
                                    }
                                }
                                _setUser({ ..._user, roles: _roles });
                            }} />
                        )}
                    </CCol>
                </CRow>
                {_user.id > 0 ? <>
                    <CRow className="mb-3 mt-4">
                        <CCol sm={4}>作成日時</CCol>
                        <CCol sm={8}>{Util.datetime(_user.created_at).toFormat('yyyy-MM-dd HH:mm:ss')}</CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CCol sm={4}>更新日時</CCol>
                        <CCol sm={8}>{Util.datetime(_user.updated_at).toFormat('yyyy-MM-dd HH:mm:ss')}</CCol>
                    </CRow>
                </> : ""}
            </CModalBody>
            <CModalFooter className="justify-content-md-center">
                <CButton color="secondary" onClick={onCloseModal}>
                    キャンセル
                </CButton>
                <CButton color="primary" onClick={() => updateUserInfo()}>{_user.id > 0 ? "変更する" : "作成する"}</CButton>
            </CModalFooter>
        </CModal>
    )
}
