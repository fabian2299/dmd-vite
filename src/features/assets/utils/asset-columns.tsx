/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type ColumnDef } from '@tanstack/react-table'
import { type AssetWithTemplate } from '../../../shared/types/asset'
import { Checkbox } from '../../../shared/components/ui/checkbox'
import { DataTableColumnHeader } from '../../../shared/components/table/data-table-column-header'

export const assetColumns: Array<ColumnDef<AssetWithTemplate>> = [
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
            <DataTableColumnHeader column={column} title="Asset Name" />
        ),
    },

    {
        accessorKey: 'shortDescription',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Short Description" />
        ),
    },

    {
        accessorKey: 'templateName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Template" />
        ),
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ cell }) => {
            const assetId = cell.row.original.id.toString()
            return 'hola'

            //   return <TemplateTableActions templateId={templateId} />
        },
    },
]
