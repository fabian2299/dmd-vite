import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../../shared/components/ui/button'
import { ErrorHandlerMap, ErrorTypeEnum } from '../../../shared/lib/errors'
import { useGetCharByIdQuery, useUpdateCharMutation } from '../services/chars'
import { Characteristic } from '../../../shared/types/characteristic'

export function EditChar() {
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const charId = searchParams.get('charId')
    const navigate = useNavigate()

    const { data: char, isLoading } = useGetCharByIdQuery(charId!)
    const [updateChar] = useUpdateCharMutation()

    if (!char) return <p>Char not found</p>

    const handleUpdate = async (char: Characteristic) => {
        const charDTO = {
            ...char,
            name: 'Updated name',
        }

        try {
            await updateChar(charDTO).unwrap()
        } catch (error: any) {
            const errType = error.name as ErrorTypeEnum
            errorHandler[errType]()
        } finally {
            navigate('/resources/chars')
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
        <div>
            <Button onClick={() => handleUpdate(char)}>Update</Button>

            <div>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        <p>{char?.name}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
