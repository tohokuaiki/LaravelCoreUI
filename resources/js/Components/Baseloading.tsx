import { LoadingOverlay } from '@achmadk/react-loading-overlay';
import { CSSInterpolation } from '@emotion/css/create-instance';
import { CSSProperties, ReactNode } from 'react';

export default function BaseLoading(props: {
    active: boolean;
    children?: ReactNode;
    fadeSpeed?: number;
    wrapper?: { [key: string]: string };
}) {
    const fadeSpeed = props.fadeSpeed ?? 1000;

    const overlay = (base: CSSProperties): CSSInterpolation => {
        return {
            ...base,
            background: 'rgb(230 230 230 / 50%)',
            position: 'fixed',
            zIndex: '99999',
        };
    };

    const spinner = (base: CSSProperties) => {
        return {
            ...base,
            width: '100px',
            '& svg circle': {
                stroke: 'rgba(10, 10, 10, 0.7)',
            },
        };
    };

    const wrapper = {
        width: '200px',
        height: '200px',
        overflow: 'hidden',
    };

    return (
        <LoadingOverlay
            active={props.active}
            fadeSpeed={fadeSpeed}
            styles={{
                overlay,
                spinner,
                wrapper: props.wrapper || wrapper,
            }}
        >
            {props.children}
        </LoadingOverlay>
    );
}
