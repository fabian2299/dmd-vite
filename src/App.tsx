import { RouterProvider } from 'react-router-dom'
import { router } from './shared/routes/routes'
import { Providers } from './shared/providers/providers'

export function App() {
    return (
        <Providers>
            <RouterProvider router={router} />
        </Providers>
    )
}
