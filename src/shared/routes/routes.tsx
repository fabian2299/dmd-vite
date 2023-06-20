import { createBrowserRouter } from 'react-router-dom'
import { Chars } from '../../pages/chars'
import { ResourcesLayout } from '../layouts/resources-layout'
import { Classes } from '../../pages/classes'
import { Templates } from '../../pages/templates'

export const router = createBrowserRouter([
    {
        path: '/resources',
        element: <ResourcesLayout />,
        children: [
            { path: 'chars', element: <Chars /> },
            { path: 'classes', element: <Classes /> },
            { path: 'templates', element: <Templates /> },
        ],
    },
])
