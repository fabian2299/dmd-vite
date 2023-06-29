import { Link, Outlet } from 'react-router-dom'
import { usePrefetch as usePrefetchClasses } from '@/features/classes/services/classes'
import { usePrefetch as usePrefetchChars } from '@/features/chars/services/chars'
import { usePrefetch as usePrefetchTemplates } from '@/features/templates/services/templates'

export function ResourcesLayout() {
    const prefetchClasses = usePrefetchClasses('getClasses')
    const prefetchChars = usePrefetchChars('getChars')
    const prefetchTemplates = usePrefetchTemplates('getTemplates')

    return (
        <>
            <div className="flex items-center gap-10">
                <nav className="flex gap-10 py-10">
                    <Link to="/resources/assets">Assets</Link>

                    <Link
                        to="/resources/templates"
                        onMouseEnter={() => {
                            prefetchTemplates()
                        }}
                    >
                        Templates
                    </Link>

                    <Link
                        to="/resources/classes"
                        onMouseEnter={() => {
                            prefetchClasses()
                        }}
                    >
                        Classes
                    </Link>

                    <Link
                        to="/resources/chars"
                        onMouseEnter={() => {
                            prefetchChars()
                        }}
                    >
                        Chars
                    </Link>
                </nav>
            </div>

            <div className="overflow-x-hidden min-h-[90vh] flex-1">
                <Outlet />
            </div>
        </>
    )
}
