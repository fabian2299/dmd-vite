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
import { useDeleteClassMutation } from '../../services/classes'
import { toast } from '../../../../components/ui/use-toast'

export function DeleteClass({ classId }: { classId: string }) {
    const [deleteClass, { isLoading: isDeleting }] = useDeleteClassMutation()
    const [open, setOpen] = useState(false)

    const handleDelete = async (id: string) => {
        try {
            await deleteClass(id).unwrap()
            toast({
                title: `Class deleted`,
                description: 'Class deleted successfully',
            })
        } catch (error) {
            console.log(error)
        } finally {
            setOpen(false)
        }
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
                        delete the class
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        asChild
                        className={buttonVariants({ variant: 'destructive' })}
                    >
                        <Button
                            onClick={async (e) => {
                                e.preventDefault()
                                await handleDelete(classId)
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
