import { useCallback, useMemo, useRef, useState } from 'react'

import {
    type GOLayer,
    type GOMap,
    GO_CONFIG,
    GoMapLoader,
    languages,
    position_x,
    position_y,
} from '@goaigua/go-gisapi'

import { type MapBrowserEvent, type Map as OlMap } from 'ol'
import { type FeatureLike } from 'ol/Feature'
import { unByKey } from 'ol/Observable'
import { type EventsKey } from 'ol/events'
import { useMainHierarchyFilterContext } from '../main-hierarchy-items-filter-context'
import { MapContext, type AssetMapSelectionOperation } from './map-context'
import { type Template } from '../../types/template'
import {
    findTemplatesForView,
    getAssignedLayersFromPortal,
} from './_services/map/queries'

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
    // third party hooks

    // constants
    const MAP_ID = 'asset-map'
    const TOC_ID = 'toc-container'
    const GO_TOC_DEFAULT_ID = 'ownTocContainer'
    const POLYGON_SELECTION_INTERACTION_ID = 'polygon-selection'

    // context
    const { selectedHierarchyItems } = useMainHierarchyFilterContext()

    // local state
    const [selectedAssetsMap, setSelectedAssetsMap] = useState<
        Map<number, FeatureLike>
    >(new Map())

    const [isTocDisplayed, setIsTocDisplayed] = useState<boolean>(false)

    const [currentSelectorId, setCurrentSelectorId] = useState<
        'drag' | 'intersect' | 'click' | 'polygon' | 'unselect'
    >('drag')

    const [operationCursor, setOperationCursor] = useState<number>(-1)

    const [operationList, setOperationList] = useState<
        Map<number, AssetMapSelectionOperation>
    >(new Map())

    const [assetMap, setAssetMap] = useState<GOMap>()

    const [templateList, setTemplateList] = useState<Template[]>([])

    const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

    const [rowAsset, setRowAsset] = useState<any>({
        id: -1,
        templateName: '',
        name: '',
        feature: null as unknown as FeatureLike,
    })

    const [isOpenIntersectByAssetForm, setIsOpenIntersectByAssetForm] =
        useState(false)

    const [isOpenIntersectForm, setIsOpenIntersectForm] = useState(false)

    const [assignedLayers, setAssignedLayers] = useState<GOLayer[]>([])

    // refs
    const selectedAssetsMapRef = useRef<Map<number, FeatureLike>>(new Map())
    const operationCursorRef = useRef<number>(-1)
    const operationListRef = useRef<Map<number, AssetMapSelectionOperation>>(
        new Map()
    )
    operationCursorRef.current = operationCursor
    operationListRef.current = operationList
    selectedAssetsMapRef.current = selectedAssetsMap
    // This is used on callbacks since
    // olMap.on callbacks store old values as reference.
    const currentInteractions = useRef<EventsKey[]>([])
    const firstUpdate = useRef(true)

    // functions
    const getLayers = async () => {
        try {
            const mapLayers = await getAssignedLayersFromPortal()
            setAssignedLayers(mapLayers)
            return mapLayers
        } catch (error) {
            console.error('error', error)
        }
    }

    const [isLoading, setIsLoading] = useState(false)

    const generateMap = useCallback(async () => {
        setIsLoading(true)
        // Generate layers from templates
        const mapLayers = await getLayers()
        const allTemplatesResponse = await findTemplatesForView()

        if (mapLayers == null || allTemplatesResponse == null) return

        setTemplateList(
            allTemplatesResponse.filter(
                (template: Template) => template.layerName
            )
        )

        // Prepare map configuration
        const config: any = {
            GOMapOptions: [
                {
                    id: MAP_ID,
                    div: 'asset-map',
                    optionView: {
                        id: 'vista1',
                        center: [-42010.86, 4789184.35],
                        zoom: 12,
                        projection: '3857',
                    },
                    filter: '',
                    bbox: false,
                    optionToc: {
                        id: TOC_ID,
                        lang: languages.EN,
                        active: true,
                        position_x: position_x.RIGHT,
                        position_y: position_y.TOP,
                        legend: true,
                        max_height: 500,
                        margin_lateral: 0,
                        no_switcher: [
                            {
                                folder: `Base Layers/`,
                                unique_active: true,
                            },
                        ],
                    },
                    layer: [
                        {
                            id: 'DarkTheme',
                            alias: 'Base',
                            layerType: 'GO_MAPBOX',
                            isBaseLayer: true,
                            urlFolder: `Base Layers/`,
                            style: 'ckugiqlos8tem17mpk9ne2oxd',
                            token: 'pk.eyJ1IjoiaWRyaWNhIiwiYSI6ImNrdWZpNHAwOTFlOHcycm10ZWlvcTJodTkifQ.kDBecIZHGx-7nf807n2xIQ',
                            epsg: 4326,
                            filter: '',
                            srs: 'EPSG:3857',
                            bbox: false,
                        },
                        ...mapLayers,
                    ],
                },
            ],
        }

        GoMapLoader.AddToken('')

        // Load the GoMap with the provided configuration
        const goMap = await GoMapLoader.loadGoMap(
            config,
            'https://gateway-proxy.dev.idrica.pro/',
            GO_CONFIG.REGION_ENVIROMENTS.EUROPE
        )

        // Set the assetMap state
        setIsLoading(false)
        setAssetMap(goMap)
    }, [])

    const objectTemplateSearch = ''
    const objectNameSearch = ''
    const objectDescriptionSearch = ''

    const addCqlFilterToLayers = useCallback(
        (layers: Map<string, GOLayer>) => {
            const buildFilters = () => {
                const filter: string[] = []

                // Apply template filter
                if (objectTemplateSearch.length > 0) {
                    const currentTemplate = templateList.find(
                        (template: Template) =>
                            template.id === +objectTemplateSearch
                    )
                    if (currentTemplate != null) {
                        filter.push(`template_id IN (${currentTemplate.id})`)
                    } else {
                        filter.push(`template_id IN (-1)`)
                    }
                }

                // Apply main hierarchy filter
                if (selectedHierarchyItems.length > 0) {
                    filter.push(
                        `main_hierarchy_parent_id IN (${selectedHierarchyItems.join(
                            ', '
                        )})`
                    )
                }

                // Apply object name and description filters
                if (
                    (objectNameSearch.length > 0 || objectDescriptionSearch) !==
                    ''
                ) {
                    filter.push(
                        `name ilike '%${objectNameSearch}%' AND short_description ilike '%${objectDescriptionSearch}%'`
                    )
                }

                return filter.join(' AND ')
            }

            const filterString = buildFilters()

            layers.forEach((layer) => {
                const alias = layer?.getAlias()

                if (
                    alias !== 'Base' &&
                    layer?.getLayerType() !== 'GO_WMS_LAYER'
                ) {
                    const currentLayer = layer as GOLayer & { addFilter: any }
                    currentLayer.addFilter(filterString, false)
                }
            })
        },
        [selectedHierarchyItems, templateList]
    )

    const removeFeaturesFromSelection = useCallback(
        (featuresToRemove: Map<number, FeatureLike>) => {
            const selectedAssetCopy = new Map(selectedAssetsMapRef.current)
            featuresToRemove.forEach((_, featureKey) => {
                if (selectedAssetCopy.has(featureKey)) {
                    selectedAssetCopy.delete(featureKey)
                }
            })
            setSelectedAssetsMap(selectedAssetCopy)
        },
        []
    )

    const registerSelectionAction = useCallback(
        (type: 'add' | 'remove', features: Map<number, FeatureLike>) => {
            if (features.size === 0) return

            const currentOperation: AssetMapSelectionOperation = {
                type,
                features,
            }
            const currentOperationList = new Map(operationListRef.current)

            if (
                operationCursorRef.current ===
                operationListRef.current.size - 1
            ) {
                const newIndex = currentOperationList.size
                currentOperationList.set(newIndex, currentOperation)
                setOperationList(currentOperationList)
                setOperationCursor(operationCursorRef.current + 1)
                return
            }

            const operationListFromCursor = new Map<
                number,
                AssetMapSelectionOperation
            >()

            // Copy operations from currentOperationList to operationListFromCursor up to operationCursorRef.current
            for (let i = 0; i <= operationCursorRef.current; i++) {
                operationListFromCursor.set(
                    i,
                    currentOperationList.get(i) as AssetMapSelectionOperation
                )
            }

            const newIndex = operationListFromCursor.size
            operationListFromCursor.set(newIndex, currentOperation)
            setOperationList(operationListFromCursor)
            setOperationCursor(operationCursorRef.current + 1)
        },
        []
    )

    const removeDuplicateFeatures = (
        features: FeatureLike[]
    ): FeatureLike[] => {
        const uniqueFeaturesMap = new Map<number, FeatureLike>()

        features.forEach((feature) => {
            const featureProperties = feature.getProperties()
            const dmdId = featureProperties.dmd_id
            if (!uniqueFeaturesMap.has(dmdId)) {
                uniqueFeaturesMap.set(dmdId, feature)
            }
        })

        return Array.from(uniqueFeaturesMap.values())
    }

    const extractFeatures = (data: FeatureLike[]) => {
        const features: FeatureLike[] = []

        data.forEach((item) => {
            const p = item.getProperties()

            if (p.dmd_id in p) {
                features.push(item)
            } else if (p.features in p) {
                p.features.forEach((feature: FeatureLike) => {
                    features.push(feature)
                })
            }
        })

        return features
    }

    const handlePointerSelection = useCallback(
        async (event: MapBrowserEvent<UIEvent>, olMap: OlMap) => {
            const clickedFeatures = olMap.getFeaturesAtPixel(event.pixel)
            const features = extractFeatures(clickedFeatures)

            const uniqueClickedFeatures = removeDuplicateFeatures(features)

            const selectedAssetsCopy = new Map(selectedAssetsMapRef.current)
            const removedFeatures = new Map<number, FeatureLike>()

            uniqueClickedFeatures?.forEach((feature: FeatureLike) => {
                const featureProperties = feature.getProperties()
                const dmdId = featureProperties.dmd_id
                const actionRegistrySlice = new Map<number, FeatureLike>()
                actionRegistrySlice.set(dmdId, feature)

                if (
                    !selectedAssetsCopy.has(dmdId) &&
                    !removedFeatures.has(dmdId)
                ) {
                    selectedAssetsCopy.set(dmdId, feature)
                    registerSelectionAction('add', actionRegistrySlice)
                } else {
                    removedFeatures.set(dmdId, feature)
                    selectedAssetsCopy.delete(dmdId)
                    registerSelectionAction('remove', actionRegistrySlice)
                }
            })

            setSelectedAssetsMap(selectedAssetsCopy)
        },
        [registerSelectionAction]
    )

    const addFeaturesFromSelection = useCallback(
        (featuresToAdd: Map<number, FeatureLike>) => {
            const selectedAssetCopy = new Map(selectedAssetsMapRef.current)
            featuresToAdd.forEach((feature: FeatureLike, key: number) => {
                selectedAssetCopy.set(key, feature)
            })
            setSelectedAssetsMap(selectedAssetCopy)
        },
        []
    )

    const handleUndo = useCallback(() => {
        if (
            operationCursorRef.current > -1 &&
            operationCursorRef.current < operationListRef.current.size
        ) {
            const currentOperation = operationListRef.current.get(
                operationCursorRef.current
            ) as AssetMapSelectionOperation

            if (currentOperation.type === 'add') {
                removeFeaturesFromSelection(currentOperation.features)
            } else if (currentOperation.type === 'remove') {
                addFeaturesFromSelection(currentOperation.features)
            }

            setOperationCursor(operationCursorRef.current - 1)
        }
    }, [addFeaturesFromSelection, removeFeaturesFromSelection])

    const handleRedo = useCallback(() => {
        if (
            operationCursorRef.current < operationListRef.current.size - 1 &&
            operationListRef.current.size > -1
        ) {
            const currentOperationCursor = operationCursorRef.current + 1
            const currentOperation = operationListRef.current.get(
                currentOperationCursor
            ) as AssetMapSelectionOperation

            if (currentOperation.type === 'remove') {
                removeFeaturesFromSelection(currentOperation.features)
            } else if (currentOperation.type === 'add') {
                addFeaturesFromSelection(currentOperation.features)
            }

            setOperationCursor(currentOperationCursor)
        }
    }, [addFeaturesFromSelection, removeFeaturesFromSelection])

    const handleRemoveSelection = useCallback(() => {
        const selectedAssetCopy = new Map(selectedAssetsMapRef.current)
        registerSelectionAction('remove', selectedAssetCopy)
        setSelectedAssetsMap(new Map())
    }, [registerSelectionAction])

    const handlePolygonSelection = useCallback(
        (featureList: FeatureLike[]) => {
            const features = extractFeatures(featureList)

            const selectedAssetCopy = new Map(selectedAssetsMapRef.current)
            const actionRegistrySlice = new Map<number, FeatureLike>()

            features.forEach((feature) => {
                const featureProperties = feature.getProperties()
                let isVisible = true
                assetMap?.getLayers(MAP_ID).forEach((layer: any) => {
                    if (featureProperties.template_name === layer.layerAlias) {
                        isVisible = layer.layer.getProperties().visible
                    }
                })

                if (isVisible) {
                    const dmdId = featureProperties.dmd_id
                    if (!selectedAssetCopy.has(dmdId)) {
                        selectedAssetCopy.set(dmdId, feature)
                        actionRegistrySlice.set(dmdId, feature)
                    }
                }
            })

            registerSelectionAction('add', actionRegistrySlice)
            setSelectedAssetsMap(selectedAssetCopy)
        },
        [assetMap, registerSelectionAction]
    )

    const setSelectorAsActive = useCallback(
        (key: string) => {
            if (currentSelectorId === key) {
                return '--active'
            } else {
                return ''
            }
        },
        [currentSelectorId]
    )

    const deselectFeatures = useCallback(
        (featureId: number) => {
            if (selectedAssetsMap.has(featureId)) {
                const feature = selectedAssetsMap.get(featureId)

                if (feature !== undefined) {
                    const dmdFeature = new Map<number, FeatureLike>([
                        [featureId, feature],
                    ])
                    removeFeaturesFromSelection(dmdFeature)
                    registerSelectionAction('remove', dmdFeature)
                }
            }
        },
        [
            registerSelectionAction,
            removeFeaturesFromSelection,
            selectedAssetsMap,
        ]
    )

    const toggleToc = useCallback(() => {
        document.getElementById(GO_TOC_DEFAULT_ID)?.classList.toggle('--active')
        setIsTocDisplayed(!isTocDisplayed)
    }, [isTocDisplayed])

    const centerFeature = useCallback(
        (geometryType: string, extent: number[]) => {
            if (geometryType === 'Point') {
                assetMap?.getView(MAP_ID).setCenter(extent)
                assetMap?.setZoom(MAP_ID, 20)
            } else {
                assetMap
                    ?.getView(MAP_ID)
                    .fit(extent, { padding: [10, 10, 10, 10] })
                assetMap?.setZoom(MAP_ID, 20)
            }
        },
        [assetMap]
    )

    const removeAllInteractions = useCallback(() => {
        // Removes interactions with the map
        if (currentInteractions != null && assetMap != null) {
            currentInteractions.current.forEach((interaction) => {
                unByKey(interaction)
            })
        }
        currentInteractions.current = []
        assetMap?.interactions.removeDrawSelectByPolygon(
            MAP_ID,
            POLYGON_SELECTION_INTERACTION_ID
        )
        document.getElementById(MAP_ID)?.removeAttribute('style')
    }, [assetMap])

    const value = useMemo(
        () => ({
            MAP_ID,
            TOC_ID,
            POLYGON_SELECTION_INTERACTION_ID,
            selectedAssetsMap,
            templateList,
            assetMap,
            selectedAssetsMapRef,
            operationCursor,
            operationList,
            isTocDisplayed,
            firstUpdate,
            currentSelectorId,
            currentInteractions,
            isCollapsed,
            rowAsset,
            isOpenIntersectByAssetForm,
            isOpenIntersectForm,
            assignedLayers,
            isLoading,
            generateMap,
            setAssignedLayers,
            registerSelectionAction,
            setIsOpenIntersectForm,
            setIsOpenIntersectByAssetForm,
            setRowAsset,
            removeAllInteractions,
            addCqlFilterToLayers,
            centerFeature,
            deselectFeatures,
            setSelectedAssetsMap,
            setSelectorAsActive,
            setCurrentSelectorId,
            handleRemoveSelection,
            handleUndo,
            handleRedo,
            toggleToc,
            handlePolygonSelection,
            handlePointerSelection,
            setIsCollapsed,
            extractFeatures,
        }),
        [
            selectedAssetsMap,
            templateList,
            assetMap,
            operationCursor,
            operationList,
            isTocDisplayed,
            currentSelectorId,
            isCollapsed,
            rowAsset,
            isOpenIntersectByAssetForm,
            isOpenIntersectForm,
            assignedLayers,
            isLoading,
            registerSelectionAction,
            removeAllInteractions,
            addCqlFilterToLayers,
            centerFeature,
            deselectFeatures,
            setSelectorAsActive,
            handleRemoveSelection,
            handleUndo,
            handleRedo,
            toggleToc,
            generateMap,
            handlePolygonSelection,
            handlePointerSelection,
        ]
    )

    return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}
