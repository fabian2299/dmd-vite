import { useNavigate, useSearchParams } from 'react-router-dom'
import { type Template } from '../../../../shared/types/template'
import { useModalContext } from '../../../../shared/context/modal-context'
import { useCallback, useEffect } from 'react'
import { Input } from '../../../../shared/components/ui/input'
import { DataTableViewOptions } from '../../../../shared/components/table/data-table-view-options'
import { ScrollArea } from '../../../../shared/components/ui/scroll-area'
import { DataTable } from '../../../../shared/components/table/data-table'
import { Loader2 } from 'lucide-react'
import { DataTablePagination } from '../../../../shared/components/table/data-table-pagination'
import { useDataTable } from '../../../../shared/hooks/use-data-table'
import { templateColumns } from '../../utils/template-columns'
import { Dialog, DialogContent } from '../../../../shared/components/ui/dialog'
import { TemplateDetailsContainer } from '../template-details/template-details-container'
import { CreateTemplate } from '../create-template/create-template'

export function TemplateTable({
    data,
    isFetching,
}: {
    data: Template[]
    isFetching: boolean
}) {
    // outside state/functions
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { globalFilter, setGlobalFilter, table } = useDataTable<Template>({
        data,
        columns: templateColumns,
    })
    const { isModalOpen, closeModal, openModal } = useModalContext()

    // inside state/functions
    const urlTemplateId = searchParams.get('templateId') ?? ''

    const handleChange = useCallback(
        (open: boolean) => {
            if (!open) {
                navigate(`/resources/templates`)
                closeModal()
                return
            }
            openModal()
        },
        [closeModal, navigate, openModal]
    )

    useEffect(() => {
        if (urlTemplateId.length > 0) {
            handleChange(true)
        }
    }, [handleChange, urlTemplateId.length])

    return (
        <>
            <div className="flex flex-col gap-10">
                <div className="flex justify-between">
                    <Input
                        value={globalFilter.searchTerm}
                        onChange={(e) => {
                            setGlobalFilter((prev) => ({
                                ...prev,
                                searchTerm: e.target.value,
                            }))
                        }}
                        placeholder="Search..."
                        className="w-96"
                    />
                    <div className="flex items-center gap-4">
                        <CreateTemplate />

                        <DataTableViewOptions table={table} />
                    </div>
                </div>

                <ScrollArea className="h-[780px] relative">
                    <DataTable table={table} columns={templateColumns} />

                    {isFetching && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        </div>
                    )}
                </ScrollArea>

                <DataTablePagination table={table} />
            </div>

            <Dialog open={isModalOpen} onOpenChange={handleChange}>
                <DialogContent className="lg:max-w-5xl min-h-[70vh]">
                    <TemplateDetailsContainer templateId={urlTemplateId} />
                </DialogContent>
            </Dialog>
        </>
    )
}
