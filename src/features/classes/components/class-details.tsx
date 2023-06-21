import { useLocation, useNavigate } from 'react-router-dom'
import {
    useGetClassByIdQuery,
    useUpdateClassMutation,
} from '../services/classes'
import { Class } from '../../../shared/types/class'
import { ErrorHandlerMap, ErrorTypeEnum } from '../../../shared/lib/errors'
import { Button } from '../../../shared/components/ui/button'
import { toast } from '../../../shared/components/ui/use-toast'

export function ClassDetails() {
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const classId = searchParams.get('classId')
    const navigate = useNavigate()

    const { data: classObj, isLoading } = useGetClassByIdQuery(classId!)
    const [updateClass, { isLoading: isUpdating }] = useUpdateClassMutation()

    const handleUpdate = async (classObj: Class) => {
        const classDTO = {
            ...classObj,
            name: 'Updated name',
        }

        try {
            await updateClass(classDTO).unwrap()
            toast({
                title: 'Class updated',
                description: 'Class updated successfully',
            })
        } catch (error: any) {
            const errType = error.name as ErrorTypeEnum
            errorHandler[errType]()
        } finally {
            navigate('/resources/classes')
        }
    }

    const errorHandler: ErrorHandlerMap = {
        [ErrorTypeEnum.DuplicateNameException]: () => {
            toast({
                title: 'Duplicate name',
                description: 'Class name already exists',
            })
        },
        [ErrorTypeEnum.InsufficientPermissionsException]: () => {
            toast({
                title: 'Insufficient permissions',
                description: 'You do not have permissions to update this class',
            })
        },
        [ErrorTypeEnum.DefaultError]: () => {
            toast({
                title: 'Error',
                description: 'An error occurred while updating the class',
            })
        },
    }

    if (isLoading) return <p>Loading...</p>

    if (!classObj) return <p>Class not found</p>

    return (
        <div>
            <Button onClick={() => handleUpdate(classObj)}>
                {isUpdating ? 'Updating...' : 'Update'}
            </Button>

            <div className="text-center">
                <p>{classObj.name}</p>
            </div>
        </div>
    )
}
