import { useNavigate } from 'react-router-dom'
import { useModalContext } from '../../../../shared/context/modal-context'
import { useGetCharByIdQuery } from '../../services/chars'
import { CharDetails } from './char-details'
import { Loader2 } from 'lucide-react'
import { toast } from '../../../../shared/components/ui/use-toast'
import { useEffect } from 'react'

export function CharDetailsContainer({ charId }: { charId: string }) {
    const { closeModal, isModalOpen } = useModalContext()

    const { data: char, isLoading } = useGetCharByIdQuery(charId, {
        skip: !isModalOpen,
    })

    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading && char == null) {
            closeModal()
            toast({
                title: 'Char not found',
                description: `Char with id ${charId} not found`,
                variant: 'destructive',
            })
            navigate('/resources/chars')
        }
    }, [isLoading, char, charId, closeModal, navigate])

    if (isLoading) {
        return (
            <div className="grid h-full place-content-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        )
    }

    if (char == null) return null

    return <CharDetails char={char} />
}
