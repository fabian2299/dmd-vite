import { Loader2, Trash } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../../../../components/ui/alert-dialog'
import { Button, buttonVariants } from '../../../../components/ui/button'
import { useState } from 'react'
import { type ErrorHandlerMap, ErrorTypeEnum } from '@/lib/errors'
import { toast } from '../../../../components/ui/use-toast'
import { type AxiosError } from 'axios'
import { useDeleteTemplateMutation } from '../../services/templates'

export function DeleteTemplate({ templateId }: { templateId: string }) {
    const [deleteTemplate, { isLoading: isDeleting }] =
        useDeleteTemplateMutation()
    const [open, setOpen] = useState(false)

    const handleDelete = async (id: string) => {
        try {
            await deleteTemplate(id).unwrap()
            toast({
                title: `Template deleted`,
                description: 'Template deleted successfully',
            })
        } catch (error: unknown) {
            const errType = (error as AxiosError).name as ErrorTypeEnum
            errorHandler[errType]()
        } finally {
            setOpen(false)
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
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant={'outline'}>
                    <Trash className="text-red-700" size={20} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the char
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        asChild
                        className={buttonVariants({ variant: 'destructive' })}
                    >
                        <Button
                            onClick={async (e) => {
                                e.preventDefault()
                                await handleDelete(templateId)
                            }}
                            disabled={isDeleting}
                            className={'disabled:opacity-80'}
                        >
                            {isDeleting ? (
                                <div className="flex gap-2 items-center">
                                    <p>Deleting</p>
                                    <Loader2
                                        className="animate-spin text-white"
                                        size={20}
                                    />
                                </div>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
