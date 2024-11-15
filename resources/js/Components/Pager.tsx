import { CPagination } from "@coreui/react";
import Pagination, { PaginationProps } from "rc-pagination";
import PaginationLocale from "rc-pagination/lib/locale/ja_JP";
import React from "react";
import { ReactElement, ReactNode } from "react";


export default function MyRcPager({
    defaultCurrent, current, onChange, pageSize, total, ...props
}: PaginationProps): ReactNode {


    const itemRender = (page: number, type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next', element: ReactNode) => {
        switch (type) {
            case 'prev':
            case 'next':
                return <a className='page-link'>{element}</a>;
            case 'page':
                return React.cloneElement(element as ReactElement, { className: "page-link" })
        }
        return element;
    }

    return (
        <CPagination align="center" aria-label="Page navigation" className="my-2">
            <Pagination
                defaultCurrent={defaultCurrent}
                prefixCls="page"
                current={current}
                total={total}
                onChange={onChange}
                pageSize={pageSize}
                hideOnSinglePage={true}
                className='pagination'
                locale={PaginationLocale}
                prevIcon={<span>&lt;</span>}
                nextIcon={<span>&gt;</span>}
                itemRender={itemRender}
            />
        </CPagination>

    )
}