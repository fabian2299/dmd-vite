import { useNavigate } from 'react-router-dom'
import { usePrefetch } from '../../services/classes'
import { Button } from '../../../../components/ui/button'
import { Edit } from 'lucide-react'
import { DeleteClass } from './delete-class'
import { useModalContext } from '@/context/modal-context'

export function ClassTableActions({ classId }: { classId: string }) {
    const navigate = useNavigate()
    const prefetchChar = usePrefetch('getClassById')
    const { openModal } = useModalContext()

    return (
        <div className="flex gap-4 items-center">
            <Button
                onClick={() => {
                    openModal()
                    navigate(`/resources/classes?classId=${classId}`)
                }}
                variant={'outline'}
                onMouseEnter={() => {
                    prefetchChar(classId)
                }}
            >
                <Edit className="" size={20} />
            </Button>

            <DeleteClass classId={classId} />
        </div>
    )
}
