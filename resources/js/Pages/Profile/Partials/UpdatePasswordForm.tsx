import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { ToastResult } from '@/Components/ToastResult';
import { useToastResultContext } from '@/Contexts/ToastResultsContext';
import { cilWarning } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CAlert, CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { FormEventHandler, useRef, useState } from 'react';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const { setToast } = useToastResultContext();

    const {
        data,
        setData,
        errors,
        setError,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            const resp = await axios.put(route('password.update'), data);
            reset();
            setUpdateModal(true);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                setError(e.response?.data.errors);
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            }
        }
    };

    const [updateModal, setUpdateModal] = useState<boolean>(false);
    const requireLogin = () => {
        if (updateModal) {
            setUpdateModal(false);
        }
        window.location.assign(route('login'));
    }

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Update Password
                </h2>

                <CAlert color="warning" className="d-flex align-items-center small p-2 mt-1">
                    <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
                    <div>パスワードを変更後は再ログインが必要です。</div>
                </CAlert>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Current Password"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="New Password" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>

            <CModal
                visible={updateModal}
                onClose={() => { requireLogin() }}
                aria-labelledby="Modal-PasswordUpdated"
            >
                <CModalHeader>
                    <CModalTitle id="Modal-PasswordUpdated">パスワードを変更しました。</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p>再度ログインが必要です。新しいパスワードでログインしてください。</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={() => { requireLogin() }}>ログイン画面へ移動</CButton>
                </CModalFooter>
            </CModal>
        </section>
    );
}
