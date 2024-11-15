import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { GlobalConstantsProvider, GlobalConstantsType } from '@/Contexts/GlobalConstants';
import { Head, usePage } from '@inertiajs/react';
import BaseLoading from '@/Components/Baseloading';
import { useState } from 'react';
import { CookiesProvider } from 'react-cookie';

const Default = ({
    ADMIN_PATH,
    config,
    roles,
}: GlobalConstantsType
) => {

    const globalConstants: GlobalConstantsType = {
        ADMIN_PATH: ADMIN_PATH,
        config: config,
        roles: roles,
    }

    const [loading, setLoading] = useState<boolean>(true);

    (async () => {
        await fetch(route('sanctum.csrf-cookie'))
        setLoading(false)
    })()

    const wrapperStyle = {
        width: "100%",
        height: "100%",
        overflow: "hidden",
    }

    return (
        <GlobalConstantsProvider defaultValue={globalConstants}>
            <CookiesProvider>
                {loading ? <BaseLoading active={true} wrapper={wrapperStyle} fadeSpeed={100}></BaseLoading> :
                    <>
                        <Head title="CoreUI Adminstration Panel" />
                        <AuthenticatedLayout />
                    </>
                }
            </CookiesProvider>
        </GlobalConstantsProvider>
    );
}
export default Default
