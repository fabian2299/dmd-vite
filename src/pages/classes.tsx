import React from 'react'
import { ErrorHandlerMap, ErrorTypeEnum } from '../shared/lib/errors'
import {
    useCreateClassMutation,
    useDeleteClassMutation,
    useGetClassesQuery,
    useUpdateClassMutation,
} from '../features/classes/services/classes'
import { ClassTable } from '../features/classes/components/class-table'

export function Classes() {
    const { data: classes, isError, isLoading } = useGetClassesQuery()
    const [createClass, { isLoading: isCreating }] = useCreateClassMutation()
    const [updateClass] = useUpdateClassMutation()
    const [deleteClass] = useDeleteClassMutation()

    const handleDelete = async (id: number) => {
        try {
            await deleteClass(id).unwrap()
        } catch (error) {
            console.log(error)
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

        try {
            await updateClass(classDTO).unwrap()
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
        <main className="">
            {isLoading && <div>Loading...</div>}

            {isError && <div>Error</div>}

            <section className="mt-10">
                {classes && <ClassTable data={classes} />}
            </section>
        </main>
    )
}
