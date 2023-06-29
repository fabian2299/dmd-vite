import { useNavigate } from 'react-router-dom'
import { useModalContext } from '@/context/modal-context'
import { Loader2 } from 'lucide-react'
import { toast } from '../../../../components/ui/use-toast'
import { useEffect } from 'react'
import { useGetClassByIdQuery } from '../../services/classes'
import { ClassDetails } from './class-details'

export function ClassDetailsContainer({ classId }: { classId: string }) {
    const { closeModal, isModalOpen } = useModalContext()
    const navigate = useNavigate()

    const { data: classObj, isLoading } = useGetClassByIdQuery(classId, {
        skip: !isModalOpen,
    })

    useEffect(() => {
        if (classObj == null && isModalOpen && !isLoading) {
            closeModal()
            toast({
                title: 'Class not found',
                variant: 'destructive',
            })
            navigate('/resources/classes')
        }
    }, [classObj, isModalOpen, closeModal, navigate, isLoading])

    if (isLoading) {
        return (
            <div className="grid h-full place-content-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        )
    }

    if (classObj == null) return null

    return <ClassDetails classObj={classObj} />
}
