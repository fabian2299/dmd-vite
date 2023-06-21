import { Button } from '../../../../shared/components/ui/button'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '../../../../shared/components/ui/tabs'
import { CharDetailsMain } from './char-details-main'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type UpdateCharDTO, charFormSchema } from '../create-char/create-char'
import { type Characteristic } from '../../../../shared/types/characteristic'
import { Form } from '../../../../shared/components/ui/form'
import { toast } from '../../../../shared/components/ui/use-toast'
import { useModalContext } from '../../../../shared/context/modal-context'
import { useNavigate } from 'react-router-dom'
import {
    type ErrorHandlerMap,
    ErrorTypeEnum,
} from '../../../../shared/lib/errors'
import { useUpdateCharMutation } from '../../services/chars'
import { Loader2 } from 'lucide-react'
import { CharDetailsClasses } from './char-details-classes'
import { useEffect, useMemo, useState } from 'react'
import {
    resetCharDTO,
    selectCharDTO,
    setCharDTO,
} from '../../slices/charFormSlice'
import { useAppDispatch, useAppSelector } from '../../../../shared/store/hooks'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../../../../shared/components/ui/tooltip'
import { type AxiosError } from 'axios'
import { cn } from '../../../../shared/utils/utils'

interface CharDetailsProps {
    char: Characteristic
}

export function CharDetails({ char }: CharDetailsProps) {
    const { isModalOpen, closeModal } = useModalContext()
    const navigate = useNavigate()

    const [updateChar, { isLoading: isUpdating }] = useUpdateCharMutation()

    const form = useForm<UpdateCharDTO>({
        resolver: zodResolver(charFormSchema),
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
            dispatch(resetCharDTO())
            navigate('/resources/chars')
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
        () => name.length > 0 && type.length > 0,
        [name, type]
    )

    useEffect(() => {
        if (isModalOpen) return
        dispatch(resetCharDTO())
        form.reset()
    }, [dispatch, form, isModalOpen])

    useEffect(() => {
        if (!isModalOpen) return
        dispatch(setCharDTO(formValues))
    }, [formValues, dispatch, isModalOpen])

    const handleTooltipChange = (isOpen: boolean) => {
        setIsTooltipOpen(!isOpen)
    }

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
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
                                    open={isTooltipOpen}
                                    onOpenChange={handleTooltipChange}
                                >
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="submit"
                                            disabled={isUpdating}
                                            className={cn(
                                                !isFormFull ? 'opacity-50' : '',
                                                'disabled:opacity-80 disabled:cursor-not-allowed'
                                            )}
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
                                        <p className="testar text-lg w-full max-w-[220px]">
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
