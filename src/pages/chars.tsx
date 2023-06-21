import { useGetCharsQuery } from '../features/chars/services/chars'
import { CharTable } from '../features/chars/components/char-table/char-table'

export function Chars() {
    const { data: chars, isError, isLoading } = useGetCharsQuery()

    return (
        <main className="">
            {isLoading && <div>Loading...</div>}

            {isError && <div>Error</div>}

            <section className="mt-10">
                {chars != null && <CharTable data={chars} />}
            </section>
        </main>
    )
}
