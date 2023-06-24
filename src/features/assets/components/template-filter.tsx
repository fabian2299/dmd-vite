import React, { useEffect } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../../../shared/components/ui/popover'
import { Button } from '../../../shared/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '../../../shared/components/ui/command'
import { cn } from '../../../shared/utils'
import { type Template } from '../../../shared/types/template'
import { ScrollArea } from '../../../shared/components/ui/scroll-area'

interface TemplateFilterProps {
    templates: Template[]
    onSelectTemplate: (templateId: string) => void
    selectedTemplateId: string
}

export function TemplateFilter({
    templates,
    onSelectTemplate,
    selectedTemplateId,
}: TemplateFilterProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState('')

    const normalizedValues = templates.map((template) => ({
        value: template.name,
        label: template.name,
        id: template.id,
    }))

    useEffect(() => {
        if (selectedTemplateId === '') {
            setValue('')
        }
    }, [selectedTemplateId])

    const selectedTemplateName = React.useMemo(() => {
        const template = templates.find(
            (template) => template.id.toString() === selectedTemplateId
        )
        return template?.name
    }, [selectedTemplateId, templates])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="w-64">
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className=" justify-between"
                >
                    {value.length > 0
                        ? selectedTemplateName
                        : 'Select template'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="p-0 w-64" align="start">
                <Command>
                    <CommandInput placeholder="Search template..." />
                    <CommandEmpty>No template found.</CommandEmpty>
                    <ScrollArea className="h-[300px]">
                        <CommandGroup>
                            {normalizedValues.map((template) => (
                                <CommandItem
                                    key={template.id}
                                    onSelect={(currentValue) => {
                                        onSelectTemplate(template.id.toString())
                                        setOpen(false)
                                        setValue(currentValue)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === template.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                    {template.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </ScrollArea>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
