import { Class } from '../../../shared/types/class'
import { useDataTable } from '../../../shared/hooks/use-data-table'
import { classColumns } from '../utils/class-columns'
import { DataTableViewOptions } from '../../../shared/components/table/data-table-view-options'
import { DataTable } from '../../../shared/components/table/data-table'
import { DataTablePagination } from '../../../shared/components/table/data-table-pagination'
import { Input } from '../../../shared/components/ui/input'
import { CreateClass } from './create-class'

export function ClassTable({ data }: { data: Class[] }) {
    const { globalFilter, setGlobalFilter, table } = useDataTable<Class>({
        data,
        columns: classColumns,
    })

    return (
        <div className="flex flex-col gap-10">
            <div className="flex justify-between">
                <Input
                    value={globalFilter.searchTerm}
                    onChange={(e) =>
                        setGlobalFilter((prev) => ({
                            ...prev,
                            searchTerm: e.target.value,
                        }))
                    }
                    placeholder="Search..."
                    className="w-96"
                />
                <div className="flex items-center gap-4">
                    <CreateClass />

                    <DataTableViewOptions table={table} />
                </div>
            </div>

            <div className="max-h-[780px] overflow-y-auto ">
                <DataTable table={table} columns={classColumns} />
            </div>

            <DataTablePagination table={table} />
        </div>
    )
}
