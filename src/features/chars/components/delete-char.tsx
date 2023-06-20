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
import { useDeleteCharMutation } from '../services/chars'
import { useState } from 'react'

export function DeleteChar({ charId }: { charId: string }) {
    const [deleteChar, { isLoading: isDeleting }] = useDeleteCharMutation()
    const [open, setOpen] = useState(false)

    const handleDelete = async (id: string) => {
        try {
            await deleteChar(id).unwrap()
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
                        delete the char
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            variant={'destructive'}
                            onClick={(e) => {
                                e.preventDefault()
                                handleDelete(charId)
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
