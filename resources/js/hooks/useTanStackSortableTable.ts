import { ColumnDef, ColumnSort, getCoreRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, RowData, SortingState, Table, TableOptions, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function getInitialSorting({
    id: defaultId = "updated_at",
    desc: defaultDesc = true
}: {
    id?: string;
    desc?: boolean;
} = {}): SortingState {

    const searchParams = new URLSearchParams(window.location.search);

    const initialSorting: SortingState = [{
        id: searchParams.get('sort') || defaultId,
        desc: searchParams.get('order') ? searchParams.get('order') === "desc" : defaultDesc
    }];
    return initialSorting;
}


export function getInitialPagination(pageSize: number = 20): PaginationState {
    const searchParams = new URLSearchParams(window.location.search);
    const p: number = Number(searchParams.get('page') || "1")
    const pageIndex = p > 0 ? p - 1 : 0;
    const initalPagination: PaginationState = { pageIndex, pageSize };
    return initalPagination;
}

export function useTanStackSortableTable<TData extends RowData>({ data, columns, state,
    locationLink = true,
    manualPagination,
    pageCount
}: {
    data: TData[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnDef<TData, any>[];
    state: {
        pagination: PaginationState;
        sorting: SortingState;
    },
    locationLink?: boolean;
    manualPagination?: boolean;
    pageCount?: number;
}): Table<TData> {

    const [, setSearchParams] = useSearchParams()

    const { pagination, sorting } = state;

    useEffect(() => {
        if (locationLink !== false) {
            setSearchParams((prev) => {
                const params = new URLSearchParams(prev)
                params.set("sort", sorting[0].id)
                params.set("order", sorting[0].desc ? "desc" : "asc")
                if (pagination.pageIndex === 0) {
                    params.delete("page")
                } else {
                    params.set("page", (pagination.pageIndex + 1).toString())
                }
                return params;
            })
        }
    }, [pagination, sorting, setSearchParams, locationLink])

    const table: Table<TData> = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: manualPagination ? undefined : getSortedRowModel(),
        state: { pagination, sorting },
        manualPagination,
        pageCount
    });

    return table;
}