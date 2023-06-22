import { type UseFormReturn } from 'react-hook-form'
import { type CreateClassDTO } from '../../slices/classFormSlice'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../../../shared/components/ui/form'
import { Input } from '../../../../shared/components/ui/input'
import { Checkbox } from '../../../../shared/components/ui/checkbox'

export function ClassDetailsMain({
    form,
}: {
    form: UseFormReturn<CreateClassDTO, unknown, undefined>
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
                name="mainClass"
                render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
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
