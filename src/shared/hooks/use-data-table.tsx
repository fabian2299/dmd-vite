import React from 'react'
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { fuzzyFilter } from '../utils/utils'

interface DataTableProps<T> {
    data: T[]
    columns: ColumnDef<T, any>[]
}

export function useDataTable<T>({ data, columns }: DataTableProps<T>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [globalFilter, setGlobalFilter] = React.useState({
        searchTerm: '',
        showSelected: false,
    })

    const table = useReactTable<T>({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
    })

    return {
        table,
        rowSelection,
        globalFilter,
        columns,
        setGlobalFilter,
    }
}

interface AssetDataTableProps<T> {
    data: T[]
    columns: ColumnDef<T, any>[]
    setPagination: any
    pageIndex: number
    pageSize: number
    count: number
}

export function useAssetDataTable<T>({
    data,
    columns,

    setPagination,
    pageIndex,
    pageSize,
    count,
}: AssetDataTableProps<T>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [globalFilter, setGlobalFilter] = React.useState({
        searchTerm: '',
        showSelected: false,
    })

    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        pageCount: Math.ceil(count / pageSize),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
            pagination: {
                pageIndex,
                pageSize,
            },
        },
        globalFilterFn: fuzzyFilter,
        onPaginationChange: setPagination,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
    })

    return {
        table,
        rowSelection,
        globalFilter,
        columns,
        setGlobalFilter,
    }
}
