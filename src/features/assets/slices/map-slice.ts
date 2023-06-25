import { type GOLayer, type GOMap } from '@goaigua/go-gisapi'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type Template } from '../../../shared/types/template'
import { type AssetMapSelectionOperation } from '../../../shared/context/map/map-context'
import { type FeatureLike } from 'ol/Feature'
const MAP_ID = 'asset-map'
const TOC_ID = 'toc-container'
const GO_TOC_DEFAULT_ID = 'ownTocContainer'
const POLYGON_SELECTION_INTERACTION_ID = 'polygon-selection'

interface MapState {
    mapID: string
    tocID: string
    GO_TOC_DEFAULT_ID: string
    POLYGON_SELECTION_INTERACTION_ID: string
    selectedAssetsMap: Map<number, FeatureLike>
    isTocDisplayed: boolean
    currentSelectorId: 'drag' | 'intersect' | 'click' | 'polygon' | 'unselect'
    operationCursor: number
    operationList: Map<number, AssetMapSelectionOperation>
    assetMap?: GOMap
    templateList: Template[]
    isCollapsed: boolean
    rowAsset: {
        id: number
        templateName: string
        name: string
        feature: FeatureLike
    }
    isOpenIntersectByAssetForm: boolean
    isOpenIntersectForm: boolean
    assignedLayers: GOLayer[]
    isLoading: boolean
}

const initialState: MapState = {
    mapID: MAP_ID,
    tocID: TOC_ID,
    GO_TOC_DEFAULT_ID,
    POLYGON_SELECTION_INTERACTION_ID,
    selectedAssetsMap: new Map(),
    isTocDisplayed: false,
    currentSelectorId: 'drag',
    operationCursor: -1,
    operationList: new Map(),
    assetMap: undefined,
    templateList: [],
    isCollapsed: false,
    rowAsset: {
        id: -1,
        templateName: '',
        name: '',
        feature: null as unknown as FeatureLike,
    },
    isOpenIntersectByAssetForm: false,
    isOpenIntersectForm: false,
    assignedLayers: [],
    isLoading: false,
}

export const mapSlice = createSlice({
    name: 'mapSlice',
    initialState,
    reducers: {
        setSelectedAssetsMap: (
            state,
            action: PayloadAction<Map<number, FeatureLike>>
        ) => {
            state.selectedAssetsMap = action.payload
        },
        setIsTocDisplayed: (state, action: PayloadAction<boolean>) => {
            state.isTocDisplayed = action.payload
        },
        setCurrentSelectorId: (
            state,
            action: PayloadAction<
                'drag' | 'intersect' | 'click' | 'polygon' | 'unselect'
            >
        ) => {
            state.currentSelectorId = action.payload
        },
    },
})

export const { setSelectedAssetsMap, setIsTocDisplayed, setCurrentSelectorId } =
    mapSlice.actions

export default mapSlice.reducer
