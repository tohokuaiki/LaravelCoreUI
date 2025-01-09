import { Column, Header, HeaderContext, SortDirection, Table } from "@tanstack/react-table";
import { ReactElement, ReactNode } from "react";



const sortSvg = (sort: SortDirection): ReactNode => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            style={{ display: "inline" }}
        >
            {sort === "desc" ? (
                <path d="M7 10l5 5 5-5z" />
            ) : (
                <path d="M7 14l5-5 5 5z" />
            )}
            <path d="M0 0h24v24H0z" fill="none" />
        </svg>
    );
}

export function tanStackSortableHeader<T>(label: string): (header: HeaderContext<T, string | number>) => void {

    const sortHandler = (column: Column<T, string | number>) => {
        if (column.getIsSorted() === "desc") {
            column.toggleSorting(false);
        }
        else {
            column.toggleSorting(true); // first click is DESC
        }
    }

    const SortableHeader = (header: HeaderContext<T, string | number>) => {


        const { column } = header;

        const onClick = () => {
            sortHandler(column);
        }
        const order: SortDirection | false = column.getIsSorted();

        return <div onClick={onClick} style={{ cursor: "pointer" }}>
            {label}
            {order === false ? "" : sortSvg(order)}
        </div>
    }
    return SortableHeader;
}


export function TanStackPagination<T>({ table, pageWidth = 3, className = "", onClick = () => void (0) }:
    {
        table: Table<T>;
        pageWidth?: number;
        className?: string;
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
                    onClick={() => { table.firstPage(); onClick(); }}
                    disabled={!table.getCanPreviousPage()}
                >
                    &laquo;
                </button>
            </li>
            <li className={`page-item ${table.getCanPreviousPage() ? '' : 'disabled'}`}>
                <button
                    className="page-link"
                    onClick={() => { table.previousPage(); onClick(); }}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
            </li>
            {currentPage - pageWidth > 0 ? <li className="page-jump-prev">
                <button
                    className="page-item-link"
                    onClick={() => { table.setPageIndex(currentPage - pageWidth - 1); onClick(); }}
                ></button>
            </li> : ''}
            {table.getPageOptions().map((page) => {
                return (
                    Math.abs(page - currentPage) > pageWidth ? '' :
                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => { table.setPageIndex(page);; onClick(); }}
                                disabled={currentPage === page}
                            >{page + 1}</button>
                        </li>)
            })}
            {totalPage - currentPage - 1 > pageWidth ? <li className="page-jump-next">
                <button
                    className="page-item-link"
                    onClick={() => { table.setPageIndex(currentPage + pageWidth + 1); onClick(); }}
                ></button>
            </li> : ''}
            <li className={`page-item ${table.getCanNextPage() ? '' : 'disabled'}`}>
                <button
                    className="page-link"
                    onClick={() => { table.nextPage(); onClick(); }}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
            </li>
            <li className={`page-item ${table.getCanNextPage() ? '' : 'disabled'}`}>
                <button
                    className="page-link"
                    onClick={() => { table.lastPage(); onClick(); }}
                    disabled={!table.getCanNextPage()}
                >
                    &raquo;
                </button>
            </li>
        </ul>
}