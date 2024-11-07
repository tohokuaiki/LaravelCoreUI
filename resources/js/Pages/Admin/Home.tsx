import { CCard, CCardHeader, CCardBody } from '@coreui/react';
import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';

export default function Home(): ReactNode {
    return (
        <>
            <Head title="Dashboard" />
            <CCard className="mb-4">
                <CCardHeader>
                    Top page of the management screen
                </CCardHeader>
                <CCardBody>
                    You can view this page when you are logged in.
                </CCardBody>
            </CCard>
        </>
    );
}
