import { DataTable } from '../../../../components/table/data-table'
import { DataTablePagination } from '../../../../components/table/data-table-pagination'
import { DataTableViewOptions } from '../../../../components/table/data-table-view-options'
import { Input } from '../../../../components/ui/input'
import { ScrollArea } from '../../../../components/ui/scroll-area'
import { useDataTable } from '@/hooks/use-data-table'
import { type ClassImplementation } from '@/types/characteristic'
import { charClassColumns } from '../../utils/char-classes-columns'

export function CharDetailsClasses({ data }: { data: ClassImplementation[] }) {
    const { globalFilter, setGlobalFilter, table } =
        useDataTable<ClassImplementation>({ data, columns: charClassColumns })

    return (
        <div className="flex flex-col gap-10">
            <div className="flex justify-between">
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
                <div className="flex items-center gap-4">
                    <DataTableViewOptions table={table} />
                </div>
            </div>

            <ScrollArea className="h-[600px]">
                <DataTable table={table} columns={charClassColumns} />
            </ScrollArea>

            <DataTablePagination table={table} />
        </div>
    )
}
