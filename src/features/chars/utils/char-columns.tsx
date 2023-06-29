/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '../../../components/ui/checkbox'
import { type Characteristic } from '@/types/characteristic'
import { DataTableColumnHeader } from '../../../components/table/data-table-column-header'
import { CharTableActions } from '../components/char-table/char-table-actions'

export const charColumns: Array<ColumnDef<Characteristic>> = [
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
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ cell }) => {
            const charId = cell.row.original.id.toString()

            return <CharTableActions charId={charId} />
        },
    },
]
