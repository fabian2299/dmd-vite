import React from 'react'
import { ErrorHandlerMap, ErrorTypeEnum } from '../shared/lib/errors'
import {
    useCreateClassMutation,
    useDeleteClassMutation,
    useGetClassesQuery,
    useUpdateClassMutation,
} from '../features/classes/services/classes'

export function Classes() {
    const { data: classes, isError, isLoading } = useGetClassesQuery()
    const [createClass, { isLoading: isCreating }] = useCreateClassMutation()
    const [updateClass] = useUpdateClassMutation()
    const [deleteClass] = useDeleteClassMutation()

    const [isDeletingMap, setIsDeletingMap] = React.useState({} as any)
    const [isUpdatingMap, setIsUpdatingMap] = React.useState({} as any)

    const handleDelete = async (id: number) => {
        setIsDeletingMap((prevState: any) => ({ ...prevState, [id]: true }))
        try {
            await deleteClass(id).unwrap()
        } catch (error) {
            console.log(error)
        } finally {
            setIsDeletingMap((prevState: any) => ({
                ...prevState,
                [id]: false,
            }))
        }
    }

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

    const handleUpdate = async (classObj: any) => {
        const classDTO = {
            ...classObj,
            name: 'Updated name class',
        }

        setIsUpdatingMap((prevState: any) => ({
            ...prevState,
            [classObj.id]: true,
        }))

        try {
            await updateClass(classDTO).unwrap()
        } catch (error: any) {
            const errType = error.name as ErrorTypeEnum
            errorHandler[errType]()
        } finally {
            setIsUpdatingMap((prevState: any) => ({
                ...prevState,
                [classObj.id]: false,
            }))
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
        <main className="">
            {isLoading && <div>Loading...</div>}

            {isError && <div>Error</div>}

            {classes && classes.length > 0 && (
                <div className="mt-10">
                    <button
                        onClick={handleCreate}
                        className="border-2 px-4 py-2 rounded-md"
                    >
                        {isCreating ? 'Creating...' : 'Create'}
                    </button>

                    <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]  gap-6 my-10">
                        {classes.map((classObj: any) => (
                            <li
                                className="border-4 p-4 flex flex-col gap-4 items-start"
                                key={classObj.id}
                            >
                                <p> {classObj.name}</p>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() =>
                                            handleDelete(classObj.id)
                                        }
                                        className="border-2 px-4 py-2 rounded-md"
                                    >
                                        {isDeletingMap[classObj.id]
                                            ? 'Deleting...'
                                            : 'Delete'}
                                    </button>

                                    <button
                                        onClick={() => handleUpdate(classObj)}
                                        className="border-2 px-4 py-2 rounded-md"
                                    >
                                        {isUpdatingMap[classObj.id]
                                            ? 'Updating...'
                                            : 'Update'}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </main>
    )
}
