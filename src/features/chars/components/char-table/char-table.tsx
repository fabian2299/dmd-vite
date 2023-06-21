import { DataTable } from '../../../../shared/components/table/data-table'
import { DataTablePagination } from '../../../../shared/components/table/data-table-pagination'
import { DataTableViewOptions } from '../../../../shared/components/table/data-table-view-options'
import { Input } from '../../../../shared/components/ui/input'
import { useDataTable } from '../../../../shared/hooks/use-data-table'
import { type Characteristic } from '../../../../shared/types/characteristic'
import { charColumns } from '../../utils/char-columns'
import { CreateChar } from '../create-char/create-char'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useModalContext } from '../../../../shared/context/modal-context'
import { Dialog, DialogContent } from '../../../../shared/components/ui/dialog'
import { useCallback, useEffect } from 'react'
import { CharDetailsContainer } from '../char-details/char-details-container'

export function CharTable({ data }: { data: Characteristic[] }) {
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

                <div className="max-h-[780px] overflow-y-auto ">
                    <DataTable table={table} columns={charColumns} />
                </div>

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
