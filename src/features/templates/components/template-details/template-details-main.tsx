import { type UseFormReturn } from 'react-hook-form'
import { type UpdateTemplateDTO } from '../../slices/templateFormSlice'
import {
    FormControl,
    FormDescription,
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
import { GeometryType } from '@/types/template'

export function TemplateDetailsMain({
    form,
}: {
    form: UseFormReturn<UpdateTemplateDTO, unknown, undefined>
}) {
    return (
        <div className="flex flex-col gap-8">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Template name (*)</FormLabel>
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
                name="geometryType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Geometry type (*)</FormLabel>
                        <Select
                            onValueChange={(value) => {
                                value as unknown as React.ChangeEvent<HTMLInputElement>
                            }}
                            value={field.value ?? GeometryType.options[0]}
                            disabled
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {GeometryType.options.map((value) => (
                                    <SelectItem key={value} value={value}>
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormDescription className="text-red-500">
                            (Changing the geometry of a template will delete all
                            asset geometries based on it)
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
