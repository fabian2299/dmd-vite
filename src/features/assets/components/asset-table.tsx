import React, { useState } from 'react'
import { useMainHierarchyFilterContext } from '../../../shared/context/main-hierarchy-items-filter-context'
import { useAssetFilters } from '../hooks/use-asset-filters'
import { useGetAssets } from '../hooks/use-get-assets'
import { type AssetWithTemplate } from '../../../shared/types/asset'
import { Input } from '../../../shared/components/ui/input'
import { Button } from '../../../shared/components/ui/button'
import { useAssetDataTable } from '../../../shared/hooks/use-data-table'
import { assetColumns } from '../utils/asset-columns'
import { DataTableViewOptions } from '../../../shared/components/table/data-table-view-options'
import { DataTable } from '../../../shared/components/table/data-table'
import { DataTablePagination } from '../../../shared/components/table/data-table-pagination'
import { ScrollArea } from '../../../shared/components/ui/scroll-area'
import { type Template } from '../../../shared/types/template'
import { Loader2 } from 'lucide-react'
import debounce from 'lodash.debounce'
import { TemplateFilter } from './template-filter'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '../../../shared/components/ui/tabs'

export function AssetTableContainer({ templates }: { templates: Template[] }) {
    const { selectedHierarchyItems } = useMainHierarchyFilterContext()

    const { assetFilters, updateFilter } = useAssetFilters({
        selectedItems: selectedHierarchyItems,
    })

    const [{ pageIndex, pageSize }, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 50,
    })

    const pagination = React.useMemo(
        () => ({
            page: pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    const { isLoadingAssets, assets, count } = useGetAssets({
        filters: assetFilters,
        pagination,
    })

    // set page to 1 when filters change
    React.useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    }, [assetFilters])

    const assetsWithTemplates: AssetWithTemplate[] = React.useMemo(() => {
        return assets.map((asset) => {
            const template = templates?.find(
                (temp) => temp.id === asset.templateId
            )
            return {
                ...asset,
                templateName: template?.name,
            }
        })
    }, [assets, templates])

    const [shadowFilters, setShadowFilters] = useState({
        name: '',
        shortDescription: '',
        templateID: '',
    })

    const debouncedFilterUpdate = debounce((key, value) => {
        updateFilter(key, value)
    }, 500)

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setShadowFilters((prev) => ({ ...prev, [name]: value }))
        debouncedFilterUpdate(name, value)
    }

    const handleSelectTemplate = (templateId: string) => {
        setShadowFilters((prev) => ({ ...prev, templateID: templateId }))
        updateFilter('templateID', templateId)
    }

    const clearFilters = () => {
        setShadowFilters({
            name: '',
            shortDescription: '',
            templateID: '',
        })
        updateFilter('name', '')
        updateFilter('shortDescription', '')
        updateFilter('templateID', '')
    }

    return (
        <div>
            <div className="flex justify-between">
                <div className="flex items-center gap-4 ">
                    <Input
                        placeholder="Search by name..."
                        onChange={handleFilterChange}
                        name="name"
                        className="w-64"
                        value={shadowFilters.name}
                    />

                    <Input
                        placeholder="Search by short description..."
                        onChange={handleFilterChange}
                        name="shortDescription"
                        className="w-64"
                        value={shadowFilters.shortDescription}
                    />

                    <div className="">
                        <TemplateFilter
                            templates={templates}
                            onSelectTemplate={handleSelectTemplate}
                            selectedTemplateId={shadowFilters.templateID}
                        />
                    </div>

                    <Button onClick={clearFilters} className="">
                        Clear Filters
                    </Button>
                </div>

                <div className="flex items-center gap-8">
                    <p>More actions</p>
                    <Button>Create Asset</Button>
                </div>
            </div>

            <AssetTable
                data={assetsWithTemplates}
                pending={isLoadingAssets}
                setPagination={setPagination}
                pageIndex={pageIndex}
                pageSize={pageSize}
                count={count}
            />
        </div>
    )
}

function AssetTable({
    data,
    pending,
    pageIndex,
    pageSize,
    count,
    setPagination,
}: {
    data: AssetWithTemplate[]
    pending: boolean
    pageIndex: number
    pageSize: number
    count: number
    setPagination: React.Dispatch<
        React.SetStateAction<{
            pageIndex: number
            pageSize: number
        }>
    >
}) {
    const { table } = useAssetDataTable({
        data,
        columns: assetColumns,
        count,
        setPagination,
        pageIndex,
        pageSize,
    })

    return (
        <div className="mt-10">
            <Tabs defaultValue="table">
                <TabsList className="grid w-1/3 grid-cols-2">
                    <TabsTrigger value="table">Table</TabsTrigger>
                    <TabsTrigger value="map">Map</TabsTrigger>
                </TabsList>

                <TabsContent value="table">
                    <div className="mt-10 flex flex-col gap-10 ">
                        <div className="self-start">
                            <DataTableViewOptions table={table} />
                        </div>

                        <ScrollArea className="h-[600px]">
                            {pending ? (
                                <div className="flex justify-center items-center h-[600px]">
                                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                </div>
                            ) : (
                                <DataTable
                                    table={table}
                                    columns={assetColumns}
                                />
                            )}
                        </ScrollArea>

                        <DataTablePagination table={table} />
                    </div>
                </TabsContent>

                <TabsContent value="map">
                    <div className="mt-10">
                        <p>map</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
