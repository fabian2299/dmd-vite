import React from 'react'
import {
    useCreateCharMutation,
    useDeleteCharMutation,
    useGetCharsQuery,
    useUpdateCharMutation,
} from '../features/chars/services/chars'
import { ErrorHandlerMap, ErrorTypeEnum } from '../shared/lib/errors'
import { CharTable } from '../features/chars/components/char-table'

export function Chars() {
    const { data: chars, isError, isLoading } = useGetCharsQuery()

    return (
        <main className="">
            {isLoading && <div>Loading...</div>}

            {isError && <div>Error</div>}

            <section className="mt-10">
                {chars && chars.length > 0 && <CharTable data={chars} />}
            </section>

            {/* {chars && chars.length > 0 && (
                <div className="mt-10">

                    <button
                        onClick={handleCreate}
                        className="border-2 px-4 py-2 rounded-md"
                    >
                        {isCreating ? 'Creating...' : 'Create'}
                    </button>

                    <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]  gap-6 my-10">
                        {chars.map((char) => (
                            <li
                                className="border-4 p-4 flex flex-col gap-4 items-start"
                                key={char.id}
                            >
                                <p> {char.name}</p>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleDelete(char.id)}
                                        className="border-2 px-4 py-2 rounded-md"
                                    >
                                        {isDeletingMap[char.id]
                                            ? 'Deleting...'
                                            : 'Delete'}
                                    </button>

                                    <button
                                        onClick={() => handleUpdate(char)}
                                        className="border-2 px-4 py-2 rounded-md"
                                    >
                                        {isUpdatingMap[char.id]
                                            ? 'Updating...'
                                            : 'Update'}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )} */}
        </main>
    )
}
