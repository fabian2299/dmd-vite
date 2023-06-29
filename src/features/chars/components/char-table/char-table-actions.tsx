import { DeleteChar } from './delete-char'
import { Edit } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { usePrefetch } from '../../services/chars'
import { useModalContext } from '@/context/modal-context'
import { useNavigate } from 'react-router-dom'

export function CharTableActions({ charId }: { charId: string }) {
    const prefetchChar = usePrefetch('getCharById')
    const { openModal } = useModalContext()
    const navigate = useNavigate()

    return (
        <div className="flex gap-4 items-center">
            <Button
                onClick={() => {
                    openModal()
                    navigate(`/resources/chars?charId=${charId}`)
                }}
                variant={'outline'}
                onMouseEnter={() => {
                    prefetchChar(charId)
                }}
            >
                <Edit className="" size={20} />
            </Button>

            <DeleteChar charId={charId} />
        </div>
    )
}
