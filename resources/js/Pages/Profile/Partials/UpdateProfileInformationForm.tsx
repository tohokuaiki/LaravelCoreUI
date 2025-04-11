import InputError, { ErrorMessage } from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import useGlobalConstantsContext from '@/Contexts/GlobalConstants';
import useFileRead from '@/hooks/useFileRead';
import { CAlert, CFormInput } from '@coreui/react';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { ChangeEvent, FormEventHandler, useRef, useState } from 'react';
import { LaravelFormError, FileValidateResult } from '@/types/app';
import { User } from '@/types';
import { ToastResult } from '@/Components/ToastResult';
import { useToastResultContext } from '@/Contexts/ToastResultsContext';
import Util from '@/lib/util';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {

    const { globalConstants, setGlobalConstatns } = useGlobalConstantsContext();
    const { user, config } = globalConstants;
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });
    const { setToast } = useToastResultContext();

    // server-side error
    const [ajaxErrors, setAjaxErrors] = useState<LaravelFormError>({});

    const profileImage = useRef<HTMLInputElement | null>(null);
    const [profileError, setProfileError] = useState<string[]>([])
    const { fileBuffer: imagePreview, readFileBuffer: readImagePreview } = useFileRead("image", config);
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setAjaxErrors({});
        const formData = new FormData();
        formData.append('_method', 'patch');
        if (uploadFile) formData.append('profile_image', uploadFile);
        Object.entries(data).forEach(entryset => formData.append(entryset[0], entryset[1]));
        try {
            const resp = await axios.post(route('profile.update'), formData);
            const user = resp.data.user as User;
            Util.castDates(user);
            setGlobalConstatns({ ...globalConstants, user});
            setData(user);
            setToast(ToastResult("ユーザー情報を登録しました。"));
        } catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response!.data.errors) {
                    setAjaxErrors(e.response!.data.errors);
                } else if (e.response!.data.message) {
                    setAjaxErrors({ message: [e.response!.data.message] });
                }
            }
        }

        if (profileImage.current) profileImage.current.value = "";
    };

    const onChangeProfileImage = ({ target: { files } }: ChangeEvent<HTMLInputElement>) => {
        setProfileError([]);
        try {
            readImagePreview(files);
            if (files) setUploadFile(files[0]);
        } catch (result) {
            const errors: string[] = [];
            Object.values((result as FileValidateResult).message).forEach((m) => errors.push(...m))
            setProfileError(errors)
        }
    }

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>
            </header>
            <CAlert color="danger" hidden={Object.keys(ajaxErrors).length === 0}>
                {Object.entries(ajaxErrors).map(([key, value]) =>
                    <ErrorMessage errors={value} key={key} />
                )}
            </CAlert>
            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <ErrorMessage errors={ajaxErrors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <ErrorMessage errors={ajaxErrors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            メールアドレスの実在チェックが未完了です。
                            <Link
                                href={route('verification.notice')}
                                method="get"
                                as="button"
                                target="_blank"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                ここをクリックして確認メールを送信してください。
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div>
                    <InputLabel htmlFor="profileImage" value="プロフィール画像(JPEG/PNG/GIF)" />
                    {imagePreview || user.profile_image_url ?
                        <div className="card w-1/2 p-2 mb-2">
                            <img className="card-img-top" src={imagePreview ? URL.createObjectURL(imagePreview) : user.profile_image_url} alt="プロフィール画像" />
                        </div>
                        : ""}
                    <CFormInput type="file" id="profileImage" accept="image/*" onChange={onChangeProfileImage} ref={profileImage}
                        className="p-2 border-1 border-b-gray-300 focus:ring-2 focus:outline-none focus:ring-indigo-500 focus:ring-offset-2" />
                    {profileError.map((error, i) =>
                        <InputError className="mt-2" message={error} key={i} />
                    )}
                    <ErrorMessage errors={ajaxErrors.profile_image} />
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
        </section>
    );
}
