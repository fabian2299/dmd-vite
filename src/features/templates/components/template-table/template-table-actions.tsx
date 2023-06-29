import { Edit } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { useModalContext } from '@/context/modal-context'
import { useNavigate } from 'react-router-dom'
import { usePrefetch } from '../../services/templates'
import { DeleteTemplate } from './delete-template'

export function TemplateTableActions({ templateId }: { templateId: string }) {
    const prefetchTemplate = usePrefetch('getTemplateById')
    const { openModal } = useModalContext()
    const navigate = useNavigate()

    return (
        <div className="flex gap-4 items-center">
            <Button
                onClick={() => {
                    openModal()
                    navigate(`/resources/templates?templateId=${templateId}`)
                }}
                variant={'outline'}
                onMouseEnter={() => {
                    prefetchTemplate(templateId)
                }}
            >
                <Edit className="" size={20} />
            </Button>

            <DeleteTemplate templateId={templateId} />
        </div>
    )
}
