import { Menu } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useAsideMenuContext } from '../context/aside-menu-context'
import { AsideMenu } from '../components/aside-menu'
import { MainHierarchyMenu } from '../components/main-hierarchy-menu'
import { Outlet } from 'react-router-dom'
import { useGetMainHierarchyItemsQuery } from '../features/hierarchies/services/hierarchies'

export function MainLayout() {
    const { isAsideMenuOpen, setIsAsideMenuOpen } = useAsideMenuContext()
    const { data: mainHierarchyItems } = useGetMainHierarchyItemsQuery()

    if (mainHierarchyItems == null) return

    return (
        <div className="container mx-auto">
            <div className="flex items-center gap-10 mt-10">
                <Button
                    onClick={() => {
                        setIsAsideMenuOpen(!isAsideMenuOpen)
                    }}
                >
                    <Menu className="w-6 h-6" />
                </Button>
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
