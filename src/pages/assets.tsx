import { Loader2 } from 'lucide-react'
import { AssetTableContainer } from '../features/assets/components/asset-table'
import { useGetTemplatesQuery } from '../features/templates/services/templates'

export function Assets() {
    const { data: templates, isError, isLoading } = useGetTemplatesQuery()

    return (
        <main className="relative">
            {isLoading && (
                <div className="absolute inset-0  flex items-center justify-center ">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            )}

            {isError && <div>Error</div>}

            <section className="mt-10">
                {templates != null && !isLoading && (
                    <AssetTableContainer templates={templates} />
                )}
            </section>
        </main>
    )
}
