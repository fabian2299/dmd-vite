import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '../../../../components/ui/use-toast'
import { AxiosError } from 'axios'
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
import { useCreateTemplateMutation } from '../../services/templates'
import {
    type CreateTemplateDTO,
    resetTemplateDTO,
    selectTemplateDTO,
    setTemplateDTO,
    TemplateFormSchema,
} from '../../slices/templateFormSlice'
import { usePrefetch } from '../../../classes/services/classes'
import { CreateTemplateMain } from './create-template-main'
import { CreateTemplateClasses } from './create-template-classes'

export function CreateTemplate() {
    const [open, setOpen] = useState(false)
    const [createTemplate, { isLoading: isCreating }] =
        useCreateTemplateMutation()

    const dispatch = useAppDispatch()
    const templateDTO = useAppSelector(selectTemplateDTO)

    const form = useForm<CreateTemplateDTO>({
        resolver: zodResolver(TemplateFormSchema),
        defaultValues: {
            classImplementations: [],
            name: '',
            description: '',
            shortDescription: '',
            geometryType: 'Point',
        },
    })

    const name = form.watch('name')
    const description = form.watch('description')
    const shortDescription = form.watch('shortDescription')
    const classImplementations = form.watch('classImplementations')
    const geometryType = form.watch('geometryType')

    const formValues = useMemo(
        () => ({
            name,
            classImplementations,
            description,
            shortDescription,
            geometryType,
        }),
        [
            name,
            classImplementations,
            description,
            shortDescription,
            geometryType,
        ]
    )

    useEffect(() => {
        if (!open) return
        dispatch(setTemplateDTO(formValues))
    }, [formValues, dispatch, open])

    useEffect(() => {
        if (open) return
        dispatch(resetTemplateDTO())
        form.reset()
    }, [dispatch, form, open])

    const onSubmit = async () => {
        if (classImplementations.length === 0) {
            toast({
                title: 'No class selected',
                description: 'Please select at least one class',
                variant: 'destructive',
            })
            return
        }

        try {
            await createTemplate(templateDTO).unwrap()
            toast({
                title: `Template ${templateDTO.name} created`,
                description: 'Class created successfully',
            })

            dispatch(resetTemplateDTO())
            form.reset()
            setOpen(false)
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
        () => name.length > 0 && classImplementations.length > 0,
        [classImplementations.length, name.length]
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

    const prefecthClasses = usePrefetch('getClasses')

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={buttonVariants()}>
                Create Template
            </DialogTrigger>

            <DialogContent className="h-[70vh] p-10 lg:max-w-5xl">
                <Tabs
                    defaultValue="general"
                    className="flex w-full flex-col gap-8"
                >
                    <TabsList className="grid w-1/3 grid-cols-2">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger
                            value="classes"
                            onMouseEnter={() => {
                                prefecthClasses()
                            }}
                        >
                            Classes
                        </TabsTrigger>
                    </TabsList>

                    <div className="h-full">
                        <Form {...form}>
                            <form
                                className="flex h-full flex-col justify-between"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <TabsContent value="general">
                                    <CreateTemplateMain form={form} />
                                </TabsContent>

                                <TabsContent value="classes">
                                    <CreateTemplateClasses form={form} />
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
                                                    Name and Classes.
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
