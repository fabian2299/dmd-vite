import { Loader2 } from 'lucide-react'
import { useGetCharsQuery } from '../features/chars/services/chars'
import { CharTable } from '../features/chars/components/char-table/char-table'

export function Chars() {
    const { data: chars, isError, isLoading, isFetching } = useGetCharsQuery()

    return (
        <main className="h-full min-h-[50vh] relative">
            {isLoading && (
                <div className="absolute inset-0  flex items-center justify-center ">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            )}

            {isError && <div>Error</div>}

            <section className="mt-10">
                {chars != null && !isLoading && (
                    <CharTable data={chars} isFetching={isFetching} />
                )}
            </section>
        </main>
    )
}
