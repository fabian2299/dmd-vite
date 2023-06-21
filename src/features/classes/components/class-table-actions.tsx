import { useNavigate } from 'react-router-dom'
import { usePrefetch } from '../services/classes'
import { useState } from 'react'
import { Button } from '../../../shared/components/ui/button'
import { Edit } from 'lucide-react'
import { Modal } from '../../../shared/components/ui/modal'
import { ClassDetails } from './class-details'
import { DeleteClass } from './delete-class'

export function ClassTableActions({ classId }: { classId: string }) {
    const navigate = useNavigate()
    const prefetchChar = usePrefetch('getClassById')
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleOpenModal = () => {
        setIsModalOpen(true)
        navigate(`/resources/classes?classId=${classId}`)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        navigate(`/resources/classes`)
    }

    return (
        <div className="flex gap-4 items-center">
            <Button
                onClick={handleOpenModal}
                variant={'outline'}
                onMouseEnter={() => prefetchChar(classId)}
            >
                <Edit className="" size={20} />
            </Button>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <ClassDetails />
            </Modal>

            <DeleteClass classId={classId} />
        </div>
    )
}
