import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { cibMicrosoft } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CAlert, CAlertHeading, CCallout, CForm } from '@coreui/react';
import { Head } from '@inertiajs/react';

export default function Login({
    errors = {}
}: {
    errors?: Record<string, string>;
}) {

    return <GuestLayout>
        <Head title="Microsoftアカウントによるログイン" />
        <p>以下のリンクボタンからMicrosoftアカウントでサインインする画面に移動してください。</p>
        {Object.keys(errors).length > 0 && <CAlert color="danger" className='my-2'>
            <CAlertHeading as="h4">認証に失敗しました。</CAlertHeading>
            <hr className='my-2'/>
            <ul>{Object.entries(errors).map(([key, value]) => <li key={key}><b className='mr-2'>{key}:</b>{value}</li>)}</ul>
        </CAlert>}
        <CForm action={route('azure.redirect')} className="text-center mt-3" method='GET'>
            <PrimaryButton style={{ textTransform: "unset" }} type="submit">
                <CIcon icon={cibMicrosoft} className='mr-2' />Microsoftアカウントで認証する
            </PrimaryButton>
        </CForm>
        <CCallout color="warning">
            サインインするMicrosoftアカウントが、組織の社員として登録されていないと認証されません。
        </CCallout>
    </GuestLayout >
}
