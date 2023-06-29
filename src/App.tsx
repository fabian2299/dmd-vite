import { Providers } from '@/providers/providers'
import { router } from '@/routes/routes'
import { RouterProvider } from 'react-router-dom'

export function App() {
    return (
        <Providers>
            <RouterProvider router={router} />
        </Providers>
    )
}
