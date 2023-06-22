import { useNavigate, useSearchParams } from 'react-router-dom'
import { type Class } from '../../../../shared/types/class'
import { useModalContext } from '../../../../shared/context/modal-context'
import { useCallback, useEffect } from 'react'
import { Input } from '../../../../shared/components/ui/input'
import { CreateClass } from '../create-class/create-class'
import { DataTableViewOptions } from '../../../../shared/components/table/data-table-view-options'
import { ScrollArea } from '../../../../shared/components/ui/scroll-area'
import { DataTable } from '../../../../shared/components/table/data-table'
import { DataTablePagination } from '../../../../shared/components/table/data-table-pagination'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent } from '../../../../shared/components/ui/dialog'
import { classColumns } from '../../utils/class-columns'
import { useDataTable } from '../../../../shared/hooks/use-data-table'
import { ClassDetailsContainer } from '../class-details/class-details-container'

export function ClassTable({
    data,
    isFetching,
}: {
    data: Class[]
    isFetching: boolean
}) {
    // outside state/functions
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { globalFilter, setGlobalFilter, table } = useDataTable<Class>({
        data,
        columns: classColumns,
    })
    const { isModalOpen, closeModal, openModal } = useModalContext()

    // inside state/functions
    const urlClassId = searchParams.get('classId') ?? ''

    const handleChange = useCallback(
        (open: boolean) => {
            if (!open) {
                navigate(`/resources/classes`)
                closeModal()
                return
            }
            openModal()
        },
        [closeModal, navigate, openModal]
    )

    useEffect(() => {
        if (urlClassId.length > 0) {
            handleChange(true)
        }
    }, [handleChange, urlClassId])

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
                        <CreateClass />

                        <DataTableViewOptions table={table} />
                    </div>
                </div>

                <ScrollArea className="h-[780px] relative">
                    <DataTable table={table} columns={classColumns} />

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
                    <ClassDetailsContainer classId={urlClassId} />
                </DialogContent>
            </Dialog>
        </>
    )
}
