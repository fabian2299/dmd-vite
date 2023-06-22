import React from 'react'
import { type ErrorHandlerMap, ErrorTypeEnum } from '../shared/lib/errors'

import {
    useCreateTemplateMutation,
    useDeleteTemplateMutation,
    useGetTemplatesQuery,
    useUpdateTemplateMutation,
} from '../features/templates/services/templates'

export function Templates() {
    const { data: templates, isError, isLoading } = useGetTemplatesQuery()
    const [createTemplate, { isLoading: isCreating }] =
        useCreateTemplateMutation()
    const [updateTemplate] = useUpdateTemplateMutation()
    const [deleteTemplate] = useDeleteTemplateMutation()

    const [isDeletingMap, setIsDeletingMap] = React.useState({} as any)
    const [isUpdatingMap, setIsUpdatingMap] = React.useState({} as any)

    const handleDelete = async (id: number) => {
        setIsDeletingMap((prevState: any) => ({ ...prevState, [id]: true }))
        try {
            await deleteTemplate(id).unwrap()
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
        const templateDTO = {
            name: 'testt2',
            geometryType: 'Point',
            id: -1,
            origen: '',
            layerName: '',
            tenandId: -1,
            active: true,
            externalCode: '',
            code: null,
            isDeleteable: true,
            isDeleted: false,
            isModifiable: true,
        }
        try {
            await createTemplate(templateDTO).unwrap()
        } catch (error: any) {
            const errType = error.name as ErrorTypeEnum
            errorHandler[errType]()
        }
    }

    const handleUpdate = async (template: any) => {
        const templateDTO = {
            ...template,
            name: 'Updated name template',
        }

        setIsUpdatingMap((prevState: any) => ({
            ...prevState,
            [template.id]: true,
        }))

        try {
            await updateTemplate(templateDTO).unwrap()
        } catch (error: any) {
            const errType = error.name as ErrorTypeEnum
            errorHandler[errType]()
        } finally {
            setIsUpdatingMap((prevState: any) => ({
                ...prevState,
                [template.id]: false,
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

            {templates != null && templates.length > 0 && (
                <div className="mt-10">
                    <button
                        onClick={handleCreate}
                        className="border-2 px-4 py-2 rounded-md"
                    >
                        {isCreating ? 'Creating...' : 'Create'}
                    </button>

                    <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]  gap-6 my-10">
                        {templates.map((template) => (
                            <li
                                className="border-4 p-4 flex flex-col gap-4 items-start"
                                key={template.id}
                            >
                                <p> {template.name}</p>

                                <div className="flex gap-4">
                                    <button
                                        onClick={async () => {
                                            await handleDelete(template.id)
                                        }}
                                        className="border-2 px-4 py-2 rounded-md"
                                    >
                                        {isDeletingMap[template.id]
                                            ? 'Deleting...'
                                            : 'Delete'}
                                    </button>

                                    <button
                                        onClick={async () => {
                                            await handleUpdate(template)
                                        }}
                                        className="border-2 px-4 py-2 rounded-md"
                                    >
                                        {isUpdatingMap[template.id]
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
