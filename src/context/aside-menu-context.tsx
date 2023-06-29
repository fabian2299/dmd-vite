/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { createContext, useContext, useMemo, useState } from 'react'

interface AsideMenuContextProps {
    isAsideMenuOpen: boolean
    isHierarchyMenuOpen: boolean
    setIsHierarchyMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
    setIsAsideMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AsideMenuContext = createContext({} as AsideMenuContextProps)

export function AsideMenuProvider({ children }: { children: React.ReactNode }) {
    const [isAsideMenuOpen, setIsAsideMenuOpen] = useState(false)
    const [isHierarchyMenuOpen, setIsHierarchyMenuOpen] = useState(false)

    const value = useMemo(
        () => ({
            isAsideMenuOpen,
            isHierarchyMenuOpen,
            setIsAsideMenuOpen,
            setIsHierarchyMenuOpen,
        }),
        [isAsideMenuOpen, isHierarchyMenuOpen]
    )

    return (
        <AsideMenuContext.Provider value={value}>
            {children}
        </AsideMenuContext.Provider>
    )
}

export function useAsideMenuContext() {
    const context = useContext(AsideMenuContext)

    if (context === null) {
        throw new Error(
            'useAsideMenuContext must be used within AsideMenuProvider'
        )
    }

    return context
}
