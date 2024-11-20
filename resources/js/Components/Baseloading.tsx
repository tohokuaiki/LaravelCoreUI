import { ReactNode, useState } from 'react';
import { LoadingOverlay } from '@achmadk/react-loading-overlay';

type StyleKeys = 'wrapper' | 'overlay' | 'content' | 'spinner';

export default function BaseLoading(props: {
    active: boolean;
    children?: ReactNode;
    fadeSpeed?: number;
    overlay?: () => void;
    spinner?: () => void;
    wrapper?: { [key: string]: string };
}) {

    const fadeSpeed = props.fadeSpeed ?? 1000

    const overlay: any = (base: any) => {
        return ({
            ...base,
            background: 'rgb(230 230 230 / 50%)',
            position: 'fixed',
            zIndex: '99999'
        });
    }

    const spinner: any = (base: any) => {
        return {
            ...base,
            width: '100px',
            '& svg circle': {
                stroke: 'rgba(10, 10, 10, 0.7)'
            }
        }
    }

    const wrapper = {
        width: '200px',
        height: '200px',
        overflow: 'hidden',
    }

    return <LoadingOverlay
        active={props.active}
        fadeSpeed={fadeSpeed}
        styles={{
            overlay: props.overlay || overlay,
            spinner: props.spinner || spinner,
            wrapper: props.wrapper || wrapper,
        }}
    >{props.children}</LoadingOverlay>
}
