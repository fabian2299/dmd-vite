/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '../../../components/ui/checkbox'
import { DataTableColumnHeader } from '../../../components/table/data-table-column-header'
import { type Template } from '@/types/template'
import { TemplateTableActions } from '../components/template-table/template-table-actions'

export const templateColumns: Array<ColumnDef<Template>> = [
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
        accessorKey: 'id',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID" />
        ),
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Template Name" />
        ),
    },
    {
        accessorKey: 'shortDescription',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Short Description" />
        ),
    },
    {
        accessorKey: 'classImplementations',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Classes" />
        ),
        cell: ({ cell }) => {
            const classImplementations = cell.row.original.classImplementations
            const classNames = classImplementations
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((c: any) => c.name)
                .join(', ')

            return (
                <span>
                    {classNames.length > 50
                        ? classNames.substring(0, 50) + '...'
                        : classNames}
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
            const templateId = cell.row.original.id.toString()

            return <TemplateTableActions templateId={templateId} />
        },
    },
]
