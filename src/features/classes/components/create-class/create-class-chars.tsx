import { useEffect } from 'react'
import { type Characteristic } from '@/types/characteristic'
import { Input } from '../../../../components/ui/input'
import { DataTableViewOptions } from '../../../../components/table/data-table-view-options'
import { DataTablePagination } from '../../../../components/table/data-table-pagination'
import { ScrollArea } from '../../../../components/ui/scroll-area'
import { DataTable } from '../../../../components/table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { classCharColumns } from '../../utils/class-char-columns'
import { useGetCharsQuery } from '../../../chars/services/chars'
import { Loader2 } from 'lucide-react'
import { type CreateClassDTO } from '../../slices/classFormSlice'
import { type UseFormReturn } from 'react-hook-form'
import { Label } from '../../../../components/ui/label'
import { Switch } from '../../../../components/ui/switch'

export function CreateClassChars({
    form,
}: {
    form: UseFormReturn<CreateClassDTO, unknown, undefined>
}) {
    const { data: chars, isLoading } = useGetCharsQuery()

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[500px]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        )
    }

    if (chars == null) return null

    return <CharTable data={chars} form={form} />
}

function CharTable({
    data,
    form,
}: {
    data: Characteristic[]
    form: UseFormReturn<CreateClassDTO, unknown, undefined>
}) {
    const { table, rowSelection, globalFilter, setGlobalFilter, columns } =
        useDataTable<Characteristic>({
            data,
            columns: classCharColumns,
        })

    useEffect(() => {
        if (Object.values(rowSelection).length === 0) return

        const selectedRows = table
            .getSelectedRowModel()
            .rows.map((row) => row.original.id.toString())

        form.setValue('charIds', selectedRows)
    }, [form, rowSelection, table])

    useEffect(() => {
        const charIds = form.getValues('charIds')
        if (charIds.length === 0) return

        const selectedRows = charIds.map((id) => id.toString())

        const checkRows = table.getCoreRowModel().rows.filter((row) => {
            return selectedRows
                .map((id) => id)
                .includes(row.original.id.toString())
        })

        const getRowIndex = (rowId: string) => {
            const row = table.getRow(rowId)
            return row.index
        }

        const rowsIndex = checkRows.map((row) => getRowIndex(row.id))

        const rowsIndexObj = rowsIndex
            .map((index) => ({ [index]: true }))
            .reduce((acc, cur) => {
                return { ...acc, ...cur }
            }, {})

        table.setRowSelection(rowsIndexObj)
    }, [form, table])

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
