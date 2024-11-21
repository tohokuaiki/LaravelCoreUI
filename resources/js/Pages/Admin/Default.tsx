import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { GlobalConstantsProvider, GlobalConstantsType } from '@/Contexts/GlobalConstants';
import { Head, usePage } from '@inertiajs/react';
import BaseLoading from '@/Components/Baseloading';
import { useEffect, useState } from 'react';
import { CookiesProvider } from 'react-cookie';
import axios from 'axios';
import { ToastResultProvider } from '@/Contexts/ToastResultsContext';

const Default = ({
    ADMIN_PATH,
    config,
    mustVerifyEmail,
    roles,
}: GlobalConstantsType
) => {

    const user = usePage().props.auth.user;
    const globalConstants: GlobalConstantsType = {
        user, ADMIN_PATH, config, mustVerifyEmail, roles,
    }

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                setLoading(true);
                return config;
            },
            (error) => {
                setLoading(false);
                return Promise.reject(error);
            }
        );

        const responseInterceptor = axios.interceptors.response.use(
            (response) => {
                setLoading(false);
                return response;
            },
            (error) => {
                setLoading(false);
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

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
                <BaseLoading active={loading} wrapper={wrapperStyle} fadeSpeed={100}>
                    <>
                        <Head title="CoreUI Adminstration Panel" />
                        <ToastResultProvider defaultValue={null}>
                            <AuthenticatedLayout />
                        </ToastResultProvider>
                    </>
                </BaseLoading>
            </CookiesProvider>
        </GlobalConstantsProvider>
    );
}
export default Default
