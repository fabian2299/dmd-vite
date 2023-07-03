import { Button } from '../../../../components/ui/button'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '../../../../components/ui/tabs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '../../../../components/ui/form'
import { toast } from '../../../../components/ui/use-toast'
import { useModalContext } from '@/context/modal-context'
import { useNavigate } from 'react-router-dom'
import { type ErrorHandlerMap, ErrorTypeEnum } from '@/lib/errors'
import { Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../../../../components/ui/tooltip'
import { AxiosError } from 'axios'
import { cn } from '@/utils/utils'
import { type Class } from '@/types/class'
import { useUpdateClassMutation } from '../../services/classes'
import {
    type UpdateClassDTO,
    ClassFormSchema,
    selectClassDTO,
    resetClassDTO,
    setClassDTO,
} from '../../slices/classFormSlice'
import { ClassDetailsMain } from './class-details-main'
import { ClassDetailsChars } from './class-details-chars'
import { usePrefetch } from '../../../chars/services/chars'

interface ClassDetailsProps {
    classObj: Class
}

export function ClassDetails({ classObj }: ClassDetailsProps) {
    const { isModalOpen, closeModal } = useModalContext()
    const navigate = useNavigate()

    const [updateClass, { isLoading: isUpdating }] = useUpdateClassMutation()
    const prefetchChars = usePrefetch('getChars')

    const form = useForm<UpdateClassDTO>({
        resolver: zodResolver(ClassFormSchema),
        defaultValues: {
            id: classObj.id,
            name: classObj.name,
            description: classObj.description,
            shortDescription: classObj.shortDescription,
            isMainClass: classObj.isMainClass ?? false,
            characteristics: classObj.characteristics.map((char) => ({
                id: char.id,
            })),
        },
    })
    const dispatch = useAppDispatch()
    const classDTO = useAppSelector(selectClassDTO)

    const name = form.watch('name')
    const description = form.watch('description')
    const shortDescription = form.watch('shortDescription')
    const id = form.watch('id')
    const characteristics = form.watch('characteristics')
    const isMainClass = form.watch('isMainClass')

    const formValues = useMemo(
        () => ({
            name,
            description,
            shortDescription,
            characteristics,
            id,
            isMainClass,
        }),
        [name, description, shortDescription, characteristics, id, isMainClass]
    )

    const onSubmit = async () => {
        try {
            await updateClass(classDTO).unwrap()
            toast({
                title: 'Class updated',
                description: 'Class updated successfully',
            })
            closeModal()
            dispatch(resetClassDTO())
            navigate('/resources/classes')
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                const errType = error.name as ErrorTypeEnum
                errorHandler[errType]()
            } else {
                errorHandler.DefaultError()
            }
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
        () => name.length > 0 && characteristics.length > 0,
        [characteristics?.length, name.length]
    )

    useEffect(() => {
        if (isModalOpen) return
        dispatch(resetClassDTO())
        form.reset()
    }, [dispatch, form, isModalOpen])

    useEffect(() => {
        if (!isModalOpen) return
        dispatch(
            setClassDTO({
                ...classObj,
                ...formValues,
            })
        )
    }, [formValues, dispatch, isModalOpen, classObj])

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

    return (
        <Tabs
            defaultValue="general"
            className="flex h-[75vh] w-full flex-col  gap-8 p-10"
        >
            <TabsList className="grid w-1/3 grid-cols-2">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger
                    value="chars"
                    onMouseEnter={() => {
                        prefetchChars()
                    }}
                >
                    Chars
                </TabsTrigger>
            </TabsList>

            <div className="h-full">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex h-full flex-col justify-between"
                    >
                        <TabsContent value="general">
                            <ClassDetailsMain form={form} />
                        </TabsContent>

                        <TabsContent value="chars">
                            <ClassDetailsChars form={form} />
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
                                            at least one characteristic
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
