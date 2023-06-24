import { Button } from '../../../../shared/components/ui/button'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '../../../../shared/components/ui/tabs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '../../../../shared/components/ui/form'
import { toast } from '../../../../shared/components/ui/use-toast'
import { useModalContext } from '../../../../shared/context/modal-context'
import { useNavigate } from 'react-router-dom'
import {
    type ErrorHandlerMap,
    ErrorTypeEnum,
} from '../../../../shared/lib/errors'
import { Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../shared/store/hooks'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../../../../shared/components/ui/tooltip'
import { type AxiosError } from 'axios'
import { cn } from '../../../../shared/utils/utils'
import { GeometryType, type Template } from '../../../../shared/types/template'
import { useUpdateTemplateMutation } from '../../services/templates'
import {
    type UpdateTemplateDTO,
    templateFormSchema,
    selectTemplateDTO,
    resetTemplateDTO,
    setTemplateDTO,
} from '../../slices/templateFormSlice'
import { TemplateDetailsMain } from './template-details-main'
import { TemplateDetailsClasses } from './template-details-classes'
import { usePrefetch } from '../../../classes/services/classes'
import { TemplateDetailsGeo } from './template-details-geo'

interface TemplateDetailsProps {
    template: Template
}

export function TemplateDetails({ template }: TemplateDetailsProps) {
    const { isModalOpen, closeModal } = useModalContext()
    const navigate = useNavigate()

    const [updateTemplate, { isLoading: isUpdating }] =
        useUpdateTemplateMutation()

    const form = useForm<UpdateTemplateDTO>({
        resolver: zodResolver(templateFormSchema),
        defaultValues: {
            classesIds: template.classImplementations.map((classObj) =>
                classObj.id.toString()
            ),
            name: template.name,
            description: template.description,
            shortDescription: template.shortDescription,
            id: template.id,
            geometryType: template.geometryType ?? GeometryType.Point,
        },
    })
    const dispatch = useAppDispatch()
    const templateDTO = useAppSelector(selectTemplateDTO)

    const name = form.watch('name')
    const description = form.watch('description')
    const shortDescription = form.watch('shortDescription')
    const id = form.watch('id')
    const classesIds = form.watch('classesIds')
    const geometryType = form.watch('geometryType')

    const formValues = useMemo(
        () => ({
            name,
            description,
            shortDescription,
            id,
            classesIds,
            geometryType,
        }),
        [name, description, shortDescription, id, classesIds, geometryType]
    )

    const onSubmit = async () => {
        try {
            await updateTemplate(templateDTO).unwrap()
            toast({
                title: 'Template updated',
                description: 'Template updated successfully',
            })
            closeModal()
            dispatch(resetTemplateDTO())
            navigate('/resources/templates')
        } catch (error: unknown) {
            const errType = (error as AxiosError).name as ErrorTypeEnum
            errorHandler[errType]()
        }
    }

    const errorHandler: ErrorHandlerMap = {
        [ErrorTypeEnum.DuplicateNameException]: () => {
            toast({
                title: 'Duplicate name',
                description: 'Char name already exists',
                variant: 'destructive',
            })
        },
        [ErrorTypeEnum.InsufficientPermissionsException]: () => {
            toast({
                title: 'Insufficient permissions',
                description: 'You do not have permissions to update this char',
                variant: 'destructive',
            })
        },
        [ErrorTypeEnum.DefaultError]: () => {
            toast({
                title: 'Error',
                description: 'An error occurred while updating the char',
                variant: 'destructive',
            })
        },
    }

    const [isTooltipOpen, setIsTooltipOpen] = useState(false)

    const isFormFull = useMemo(
        () => name?.length > 0 && classesIds?.length > 0,
        [classesIds?.length, name?.length]
    )

    useEffect(() => {
        if (isModalOpen) return
        dispatch(resetTemplateDTO())
        form.reset()
    }, [dispatch, form, isModalOpen])

    useEffect(() => {
        if (!isModalOpen) return
        dispatch(setTemplateDTO(formValues))
    }, [formValues, dispatch, isModalOpen])

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>
        if (isFormFull) {
            setIsTooltipOpen(false)
        } else {
            if (isModalOpen) {
                timeoutId = setTimeout(() => {
                    setIsTooltipOpen(true)
                }, 200)
            }
        }
        return () => {
            clearTimeout(timeoutId)
            setIsTooltipOpen(false)
        }
    }, [isFormFull, isModalOpen])

    const prefetchClasses = usePrefetch('getClasses')

    return (
        <Tabs
            defaultValue="general"
            className="flex h-[75vh] w-full flex-col  gap-8 p-10"
        >
            <TabsList className="flex w-1/2">
                <TabsTrigger className="flex-1" value="general">
                    General
                </TabsTrigger>
                <TabsTrigger
                    className="flex-1"
                    value="classes"
                    onMouseEnter={() => {
                        prefetchClasses()
                    }}
                >
                    Classes
                </TabsTrigger>

                <TabsTrigger className="flex-1" value="geoservice">
                    Geoservice
                </TabsTrigger>
            </TabsList>

            <div className="h-full">
                <Form {...form}>
                    <form
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex h-full flex-col justify-between"
                    >
                        <TabsContent value="general">
                            <TemplateDetailsMain form={form} />
                        </TabsContent>

                        <TabsContent value="classes">
                            <TemplateDetailsClasses form={form} />
                        </TabsContent>

                        <TabsContent value="geoservice">
                            <TemplateDetailsGeo />
                        </TabsContent>

                        <div className="mt-auto text-end">
                            <TooltipProvider>
                                <Tooltip
                                    open={isTooltipOpen && !isFormFull}
                                    onOpenChange={(isOpen) => {
                                        if (!isFormFull) {
                                            setIsTooltipOpen(isOpen)
                                        }
                                    }}
                                >
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="submit"
                                            disabled={isUpdating}
                                            className={cn(
                                                !isFormFull ? 'opacity-50' : '',
                                                'disabled:opacity-80 disabled:cursor-not-allowed'
                                            )}
                                            onMouseEnter={() => {
                                                if (!isFormFull) {
                                                    setIsTooltipOpen(true)
                                                }
                                            }}
                                            onMouseLeave={() => {
                                                if (!isFormFull) {
                                                    setIsTooltipOpen(false)
                                                }
                                            }}
                                        >
                                            {isUpdating ? (
                                                <div className="flex gap-4 items-center">
                                                    <p>Updating</p>
                                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                                </div>
                                            ) : (
                                                'Update'
                                            )}
                                        </Button>
                                    </TooltipTrigger>

                                    <TooltipContent
                                        side="left"
                                        className="mr-6"
                                    >
                                        <p className="text-start text-lg w-full max-w-[220px]">
                                            To create a class you must fill in
                                            the required fields: Name and Select
                                            at least one class
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </form>
                </Form>
            </div>
        </Tabs>
    )
}