import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { TypeValues } from '../../../../shared/types/characteristic'
import { toast } from '../../../../shared/components/ui/use-toast'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
} from '../../../../shared/components/ui/dialog'
import { Button, buttonVariants } from '../../../../shared/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../../../shared/components/ui/form'
import { Input } from '../../../../shared/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../../shared/components/ui/select'
import { Loader2 } from 'lucide-react'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    type ErrorHandlerMap,
    ErrorTypeEnum,
} from '../../../../shared/lib/errors'
import { useCreateCharMutation } from '../../services/chars'
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

export const charFormSchema = z.object({
    name: z.string().min(3, 'Name must contain at least 3 chars').max(51),
    description: z.string(),
    shortDescription: z.string(),
    type: z.nativeEnum(TypeValues),
    id: z.number().optional(),
})

export type CreateCharDTO = Omit<z.infer<typeof charFormSchema>, 'id'>
export type UpdateCharDTO = z.infer<typeof charFormSchema>

export function CreateChar() {
    const [open, setOpen] = useState(false)
    const [createChar, { isLoading: isCreating }] = useCreateCharMutation()

    const dispatch = useAppDispatch()
    const charDTO = useAppSelector(selectCharDTO)

    const form = useForm<CreateCharDTO>({
        resolver: zodResolver(charFormSchema),
        defaultValues: {
            name: '',
            type: TypeValues.String,
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

    useEffect(() => {
        if (!open) return
        dispatch(setCharDTO(formValues))
    }, [formValues, dispatch, open])

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

            dispatch(resetCharDTO())
            form.reset()
            setOpen(false)
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
                                    <FormLabel>Geometry type (*)</FormLabel>
                                    <Select
                                        defaultValue={field.value}
                                        onValueChange={(value) => {
                                            field.onChange(
                                                value as (typeof TypeValues)[keyof typeof TypeValues]
                                            )
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(TypeValues).map(
                                                (value) => (
                                                    <SelectItem
                                                        key={value}
                                                        value={value}
                                                        className="capitalize"
                                                    >
                                                        {value}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="mt-auto text-end">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="inline-flex gap-4 items-center justify-end">
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
