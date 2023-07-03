import { useEffect, useMemo } from 'react'
import { Input } from '../../../../components/ui/input'
import { DataTableViewOptions } from '../../../../components/table/data-table-view-options'
import { DataTablePagination } from '../../../../components/table/data-table-pagination'
import { ScrollArea } from '../../../../components/ui/scroll-area'
import { DataTable } from '../../../../components/table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { Loader2 } from 'lucide-react'
import { type UseFormReturn } from 'react-hook-form'
import { Switch } from '../../../../components/ui/switch'
import { Label } from '../../../../components/ui/label'
import { useGetClassesQuery } from '../../../classes/services/classes'
import { type Class } from '@/types/class'
import { templateClassesColumns } from '../../utils/template-classes-columns'
import { type CreateTemplateDTO } from '../../slices/templateFormSlice'

export function CreateTemplateClasses({
    form,
}: {
    form: UseFormReturn<CreateTemplateDTO, unknown, undefined>
}) {
    const { data: classes, isLoading } = useGetClassesQuery()

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[500px]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        )
    }

    if (classes == null) return null

    return <ClassTable data={classes} form={form} />
}

function ClassTable({
    data,
    form,
}: {
    data: Class[]
    form: UseFormReturn<CreateTemplateDTO, unknown, undefined>
}) {
    const { table, rowSelection, globalFilter, setGlobalFilter, columns } =
        useDataTable<Class>({
            data,
            columns: templateClassesColumns,
        })

    // Compute selectedRows with useMemo
    const selectedRows: Array<{ id: number }> = useMemo(() => {
        if (Object.values(rowSelection).length === 0) {
            return []
        }

        return table
            .getSelectedRowModel()
            .rows.map((row) => ({ id: row.original.id }))
    }, [rowSelection, table])

    // Update form value with useEffect
    useEffect(() => {
        form.setValue('classImplementations', selectedRows)
    }, [form, selectedRows])

    // set rowSelection with useEffect
    const rowsIndexObj = useMemo(() => {
        const classImplementations = form.getValues('classImplementations')
        if (classImplementations.length === 0) return {}

        const selectedRows = classImplementations.map((c) => c.id)

        const checkRows = table.getCoreRowModel().rows.filter((row) => {
            return selectedRows.includes(row.original.id)
        })

        const getRowIndex = (rowId: string) => {
            const row = table.getRow(rowId)
            return row.index
        }

        const rowsIndex = checkRows.map((row) => getRowIndex(row.id))

        return rowsIndex
            .map((index) => ({ [index]: true }))
            .reduce((acc, cur) => {
                return { ...acc, ...cur }
            }, {})
    }, [form, table])

    // Select rows with useEffect
    useEffect(() => {
        if (Object.keys(rowsIndexObj).length > 0) {
            table.setRowSelection(rowsIndexObj)
        }
    }, [table, rowsIndexObj])

    const handleFilterChange = (value: boolean | string) => {
        if (typeof value === 'boolean') {
            setGlobalFilter((filter) => ({ ...filter, showSelected: value }))
        } else {
            setGlobalFilter((filter) => ({ ...filter, searchTerm: value }))
        }
    }

    return (
        <div className="flex flex-col gap-10">
            <div className="flex justify-between">
                <div className="flex items-center gap-4">
                    <Input
                        value={globalFilter.searchTerm}
                        onChange={(e) => {
                            setGlobalFilter((prev) => ({
                                ...prev,
                                searchTerm: e.target.value,
                            }))
                        }}
                        placeholder="Search..."
                        className="w-96"
                    />

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="show-selected"
                            onCheckedChange={(value) => {
                                handleFilterChange(value)
                            }}
                            checked={globalFilter.showSelected}
                        />
                        <Label htmlFor="show-selected">Show Selection</Label>
                    </div>
                </div>

                <DataTableViewOptions table={table} />
            </div>

            <ScrollArea className="h-[500px]">
                <DataTable table={table} columns={columns} />
            </ScrollArea>

            <DataTablePagination table={table} />
        </div>
    )
}
