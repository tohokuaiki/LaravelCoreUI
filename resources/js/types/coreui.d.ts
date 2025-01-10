export type RouteProp = {
    path: string;
    name: string;
    element: LazyExoticComponent<() => ReactNode>
    exact?: boolean;
}
