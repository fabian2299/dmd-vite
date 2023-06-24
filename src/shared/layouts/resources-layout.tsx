import { Link, Outlet } from 'react-router-dom'
import { AsideMenu } from '../components/aside-menu'
import { useAsideMenuContext } from '../context/aside-menu-context'
import { Button } from '../components/ui/button'
import { Menu } from 'lucide-react'
import { MainHierarchyMenu } from '../components/main-hierarchy-menu'
import { useGetMainHierarchyItemsQuery } from '../../features/hierarchies/services/hierarchies'

export function ResourcesLayout() {
    const { isAsideMenuOpen, setIsAsideMenuOpen } = useAsideMenuContext()
    const {
        data: mainHierarchyItems,
        isLoading,
        isError,
    } = useGetMainHierarchyItemsQuery()

    if (isLoading) return

    if (isError) return

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
                    <Link to="/resources/templates">Templates</Link>
                    <Link to="/resources/classes">Classes</Link>
                    <Link to="/resources/chars">Chars</Link>
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
