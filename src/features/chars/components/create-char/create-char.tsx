import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from '../../../../components/ui/use-toast'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
} from '../../../../components/ui/dialog'
import { Button, buttonVariants } from '../../../../components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../../../components/ui/form'
import { Input } from '../../../../components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../../components/ui/select'
import { Loader2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ErrorHandlerMap, ErrorTypeEnum } from '@/lib/errors'
import { useCreateCharMutation } from '../../services/chars'
import {
    type CreateCharDTO,
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
import { Type } from '@/types/characteristic'
import { capitalize } from '../../../../utils/utils'

export function CreateChar() {
    const [open, setOpen] = useState(false)
    const [createChar, { isLoading: isCreating }] = useCreateCharMutation()

    const dispatch = useAppDispatch()
    const charDTO = useAppSelector(selectCharDTO)

    const form = useForm<CreateCharDTO>({
        resolver: zodResolver(CharFormSchema),
        defaultValues: {
            name: '',
            type: 'string',
            description: '',
            shortDescription: '',
        },
    })

    const name = form.watch('name')
    const type = form.watch('type')
    const description = form.watch('description')
    const shortDescription = form.watch('shortDescription')

    const formValues = useMemo(
        () => ({
            name,
            type,
            description,
            shortDescription,
        }),
        [name, type, description, shortDescription]
    )

    // send charDTO to redux on open modal
    useEffect(() => {
        if (!open) return
        dispatch(setCharDTO(formValues))
    }, [dispatch, formValues, open])

    // reset charDTO and form on close modal
    useEffect(() => {
        if (open) return
        dispatch(resetCharDTO())
        form.reset()
    }, [dispatch, form, open])

    const onSubmit = async () => {
        try {
            await createChar(charDTO).unwrap()
            toast({
                title: `Char ${charDTO.name} created`,
                description: 'Char created successfully',
            })
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
                description: 'An error occurred while creating the char',
                variant: 'destructive',
            })
        },
    }

    const [isTooltipOpen, setIsTooltipOpen] = useState(false)

    const isFormFull = useMemo(
        () => name.length > 0 && type?.length > 0,
        [name, type]
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={buttonVariants()}>
                Create Char
            </DialogTrigger>

            <DialogContent className="h-[70vh] p-10 lg:max-w-5xl">
                <Form {...form}>
                    <form
                        className="flex flex-col gap-8 "
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Characteristic name (*)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="shadcn"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="shortDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Short Description</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type (*)</FormLabel>
                                    <Select
                                        defaultValue={field.value}
                                        onValueChange={(value) => {
                                            field.onChange(
                                                value as unknown as React.ChangeEvent<HTMLInputElement>
                                            )
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Type.options.map((type) => (
                                                <SelectItem
                                                    key={type}
                                                    value={type}
                                                >
                                                    {capitalize(type)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                                !isFormFull ? 'opacity-50' : '',
                                                'inline-flex gap-4 items-center justify-end'
                                            )}
                                            onMouseEnter={() => {
                                                if (!isFormFull) {
                                                    setIsTooltipOpen(true) // Open tooltip when hover starts and isFormFull is false.
                                                }
                                            }}
                                            onMouseLeave={() => {
                                                if (!isFormFull) {
                                                    setIsTooltipOpen(false) // Close tooltip when hover ends and isFormFull is false.
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
            </DialogContent>
        </Dialog>
    )
}
