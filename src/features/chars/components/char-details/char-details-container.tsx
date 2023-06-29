import { useNavigate } from 'react-router-dom'
import { useModalContext } from '@/context/modal-context'
import { useGetCharByIdQuery } from '../../services/chars'
import { CharDetails } from './char-details'
import { Loader2 } from 'lucide-react'
import { toast } from '../../../../components/ui/use-toast'
import { useEffect } from 'react'

export function CharDetailsContainer({ charId }: { charId: string }) {
    const { closeModal, isModalOpen } = useModalContext()
    const navigate = useNavigate()

    const { data: char, isLoading } = useGetCharByIdQuery(charId, {
        skip: !isModalOpen,
    })

    useEffect(() => {
        if (char == null && isModalOpen && !isLoading) {
            closeModal()
            toast({
                title: 'Char not found',
                variant: 'destructive',
            })
            navigate('/resources/chars')
        }
    }, [char, isModalOpen, closeModal, navigate, isLoading])

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
