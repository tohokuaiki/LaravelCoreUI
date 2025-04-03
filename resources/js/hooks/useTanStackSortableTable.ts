import { ColumnDef, getCoreRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, RowData, SortingState, Table, TableOptions, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function getInitialSorting(): SortingState {

    const searchParams = new URLSearchParams(window.location.search);

    const initialSorting: SortingState = [{
        id: searchParams.get('sort') || "updated_at",
        desc: !searchParams.get('order') || searchParams.get('order') === "desc"
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

export function useTanStackSortableTable<TData extends RowData, TValue>({ data, columns, state }: {
    data: TData[];
    columns: ColumnDef<TData, TValue>[];
    state: {
        pagination: PaginationState;
        sorting: SortingState;
    }
}): Table<TData> {

    const [, setSearchParams] = useSearchParams()

    const { pagination, sorting } = state;

    useEffect(() => {
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
    }, [pagination, sorting, setSearchParams])

    const table: Table<TData> = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { pagination, sorting }
    });

    return table;
}