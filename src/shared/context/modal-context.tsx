/* eslint-disable @typescript-eslint/consistent-type-assertions */
import React, { useState, useCallback, useMemo } from 'react'

interface ModalContextProps {
    isModalOpen: boolean
    openModal: () => void
    closeModal: () => void
}

const ModalContext = React.createContext({} as ModalContextProps)

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = useCallback(() => {
        setIsModalOpen(true)
    }, [])

    const closeModal = useCallback(() => {
        setIsModalOpen(false)
    }, [])

    const value = useMemo(
        () => ({
            isModalOpen,
            openModal,
            closeModal,
        }),
        [closeModal, isModalOpen, openModal]
    )

    return (
        <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
    )
}

export const useModalContext = () => {
    const context = React.useContext(ModalContext)

    if (context === undefined) {
        throw new Error('useModalContext must be used within a ModalProvider')
    }

    return context
}
