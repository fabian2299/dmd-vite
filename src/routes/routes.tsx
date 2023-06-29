import { MainLayout } from '@/layouts/main-layout'
import { ResourcesLayout } from '@/layouts/resources-layout'
import { Apps } from '@/pages/apps'
import { Assets } from '@/pages/assets'
import { Chars } from '@/pages/chars'
import { Classes } from '@/pages/classes'
import { Templates } from '@/pages/templates'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: 'resources',
                element: <ResourcesLayout />,
                children: [
                    { path: 'chars', element: <Chars /> },
                    { path: 'classes', element: <Classes /> },
                    { path: 'templates', element: <Templates /> },
                    { path: 'assets', element: <Assets /> },
                ],
            },

            {
                path: 'apps',
                element: <Apps />,
            },
        ],
    },
])
