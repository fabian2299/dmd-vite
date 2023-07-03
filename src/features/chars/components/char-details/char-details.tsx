import { Button } from '../../../../components/ui/button'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '../../../../components/ui/tabs'
import { CharDetailsMain } from './char-details-main'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Characteristic } from '@/types/characteristic'
import { Form } from '../../../../components/ui/form'
import { toast } from '../../../../components/ui/use-toast'
import { useModalContext } from '@/context/modal-context'
import { useNavigate } from 'react-router-dom'
import { type ErrorHandlerMap, ErrorTypeEnum } from '@/lib/errors'
import { useUpdateCharMutation } from '../../services/chars'
import { Loader2 } from 'lucide-react'
import { CharDetailsClasses } from './char-details-classes'
import { useEffect, useMemo, useState } from 'react'
import {
    type UpdateCharDTO,
    CharFormSchema,
    resetCharDTO,
    selectCharDTO,
    setCharDTO,
} from '../../slices/charFormSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../../../../components/ui/tooltip'
import { AxiosError } from 'axios'
import { cn } from '@/utils/utils'

interface CharDetailsProps {
    char: Characteristic
}

export function CharDetails({ char }: CharDetailsProps) {
    const { isModalOpen, closeModal } = useModalContext()
    const navigate = useNavigate()

    const [updateChar, { isLoading: isUpdating }] = useUpdateCharMutation()

    const form = useForm<UpdateCharDTO>({
        resolver: zodResolver(CharFormSchema),
        defaultValues: {
            name: char.name,
            type: char.type,
            description: char.description,
            shortDescription: char.shortDescription,
            id: char.id,
        },
    })
    const dispatch = useAppDispatch()
    const charDTO = useAppSelector(selectCharDTO)

    const name = form.watch('name')
    const type = form.watch('type')
    const description = form.watch('description')
    const shortDescription = form.watch('shortDescription')
    const id = form.watch('id')

    const formValues = useMemo(
        () => ({
            name,
            type,
            description,
            shortDescription,
            id,
        }),
        [name, type, description, shortDescription, id]
    )

    const onSubmit = async () => {
        try {
            await updateChar({
                ...char,
                ...charDTO,
            }).unwrap()
            toast({
                title: 'Char updated',
                description: 'Char updated successfully',
            })
            closeModal()
            navigate('/resources/chars')
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
        () => name?.length > 0 && type?.length > 0,
        [name, type]
    )

    useEffect(() => {
        if (!isModalOpen) return
        dispatch(setCharDTO(formValues))
    }, [formValues, dispatch, isModalOpen, form])

    useEffect(() => {
        if (isModalOpen) return
        dispatch(resetCharDTO())
        form.reset()
    }, [isModalOpen, dispatch, form])

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
                <TabsTrigger value="chars">Classes</TabsTrigger>
            </TabsList>

            <div className="h-full">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex h-full flex-col justify-between"
                    >
                        <TabsContent value="general">
                            <CharDetailsMain form={form} />
                        </TabsContent>

                        <TabsContent value="chars">
                            <CharDetailsClasses
                                data={char.classImplementations}
                            />
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
                                            To create a char you must fill in
                                            the required fields (*): Name and
                                            Type
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
