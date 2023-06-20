import { Link, Outlet } from 'react-router-dom'

export function ResourcesLayout() {
    return (
        <div className="container overflow-x-hidden min-h-screen mx-auto">
            <nav className="flex gap-10 p-4">
                <Link to="/resources/assets">Assets</Link>
                <Link to="/resources/templates">Templates</Link>
                <Link to="/resources/classes">Classes</Link>

                <Link to="/resources/chars">Chars</Link>
            </nav>

            <div className="">
                <Outlet />
            </div>
        </div>
    )
}
