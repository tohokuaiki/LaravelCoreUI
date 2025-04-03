import { HeaderContext, PaginationState, SortDirection, SortingState, Table } from "@tanstack/react-table";
import { CSSProperties, Dispatch, ReactElement, ReactNode, SetStateAction } from "react";



const sortSvg = (sort: SortDirection): ReactNode => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            style={{ display: "inline" }}
        >
            {sort === "asc" ? (
                <path d="M7 10l5 5 5-5z" />
            ) : (
                <path d="M7 14l5-5 5 5z" />
            )}
            <path d="M0 0h24v24H0z" fill="none" />
        </svg>
    );
}

const sortDirSvg = (sort: SortDirection, isTarget: boolean): ReactNode => {

    const upperColor: string = isTarget && sort == "desc" ? "#000" : "#ccc";
    const lowerColor: string = isTarget && sort == "asc" ? "#000" : "#ccc";

    const style: CSSProperties = {
        display: "inline",
        height: "1em",
        paddingLeft: "0.5em"
    };

    return <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 12 12" style={style}>
        <path fill="none" stroke={upperColor} strokeLinecap="round" d="M2.5 4L5.6.9c.2-.2.5-.2.7 0L9.5 4" />
        <path fill="none" stroke={lowerColor} strokeLinecap="round" d="M2.5 8l3.1 3.1c.2.2.5.2.7 0L9.5 8" />
    </svg>;
}

export function TanStackSortingButton<T, TData>(label: string, setSorting: Dispatch<SetStateAction<SortingState>>)
    : ((header: HeaderContext<T, TData>) => void) {

    const button = (header: HeaderContext<T, TData>) => {
        const { column } = header;
        const isTarget: boolean = column.getIsSorted() !== false;
        const sortDir: SortDirection = isTarget ? (column.getIsSorted() === "desc" ? "asc" : "desc") : "desc";

        return (
            <button className="pl-0"
                onClick={() => setSorting([{ id: column.id, desc: sortDir === "desc" }])}>
                {label}
                {sortDirSvg(sortDir, isTarget)}
            </button>
        );
    };
    return button;
};

export function TanStackPagination<T>({ table, pageWidth = 3, className = "", setPagination, onClick = () => { } }:
    {
        table: Table<T>;
        pageWidth?: number;
        className?: string;
        setPagination: Dispatch<SetStateAction<PaginationState>>;
        onClick?: () => void;
    }

): ReactElement {

    const currentPage: number = table.getState().pagination.pageIndex;
    const totalPage: number = table.getPageCount();

    return totalPage === 1 ? <></> :
        <ul className={`page pagination justify-center ${className}`}>
            <li className={`page-item ${table.getCanPreviousPage() ? '' : 'disabled'}`}>
                <button
                    className="page-link"
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => {
                        setPagination((prev) => ({
                            ...prev,
                            pageIndex: 0
                        }))
                        onClick();
                    }}
                >
                    &laquo;
                </button>
            </li>
            <li className={`page-item ${table.getCanPreviousPage() ? '' : 'disabled'}`}>
                <button
                    className="page-link"
                    onClick={() => {
                        setPagination((prev) => ({
                            ...prev,
                            pageIndex: prev.pageIndex - 1
                        }))
                        onClick();
                    }}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
            </li>
            {currentPage - pageWidth > 0 ? <li className="page-jump-prev">
                <button
                    className="page-item-link"
                    onClick={() => {
                        setPagination((prev) => ({
                            ...prev,
                            pageIndex: currentPage - pageWidth - 1
                        }))
                        onClick();
                    }}
                ></button>
            </li> : ''}
            {table.getPageOptions().map((page) => {
                return (
                    Math.abs(page - currentPage) > pageWidth ? '' :
                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => {
                                    setPagination((prev) => ({
                                        ...prev,
                                        pageIndex: page
                                    }))
                                    onClick();
                                }}
                                disabled={currentPage === page}
                            >{page + 1}</button>
                        </li>)
            })}
            {totalPage - currentPage - 1 > pageWidth ? <li className="page-jump-next">
                <button
                    className="page-item-link"
                    onClick={() => {
                        setPagination((prev) => ({
                            ...prev,
                            pageIndex: currentPage + pageWidth + 1
                        }))
                        onClick();
                    }}
                ></button>
            </li> : ''}
            <li className={`page-item ${table.getCanNextPage() ? '' : 'disabled'}`}>
                <button
                    className="page-link"
                    onClick={() => {
                        setPagination((prev) => ({
                            ...prev,
                            pageIndex: prev.pageIndex + 1
                        }))
                        onClick();
                    }}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
            </li>
            <li className={`page-item ${table.getCanNextPage() ? '' : 'disabled'}`}>
                <button
                    className="page-link"
                    onClick={() => {
                        setPagination((prev) => ({
                            ...prev,
                            pageIndex: table.getPageCount() - 1
                        }))
                        onClick();
                    }}
                    disabled={!table.getCanNextPage()}
                >
                    &raquo;
                </button>
            </li>
        </ul>
}
