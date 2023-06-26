import { Link, Outlet } from 'react-router-dom'
import { AsideMenu } from '../components/aside-menu'
import { useAsideMenuContext } from '../context/aside-menu-context'
import { Button } from '../components/ui/button'
import { Menu } from 'lucide-react'
import { MainHierarchyMenu } from '../components/main-hierarchy-menu'
import { useGetMainHierarchyItemsQuery } from '../../features/hierarchies/services/hierarchies'
import { usePrefetch as usePrefetchClasses } from '../../features/classes/services/classes'
import { usePrefetch as usePrefetchChars } from '../../features/chars/services/chars'
import { usePrefetch as usePrefetchTemplates } from '../../features/templates/services/templates'

export function ResourcesLayout() {
    const { isAsideMenuOpen, setIsAsideMenuOpen } = useAsideMenuContext()
    const prefetchClasses = usePrefetchClasses('getClasses')
    const prefetchChars = usePrefetchChars('getChars')
    const prefetchTemplates = usePrefetchTemplates('getTemplates')

    const { data: mainHierarchyItems } = useGetMainHierarchyItemsQuery()

    if (mainHierarchyItems == null) return

    return (
        <div className="container mx-auto">
            <div className="flex items-center gap-10">
                <Button
                    onClick={() => {
                        setIsAsideMenuOpen(!isAsideMenuOpen)
                    }}
                >
                    <Menu className="w-6 h-6" />
                </Button>

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

            <div className="flex">
                <AsideMenu />

                <MainHierarchyMenu mainHierarchyItems={mainHierarchyItems} />

                <div className="overflow-x-hidden min-h-[90vh] px-10 flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
