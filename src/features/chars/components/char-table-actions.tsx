import { useState } from 'react'
import { DeleteChar } from './delete-char'
import { Edit } from 'lucide-react'
import { Button } from '../../../shared/components/ui/button'
import Modal from '../../../shared/components/ui/modal'
import { useNavigate } from 'react-router-dom'
import { EditChar } from './edit-char'
import { usePrefetch } from '../services/chars'

export function CharTableActions({ charId }: { charId: string }) {
    const navigate = useNavigate()
    const prefetchChar = usePrefetch('getCharById')
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleOpenModal = () => {
        setIsModalOpen(true)
        navigate(`/resources/chars?charId=${charId}&action=edit`)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        navigate(`/resources/chars`)
    }

    return (
        <div className="flex gap-4 items-center">
            <Button
                onClick={handleOpenModal}
                variant={'outline'}
                onMouseEnter={() => prefetchChar(charId)}
            >
                <Edit className="" size={20} />
            </Button>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <EditChar />
            </Modal>

            <DeleteChar charId={charId} />
        </div>
    )
}
