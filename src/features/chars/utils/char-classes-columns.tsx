import { ColumnDef } from '@tanstack/react-table'
import { ClassImplementation } from '../../../shared/types/characteristic'
import { Checkbox } from '../../../shared/components/ui/checkbox'
import { DataTableColumnHeader } from '../../../shared/components/table/data-table-column-header'

export const charClassColumns: ColumnDef<ClassImplementation>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
    },
    {
        accessorKey: 'shortDescription',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Short Description" />
        ),
    },
    {
        accessorKey: 'origen',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Origen" />
        ),
    },
]
