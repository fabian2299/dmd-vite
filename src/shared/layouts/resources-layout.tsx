import { Link, Outlet } from 'react-router-dom'

export function ResourcesLayout() {
    return (
        <div className="container mx-auto">
            <nav className="flex gap-10 py-10">
                <Link to="/resources/assets">Assets</Link>
                <Link to="/resources/templates">Templates</Link>
                <Link to="/resources/classes">Classes</Link>
                <Link to="/resources/chars">Chars</Link>
            </nav>

            <div className="overflow-x-hidden min-h-[80vh] px-10">
                <Outlet />
            </div>
        </div>
    )
}
