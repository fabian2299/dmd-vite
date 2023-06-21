import { ColumnDef } from '@tanstack/react-table'
import { Class } from '../../../shared/types/class'
import { Checkbox } from '../../../shared/components/ui/checkbox'
import { DataTableColumnHeader } from '../../../shared/components/table/data-table-column-header'
import { ClassTableActions } from '../components/class-table-actions'

export const classColumns: ColumnDef<Class>[] = [
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
        accessorKey: 'characteristics',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" />
        ),
        cell: ({ cell }) => {
            const characteristics = cell.row.original.characteristics
            const charNames = characteristics
                .map((char) => char.name)
                .join(', ')

            return (
                <span>
                    {charNames.length > 50
                        ? charNames.substring(0, 50) + '...'
                        : charNames}
                </span>
            )
        },
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
            const classId = cell.row.original.id.toString()

            return <ClassTableActions classId={classId} />
        },
    },
]
