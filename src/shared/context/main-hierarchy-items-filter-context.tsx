/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { createContext, useContext, useMemo, useState } from 'react'

interface MainHierarchyItemsFilterContextProps {
    selectedHierarchyItems: number[]
    setSelectedHierarchyItems: React.Dispatch<React.SetStateAction<number[]>>
}

const MainHierarchyItemsFilterContext = createContext(
    {} as MainHierarchyItemsFilterContextProps
)

export function MainHierarchyItemsFilterProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [selectedHierarchyItems, setSelectedHierarchyItems] = useState<
        number[]
    >([])

    const value = useMemo(
        () => ({
            selectedHierarchyItems,
            setSelectedHierarchyItems,
        }),
        [selectedHierarchyItems]
    )

    return (
        <MainHierarchyItemsFilterContext.Provider value={value}>
            {children}
        </MainHierarchyItemsFilterContext.Provider>
    )
}

export function useMainHierarchyFilterContext() {
    const context = useContext(MainHierarchyItemsFilterContext)

    if (context === null) {
        throw new Error(
            'useMainHierarchyFilterContext must be used within MainHierarchyItemsFilterProvider'
        )
    }

    return context
}
