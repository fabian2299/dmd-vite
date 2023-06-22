import { Loader2 } from 'lucide-react'
import { useGetClassesQuery } from '../features/classes/services/classes'
import { ClassTable } from '../features/classes/components/class-table/class-table'

export function Classes() {
    const {
        data: classes,
        isError,
        isLoading,
        isFetching,
    } = useGetClassesQuery()

    return (
        <main className="h-full min-h-[50vh] relative">
            {isLoading && (
                <div className="absolute inset-0  flex items-center justify-center ">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            )}

            {isError && <div>Error</div>}

            <section className="mt-10">
                {classes != null && !isLoading && (
                    <ClassTable data={classes} isFetching={isFetching} />
                )}
            </section>
        </main>
    )
}
