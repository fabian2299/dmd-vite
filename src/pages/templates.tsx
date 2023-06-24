import { Loader2 } from 'lucide-react'
import { useGetTemplatesQuery } from '../features/templates/services/templates'
import { TemplateTable } from '../features/templates/components/template-table/template-table'

export function Templates() {
    const {
        data: templates,
        isError,
        isLoading,
        isFetching,
    } = useGetTemplatesQuery()

    return (
        <main className="h-full min-h-[50vh] relative">
            {isLoading && (
                <div className="absolute inset-0  flex items-center justify-center ">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            )}

            {isError && <div>Error</div>}

            <section className="mt-10">
                {templates != null && !isLoading && (
                    <TemplateTable data={templates} isFetching={isFetching} />
                )}
            </section>
        </main>
    )
}
