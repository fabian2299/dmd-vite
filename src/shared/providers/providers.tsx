import React from 'react'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { Toaster } from '../components/ui/toaster'
import { ModalProvider } from '../context/modal-context'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ModalProvider>
                {children}
                <Toaster />
            </ModalProvider>
        </Provider>
    )
}
