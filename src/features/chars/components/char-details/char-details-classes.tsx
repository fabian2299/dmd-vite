import { DataTable } from '../../../../shared/components/table/data-table'
import { DataTablePagination } from '../../../../shared/components/table/data-table-pagination'
import { DataTableViewOptions } from '../../../../shared/components/table/data-table-view-options'
import { Input } from '../../../../shared/components/ui/input'
import { useDataTable } from '../../../../shared/hooks/use-data-table'
import { type ClassImplementation } from '../../../../shared/types/characteristic'
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

            <div className="max-h-[780px] overflow-y-auto ">
                <DataTable table={table} columns={charClassColumns} />
            </div>

            <DataTablePagination table={table} />
        </div>
    )
}
