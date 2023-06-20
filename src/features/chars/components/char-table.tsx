import { DataTable } from '../../../shared/components/table/data-table'
import { DataTablePagination } from '../../../shared/components/table/data-table-pagination'
import { DataTableViewOptions } from '../../../shared/components/table/data-table-view-options'
import { Input } from '../../../shared/components/ui/input'
import { useDataTable } from '../../../shared/hooks/use-data-table'
import { Characteristic } from '../../../shared/types/characteristic'
import { charColumns } from '../utils/char-columns'
import { CreateChar } from './create-char'

export function CharTable({ data }: { data: Characteristic[] }) {
    const { globalFilter, setGlobalFilter, table } =
        useDataTable<Characteristic>({ data, columns: charColumns })

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
                    <CreateChar />

                    <DataTableViewOptions table={table} />
                </div>
            </div>

            <div className="max-h-[780px] overflow-y-auto ">
                <DataTable table={table} columns={charColumns} />
            </div>

            <DataTablePagination table={table} />
        </div>
    )
}
