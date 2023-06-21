import { Trash } from 'lucide-react'
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
} from '../../../shared/components/ui/alert-dialog'

import { Button } from '../../../shared/components/ui/button'
import { useState } from 'react'
import { useDeleteClassMutation } from '../services/classes'

export function DeleteClass({ classId }: { classId: string }) {
    const [deleteClass, { isLoading: isDeleting }] = useDeleteClassMutation()
    const [open, setOpen] = useState(false)

    const handleDelete = async (id: string) => {
        try {
            await deleteClass(id).unwrap()
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
                    <AlertDialogAction asChild>
                        <Button
                            variant={'destructive'}
                            onClick={(e) => {
                                e.preventDefault()
                                handleDelete(classId)
                            }}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
