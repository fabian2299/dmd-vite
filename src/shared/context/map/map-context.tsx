'use client'

import React from 'react'
import { type FeatureLike } from 'ol/Feature'

export interface AssetMapSelectionOperation {
    type: 'add' | 'remove'
    features: Map<number, FeatureLike>
}

interface MapContextValue {}

export const MapContext = React.createContext({} as any)

// useMapContext hook
export const useMapContext = () => {
    const context = React.useContext(MapContext)
    if (context === null) {
        throw new Error('useMapContext must be used within a MapProvider')
    }
    return context
}
