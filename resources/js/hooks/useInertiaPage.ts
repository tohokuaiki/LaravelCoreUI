import { usePage } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';


export function usePathname(): string {
    return usePage().url.split('?')[0];
}


export function useSearchParams(): [
    URLSearchParams,
    (params: URLSearchParams) => void
] {
    const { url } = usePage();

    const queryString = url.includes('?') ? url.split('?')[1] : '';
    const searchParams = useMemo(() => new URLSearchParams(queryString), [queryString]);

    const pathname = url.split('?')[0];

    const setSearchParams = useCallback((params: URLSearchParams) => {
        const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
        window.history.replaceState(null, '', newUrl);
    }, [pathname]);

    return [searchParams, setSearchParams];
}
