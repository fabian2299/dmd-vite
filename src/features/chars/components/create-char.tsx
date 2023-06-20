import { Button } from '../../../shared/components/ui/button'
import { ErrorHandlerMap, ErrorTypeEnum } from '../../../shared/lib/errors'
import { useCreateCharMutation } from '../services/chars'

export function CreateChar() {
    const [createChar, { isLoading: isCreating }] = useCreateCharMutation()

    const handleCreate = async () => {
        const charDTO = {
            name: 'testt2',
            type: 'string',
            description: 'testt',
            editable: true,
            id: -1,
            measureUnit: null,
            origin: '',
            shortDescription: 'testt',
            geometry: {
                name: '',
                id: -1,
            },
            options: [],
            tenantId: -1,
            isRefCharacteristic: false,
            refCharacteristic: null,
            classImplementations: [],
            code: null,
            isDeleteable: true,
            isDeleted: false,
            isModifiable: true,
        }
        try {
            await createChar(charDTO).unwrap()
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
