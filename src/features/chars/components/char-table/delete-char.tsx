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
} from '../../../../shared/components/ui/alert-dialog'
import { Button, buttonVariants } from '../../../../shared/components/ui/button'
import { useDeleteCharMutation } from '../../services/chars'
import { useState } from 'react'
import {
    type ErrorHandlerMap,
    ErrorTypeEnum,
} from '../../../../shared/lib/errors'
import { toast } from '../../../../shared/components/ui/use-toast'
import { type AxiosError } from 'axios'

export function DeleteChar({ charId }: { charId: string }) {
    const [deleteChar, { isLoading: isDeleting }] = useDeleteCharMutation()
    const [open, setOpen] = useState(false)

    const handleDelete = async (id: string) => {
        try {
            await deleteChar(id).unwrap()
            toast({
                title: `Char deleted`,
                description: 'Char deleted successfully',
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
                                await handleDelete(charId)
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
