import { type UseFormReturn } from 'react-hook-form'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../../../components/ui/form'
import { Input } from '../../../../components/ui/input'
import { Checkbox } from '../../../../components/ui/checkbox'
import { type UpdateClassDTO } from '@/features/classes/slices/classFormSlice'

export function ClassDetailsMain({
    form,
}: {
    form: UseFormReturn<UpdateClassDTO, unknown, undefined>
}) {
    return (
        <div className="flex flex-col gap-8">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Class name (*)</FormLabel>
                        <FormControl>
                            <Input placeholder="shadcn" {...field} />
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
                name="isMainClass"
                render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value ?? false}
                                    onCheckedChange={(value) => {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        field.onChange(value as any)
                                    }}
                                />
                            </FormControl>

                            <FormLabel>Main Class</FormLabel>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
