import { usePage, router } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';


export function usePathname(): string {
    return usePage().url.split('?')[0];
}


export function useSearchParams(): [
    URLSearchParams,
    (params: Record<string, any>, options?: object) => void
] {
    const { url } = usePage();

    const queryString = url.includes('?') ? url.split('?')[1] : '';
    const searchParams = useMemo(() => new URLSearchParams(queryString), [queryString]);

    const pathname = url.split('?')[0];

    const setSearchParams = useCallback(
        (params: Record<string, any>, options = {}) => {
            router.get(pathname, params, {
                preserveState: true,
                replace: true,
                ...options,
            });
        },
        [pathname]
    );

    return [searchParams, setSearchParams];
}
