import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { GlobalConstantsProvider, GlobalConstantsType } from '@/Contexts/GlobalConstants';
import { Head } from '@inertiajs/react';

const Default = ({ admin_path }: {
    admin_path: string;
}) => {

    const globalConstants: GlobalConstantsType = {
        ADMIN_PATH: admin_path
    }

    return (
        <GlobalConstantsProvider defaultValue={globalConstants}>
            <Head title="CoreUI Adminstration Panel Sample" />
            <AuthenticatedLayout />
        </GlobalConstantsProvider>
    );
}
export default Default
