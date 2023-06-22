/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type ColumnDef } from '@tanstack/react-table'
import { type Characteristic } from '../../../shared/types/characteristic'
import { Checkbox } from '../../../shared/components/ui/checkbox'
import { DataTableColumnHeader } from '../../../shared/components/table/data-table-column-header'

export const classCharColumns: Array<ColumnDef<Characteristic>> = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => {
                    table.toggleAllPageRowsSelected(!!value)
                }}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => {
                    row.toggleSelected(!!value)
                }}
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
        accessorKey: 'type',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" />
        ),
    },

    {
        accessorKey: 'code',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="GoAigua Code" />
        ),
    },
]
