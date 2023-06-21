import { Button } from '../../../shared/components/ui/button'
import { ErrorHandlerMap, ErrorTypeEnum } from '../../../shared/lib/errors'
import { useCreateClassMutation } from '../services/classes'

export function CreateClass() {
    const [createClass, { isLoading: isCreating }] = useCreateClassMutation()

    const handleCreate = async () => {
        const classDTO = {
            name: 'testt2',
            isMainClass: false,
            active: true,
            id: -1,
            characteristics: [{ id: 86 }],
            isDeleteable: true,
            isDeleted: false,
            isModifiable: true,
            tenandId: -1,
            origen: '',
            code: null,
        }
        try {
            await createClass(classDTO).unwrap()
        } catch (error: any) {
            const errType = error.name as ErrorTypeEnum
            errorHandler[errType]()
        }
    }

    const errorHandler: ErrorHandlerMap = {
        [ErrorTypeEnum.DuplicateNameException]: () => {
            console.log('DuplicateNameException')
        },
        [ErrorTypeEnum.InsufficientPermissionsException]: () => {
            console.log('InsufficientPermissionsException')
        },
        [ErrorTypeEnum.DefaultError]: () => {
            console.log('DefaultError')
        },
    }

    return (
        <Button onClick={handleCreate}>
            {isCreating ? 'Creating...' : 'Create'}
        </Button>
    )
}
