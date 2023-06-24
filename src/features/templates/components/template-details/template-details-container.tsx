import { useNavigate } from 'react-router-dom'
import { useModalContext } from '../../../../shared/context/modal-context'
import { Loader2 } from 'lucide-react'
import { toast } from '../../../../shared/components/ui/use-toast'
import { useEffect } from 'react'
import { useGetTemplateByIdQuery } from '../../services/templates'
import { TemplateDetails } from './template-details'

export function TemplateDetailsContainer({
    templateId,
}: {
    templateId: string
}) {
    const { closeModal, isModalOpen } = useModalContext()
    const navigate = useNavigate()

    const { data: template, isLoading } = useGetTemplateByIdQuery(templateId, {
        skip: !isModalOpen,
    })

    useEffect(() => {
        if (template == null && isModalOpen && !isLoading) {
            closeModal()
            toast({
                title: 'Template not found',
                variant: 'destructive',
            })
            navigate('/resources/templates')
        }
    }, [template, isModalOpen, closeModal, navigate, isLoading])

    if (isLoading) {
        return (
            <div className="grid h-full place-content-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        )
    }

    if (template == null) return null

    return <TemplateDetails template={template} />
}
