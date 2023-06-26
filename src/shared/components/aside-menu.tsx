import { Link } from 'react-router-dom'
import { useAsideMenuContext } from '../context/aside-menu-context'
import { Button, buttonVariants } from './ui/button'

export function AsideMenu() {
    const { isAsideMenuOpen, setIsHierarchyMenuOpen, isHierarchyMenuOpen } =
        useAsideMenuContext()

    return (
        <>
            {isAsideMenuOpen ? (
                <aside className="min-h-[calc(100vh_-_80px)] border-r px-4">
                    <nav className="mt-10">
                        <div className="flex w-full flex-col">
                            <Button
                                onClick={() => {
                                    setIsHierarchyMenuOpen(!isHierarchyMenuOpen)
                                }}
                            >
                                Main Hierarchy
                            </Button>

                            <div className="mt-20 flex w-full flex-col gap-8">
                                <Link
                                    className={`${buttonVariants()}w-full`}
                                    to="/resources/assets"
                                >
                                    Resources
                                </Link>

                                <Link
                                    className={`${buttonVariants()}w-full`}
                                    to="/hierarchies"
                                >
                                    Hierarchies
                                </Link>

                                <Link
                                    className={`${buttonVariants()} w-full`}
                                    to="/apps"
                                >
                                    Apps
                                </Link>

                                <Link
                                    className={`${buttonVariants()} w-full`}
                                    to="/roles/users"
                                >
                                    Roles
                                </Link>
                            </div>
                        </div>
                    </nav>
                </aside>
            ) : null}
        </>
    )
}
