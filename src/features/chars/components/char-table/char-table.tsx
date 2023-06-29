import { DataTable } from '../../../../components/table/data-table'
import { DataTablePagination } from '../../../../components/table/data-table-pagination'
import { DataTableViewOptions } from '../../../../components/table/data-table-view-options'
import { Input } from '../../../../components/ui/input'
import { useDataTable } from '@/hooks/use-data-table'
import { type Characteristic } from '@/types/characteristic'
import { charColumns } from '../../utils/char-columns'
import { CreateChar } from '../create-char/create-char'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useModalContext } from '@/context/modal-context'
import { Dialog, DialogContent } from '../../../../components/ui/dialog'
import { useCallback, useEffect } from 'react'
import { CharDetailsContainer } from '../char-details/char-details-container'
import { Loader2 } from 'lucide-react'
import { ScrollArea } from '../../../../components/ui/scroll-area'

export function CharTable({
    data,
    isFetching,
}: {
    data: Characteristic[]
    isFetching: boolean
}) {
    // outside state/functions
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { globalFilter, setGlobalFilter, table } =
        useDataTable<Characteristic>({ data, columns: charColumns })
    const { isModalOpen, closeModal, openModal } = useModalContext()

    // inside state/functions
    const urlCharId = searchParams.get('charId') ?? ''

    const handleChange = useCallback(
        (open: boolean) => {
            if (!open) {
                navigate(`/resources/chars`)
                closeModal()
                return
            }
            openModal()
        },
        [closeModal, navigate, openModal]
    )

    useEffect(() => {
        if (urlCharId.length > 0) {
            handleChange(true)
        }
    }, [handleChange, urlCharId])

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
                        <CreateChar />

                        <DataTableViewOptions table={table} />
                    </div>
                </div>

                <ScrollArea className="h-[780px] relative">
                    <DataTable table={table} columns={charColumns} />

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
                    <CharDetailsContainer charId={urlCharId} />
                </DialogContent>
            </Dialog>
        </>
    )
}
