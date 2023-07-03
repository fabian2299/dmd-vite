import { useEffect, useMemo, useState } from 'react'
import { useCreateClassMutation } from '../../services/classes'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
    type CreateClassDTO,
    ClassFormSchema,
    selectClassDTO,
    setClassDTO,
    resetClassDTO,
} from '../../slices/classFormSlice'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '../../../../components/ui/use-toast'
import { type AxiosError } from 'axios'
import { type ErrorHandlerMap, ErrorTypeEnum } from '@/lib/errors'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '../../../../components/ui/dialog'
import { Button, buttonVariants } from '../../../../components/ui/button'
import { Form } from '../../../../components/ui/form'

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../../../../components/ui/tooltip'
import { cn } from '@/utils/utils'
import { Loader2 } from 'lucide-react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '../../../../components/ui/tabs'
import { CreateClassMain } from './create-class-main'
import { CreateClassChars } from './create-class-chars'
import { usePrefetch } from '../../../chars/services/chars'

export function CreateClass() {
    const [open, setOpen] = useState(false)
    const [createClass, { isLoading: isCreating }] = useCreateClassMutation()

    const dispatch = useAppDispatch()
    const classDTO = useAppSelector(selectClassDTO)

    const form = useForm<CreateClassDTO>({
        resolver: zodResolver(ClassFormSchema),
        defaultValues: {
            name: '',
            isMainClass: false,
            characteristics: [],
            description: '',
            shortDescription: '',
        },
    })

    const name = form.watch('name')
    const description = form.watch('description')
    const shortDescription = form.watch('shortDescription')
    const characteristics = form.watch('characteristics')
    const isMainClass = form.watch('isMainClass')

    const formValues = useMemo(
        () => ({
            name,
            characteristics,
            description,
            shortDescription,
            isMainClass,
        }),
        [name, characteristics, description, shortDescription, isMainClass]
    )

    useEffect(() => {
        if (!open) return
        dispatch(setClassDTO(formValues))
    }, [formValues, dispatch, open])

    useEffect(() => {
        if (open) return
        dispatch(resetClassDTO())
        form.reset()
    }, [dispatch, form, open])

    const onSubmit = async () => {
        if (characteristics.length === 0) {
            toast({
                title: 'No chars selected',
                description: 'Please select at least one char',
                variant: 'destructive',
            })
            return
        }

        try {
            await createClass(classDTO).unwrap()
            toast({
                title: `Class ${name} created`,
                description: 'Class created successfully',
            })

            dispatch(resetClassDTO())
            form.reset()
            setOpen(false)
        } catch (error: unknown) {
            console.log('error', error)
            const errType = (error as AxiosError).name as ErrorTypeEnum
            errorHandler[errType]()
        }
    }

    const errorHandler: ErrorHandlerMap = {
        [ErrorTypeEnum.DuplicateNameException]: () => {
            toast({
                title: 'Duplicate name',
                description: 'Class name already exists',
                variant: 'destructive',
            })
        },
        [ErrorTypeEnum.DefaultError]: () => {
            toast({
                title: 'Error',
                description: 'An error occurred while updating the class',
                variant: 'destructive',
            })
        },
    }

    const [isTooltipOpen, setIsTooltipOpen] = useState(false)

    const isFormFull = useMemo(
        () => name.length > 0 && characteristics.length > 0,
        [characteristics.length, name.length]
    )

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>
        if (isFormFull) {
            setIsTooltipOpen(false)
        } else {
            if (open) {
                timeoutId = setTimeout(() => {
                    setIsTooltipOpen(true)
                }, 200)
            }
        }
        return () => {
            clearTimeout(timeoutId)
            setIsTooltipOpen(false)
        }
    }, [isFormFull, open])

    const prefecthChars = usePrefetch('getChars')

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={buttonVariants()}>
                Create Class
            </DialogTrigger>

            <DialogContent className="h-[70vh] p-10 lg:max-w-5xl">
                <Tabs
                    defaultValue="general"
                    className="flex w-full flex-col gap-8"
                >
                    <TabsList className="grid w-1/3 grid-cols-2">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger
                            value="chars"
                            onMouseEnter={() => {
                                prefecthChars()
                            }}
                        >
                            Characteristics
                        </TabsTrigger>
                    </TabsList>

                    <div className="h-full">
                        <Form {...form}>
                            <form
                                className="flex h-full flex-col justify-between"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <TabsContent value="general">
                                    <CreateClassMain form={form} />
                                </TabsContent>

                                <TabsContent value="chars">
                                    <CreateClassChars form={form} />
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
                                                <div
                                                    className={cn(
                                                        !isFormFull
                                                            ? 'opacity-50'
                                                            : '',
                                                        'inline-flex gap-4 items-center justify-end'
                                                    )}
                                                    onMouseEnter={() => {
                                                        if (!isFormFull) {
                                                            setIsTooltipOpen(
                                                                true
                                                            ) // Open tooltip when hover starts and isFormFull is false.
                                                        }
                                                    }}
                                                    onMouseLeave={() => {
                                                        if (!isFormFull) {
                                                            setIsTooltipOpen(
                                                                false
                                                            ) // Close tooltip when hover ends and isFormFull is false.
                                                        }
                                                    }}
                                                >
                                                    <Button
                                                        type="submit"
                                                        disabled={isCreating}
                                                        className={
                                                            'disabled:opacity-80 disabled:cursor-not-allowed w-fit inline-flex gap-4 items-center justify-end'
                                                        }
                                                    >
                                                        {isCreating ? (
                                                            <>
                                                                <p>Create</p>
                                                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                                                            </>
                                                        ) : (
                                                            <p>Create</p>
                                                        )}
                                                    </Button>
                                                </div>
                                            </TooltipTrigger>

                                            <TooltipContent
                                                side="left"
                                                className="mr-6"
                                            >
                                                <p className="text-start text-lg w-full max-w-[220px]">
                                                    To create a char you must
                                                    fill in the required fields:
                                                    Name and Characteristics.
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </form>
                        </Form>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
