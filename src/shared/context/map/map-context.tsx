/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-assertions */

import React, { type MutableRefObject } from 'react'
import { type FeatureLike } from 'ol/Feature'
import { type Template } from '../../types/template'
import { type GOLayer, type GOMap } from '@goaigua/go-gisapi'
import { type EventsKey } from 'ol/events'
import { type Map as OlMap, type MapBrowserEvent } from 'ol'

export interface AssetMapSelectionOperation {
    type: 'add' | 'remove'
    features: Map<number, FeatureLike>
}

interface MapContextProps {
    MAP_ID: string
    TOC_ID: string
    POLYGON_SELECTION_INTERACTION_ID: string
    selectedAssetsMap: Map<number, FeatureLike>
    templateList: Template[]
    assetMap: GOMap | undefined
    selectedAssetsMapRef: React.MutableRefObject<Map<number, FeatureLike>>
    operationCursor: number
    operationList: Map<number, AssetMapSelectionOperation>
    isTocDisplayed: boolean
    firstUpdate: MutableRefObject<boolean>
    currentSelectorId: 'drag' | 'intersect' | 'click' | 'polygon' | 'unselect'
    currentInteractions: React.MutableRefObject<EventsKey[]>
    isCollapsed: boolean
    rowAsset: any
    isOpenIntersectByAssetForm: boolean
    isOpenIntersectForm: boolean
    assignedLayers: GOLayer[]
    isLoading: boolean
    setAssignedLayers: React.Dispatch<React.SetStateAction<GOLayer[]>>
    registerSelectionAction: (
        type: 'add' | 'remove',
        features: Map<number, FeatureLike>
    ) => void
    setAssetMap: React.Dispatch<React.SetStateAction<GOMap | undefined>>
    setIsOpenIntersectForm: React.Dispatch<React.SetStateAction<boolean>>
    setIsOpenIntersectByAssetForm: React.Dispatch<React.SetStateAction<boolean>>
    setRowAsset: React.Dispatch<React.SetStateAction<any>>
    removeAllInteractions: () => void
    addCqlFilterToLayers: (layers: Map<string, GOLayer>) => void
    centerFeature: (geometryType: string, extent: number[]) => void
    deselectFeatures: (featureId: number) => void
    setSelectedAssetsMap: React.Dispatch<
        React.SetStateAction<Map<number, FeatureLike>>
    >
    setSelectorAsActive: (key: string) => '' | '--active'
    setCurrentSelectorId: React.Dispatch<
        React.SetStateAction<
            'drag' | 'intersect' | 'click' | 'polygon' | 'unselect'
        >
    >
    handleRemoveSelection: () => void
    handleUndo: () => void
    handleRedo: () => void
    toggleToc: () => void
    generateMap: () => Promise<void>
    handlePolygonSelection: (featureList: FeatureLike[]) => void
    handlePointerSelection: (
        event: MapBrowserEvent<UIEvent>,
        olMap: OlMap
    ) => Promise<void>
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
    extractFeatures: (data: FeatureLike[]) => FeatureLike[]
}

export const MapContext = React.createContext({} as MapContextProps)

// useMapContext hook
export const useMapContext = () => {
    const context = React.useContext(MapContext)
    if (context === null) {
        throw new Error('useMapContext must be used within a MapProvider')
    }
    return context
}
