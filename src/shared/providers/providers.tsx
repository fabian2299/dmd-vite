import React from 'react'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { Toaster } from '../components/ui/toaster'
import { ModalProvider } from '../context/modal-context'
import { AsideMenuProvider } from '../context/aside-menu-context'
import { MainHierarchyItemsFilterProvider } from '../context/main-hierarchy-items-filter-context'
import { MapProvider } from '../context/map/map-provider'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ModalProvider>
                <MapProvider>
                    <AsideMenuProvider>
                        <MainHierarchyItemsFilterProvider>
                            {children}
                            <Toaster />
                        </MainHierarchyItemsFilterProvider>
                    </AsideMenuProvider>
                </MapProvider>
            </ModalProvider>
        </Provider>
    )
}
