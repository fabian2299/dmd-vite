import React from 'react'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { Toaster } from '../components/ui/toaster'
import { ModalProvider } from '../context/modal-context'
import { AsideMenuProvider } from '../context/aside-menu-context'
import { MainHierarchyItemsFilterProvider } from '../context/main-hierarchy-items-filter-context'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ModalProvider>
                <AsideMenuProvider>
                    <MainHierarchyItemsFilterProvider>
                        {children}
                        <Toaster />
                    </MainHierarchyItemsFilterProvider>
                </AsideMenuProvider>
            </ModalProvider>
        </Provider>
    )
}
