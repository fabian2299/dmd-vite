import { type UseFormReturn } from 'react-hook-form'
import { type UpdateCharDTO } from '../create-char/create-char'
import {
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
import { TypeValues } from '../../../../shared/types/characteristic'

interface CharDetailsMainProps {
    form: UseFormReturn<UpdateCharDTO, unknown, undefined>
}

export function CharDetailsMain({ form }: CharDetailsMainProps) {
    return (
        <div className="flex flex-col gap-8">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Characteristic name (*)</FormLabel>
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
                name="type"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Geometry type (*)</FormLabel>
                        <Select
                            onValueChange={(value) => {
                                field.onChange(
                                    value as (typeof TypeValues)[keyof typeof TypeValues]
                                )
                            }}
                            defaultValue={field.value}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {Object.values(TypeValues).map((value) => (
                                    <SelectItem
                                        key={value}
                                        value={value}
                                        className="capitalize"
                                    >
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
