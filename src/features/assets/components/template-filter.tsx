import React, { useEffect } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../../../components/ui/popover'
import { Button } from '../../../components/ui/button'
import { CheckIcon, ChevronsUpDown } from 'lucide-react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '../../../components/ui/command'
import { ScrollArea } from '../../../components/ui/scroll-area'
import { type Template } from '@/types/template'
import { cn } from '@/utils/utils'

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

    const selectedTemplateName = React.useMemo(() => {
        const template = templates.find(
            (template) => template.id.toString() === selectedTemplateId
        )
        return template?.name
    }, [selectedTemplateId, templates])

    useEffect(() => {
        if (selectedTemplateId === '') {
            setValue('')
        }
    }, [selectedTemplateId])

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
                                        onSelectTemplate(
                                            currentValue === value
                                                ? ''
                                                : template.id.toString()
                                        )
                                        setValue(
                                            currentValue === value
                                                ? ''
                                                : currentValue
                                        )
                                        setOpen(false)
                                    }}
                                >
                                    {template.label}
                                    <CheckIcon
                                        className={cn(
                                            'ml-auto h-4 w-4',
                                            template.id.toString() ===
                                                selectedTemplateId
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </ScrollArea>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
