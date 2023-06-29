/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type ColumnDef } from '@tanstack/react-table'
import { type Class } from '@/types/class'
import { Checkbox } from '../../../components/ui/checkbox'
import { DataTableColumnHeader } from '../../../components/table/data-table-column-header'

export const templateClassesColumns: Array<ColumnDef<Class>> = [
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
        accessorKey: 'characteristics',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Characteristics" />
        ),
        cell: ({ row }) => {
            const characteristics = row.original.characteristics
                .map((c) => {
                    if ('name' in c) {
                        return c.name
                    }
                    return c
                })
                .join(', ')

            const chars =
                characteristics.length > 50
                    ? `${characteristics.slice(0, 50)}...`
                    : characteristics

            return (
                <div className="flex flex-col">
                    <span>{chars}</span>
                </div>
            )
        },
    },
]
