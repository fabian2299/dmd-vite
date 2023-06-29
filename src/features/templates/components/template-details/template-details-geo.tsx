import { Link, useSearchParams } from 'react-router-dom'
import {
    useGetTemplateByIdQuery,
    usePublishLayerMutation,
    useUnpublishLayerMutation,
} from '../../services/templates'
import { type Template } from '@/types/template'
import { toast } from '../../../../components/ui/use-toast'
import { Button } from '../../../../components/ui/button'
import { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../../components/ui/select'
import { Loader2 } from 'lucide-react'

export function TemplateDetailsGeo() {
    const [searchParams] = useSearchParams()
    const templateId = searchParams.get('templateId') ?? ''
    const { data: template } = useGetTemplateByIdQuery(templateId)

    if (template == null) return null

    return (
        <div>
            {template.layerName == null || template.layerName.length === 0 ? (
                <PublishLayer template={template} />
            ) : (
                <DeleteLayer template={template} />
            )}
        </div>
    )
}

function PublishLayer({ template }: { template: Template }) {
    const [publishLayer, { isLoading: isPublishing }] =
        usePublishLayerMutation()

    const handlePublish = async () => {
        try {
            await publishLayer(template.id.toString()).unwrap()
            toast({
                title: 'Success',
                description: 'Layer published successfully',
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Error publishing layer',
                variant: 'destructive',
            })
        }
    }

    const hasGeometry = template.geometryType !== null

    if (!hasGeometry) {
        return (
            <div color={'gray.500'}>
                A geometry type is needed to publish a layer
            </div>
        )
    }

    return (
        <div>
            <Button onClick={handlePublish}>
                {isPublishing ? (
                    <div className="flex items-center gap-2">
                        <p>Publishing</p>
                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                    </div>
                ) : (
                    'Publish'
                )}
            </Button>
        </div>
    )
}

function DeleteLayer({ template }: { template: Template }) {
    const [unpublishLayer, { isLoading: isUnplishing }] =
        useUnpublishLayerMutation()
    const layerServiceTypeOpts = [
        { name: 'WFS', value: '0' },
        { name: 'WMS', value: '1' },
    ]

    const [layerServiceType, setLayerServiceType] = useState(
        layerServiceTypeOpts[0].value
    )

    const geoserverUrl = `https://gateway-proxy.dev.idrica.pro/geoserver`
    const geoserverUrlWeb = `https://gateway-proxy.dev.idrica.pro/geoserver/web`

    const layerName = template.layerName ?? ''

    const workspace = 'testDMD'

    const owsUrl = `${geoserverUrl}/${workspace}/ows?service=WFS&request=GetFeature&typeName=${workspace}:${layerName}&outputFormat=application/json`

    const wmsUrl = `${geoserverUrl}/${workspace}/wms?service=WMS&request=GetMap&typeName=${workspace}:${layerName}&format=image/png`

    const layerUrl = layerServiceType === '0' ? owsUrl : wmsUrl

    const handleDelete = async () => {
        try {
            await unpublishLayer(template.id.toString()).unwrap()
            toast({
                title: 'Success',
                description: 'Layer deleted successfully',
            })
        } catch (error) {
            console.log(error)
            toast({
                title: 'Error',
                description: 'Error deleting layer',
            })
        }
    }

    return (
        <div className="flex flex-col gap-10">
            <div>
                <div>Workspace:</div>
                <div>{workspace}</div>
            </div>

            <div>
                <div>Layer name:</div>
                <div>{template.layerName}</div>
            </div>

            <div>
                <div>Published in:</div>
                <Link to={geoserverUrl} target={'_blank'}>
                    <div>{geoserverUrlWeb}</div>
                </Link>
            </div>

            <div>
                <div>Service:</div>
                <Select
                    onValueChange={(val) => {
                        setLayerServiceType(val)
                    }}
                    defaultValue={layerServiceType}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        {layerServiceTypeOpts.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <div>Layer URL:</div>
                <Link to={layerUrl} target={'_blank'}>
                    <div>{layerUrl}</div>
                </Link>
            </div>

            <Button
                onClick={handleDelete}
                variant={'destructive'}
                className="w-fit px-6"
            >
                {isUnplishing ? (
                    <div className="flex items-center gap-2">
                        <p>Deleting</p>
                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                    </div>
                ) : (
                    'Delete'
                )}
            </Button>
        </div>
    )
}
