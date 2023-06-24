/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { type MapBrowserEvent } from 'ol'
import { useMapContext } from '../../../shared/context/map/map-context'

export function AssetMap() {
    const {
        MAP_ID,
        TOC_ID,
        POLYGON_SELECTION_INTERACTION_ID,
        selectedAssetsMap,
        operationCursor,
        operationList,
        isTocDisplayed,
        assetMap,
        currentSelectorId,
        currentInteractions,
        isCollapsed,
        selectedAssetsMapRef,
        setSelectorAsActive,
        setCurrentSelectorId,
        handleRemoveSelection,
        handleUndo,
        handleRedo,
        toggleToc,
        generateMap,
        addCqlFilterToLayers,
        removeAllInteractions,
        handlePointerSelection,
        handlePolygonSelection,
        setIsOpenIntersectForm,
    } = useMapContext()

    console.log('assetMap', assetMap)

    const [isIntersectOpenMenu, setIsIntersectOpenMenu] = useState(false)

    // generate map when component is mounted
    useEffect(() => {
        const initializeMap = async () => {
            await generateMap()
        }

        initializeMap()
    }, [generateMap])

    // make layers visible when map is loaded
    useEffect(() => {
        if (assetMap != null) return
        const getLayers = async () => {
            const layers = await assetMap.getLayers(MAP_ID)
            addCqlFilterToLayers(layers)
        }

        getLayers()
    }, [assetMap, addCqlFilterToLayers, MAP_ID])

    // highlight selected assets
    useEffect(() => {
        if (assetMap != null) return

        if (assetMap.interactions.hasHighlight(MAP_ID, 'myHighlightCluster')) {
            assetMap.interactions.removeHighlight(MAP_ID, 'myHighlightCluster')
        }

        if (assetMap?.interactions.hasHighlight(MAP_ID, 'highlightClusterID')) {
            assetMap.interactions.removeHighlight(MAP_ID, 'highlightClusterID')
        }

        const addHighlight = async () => {
            if (
                selectedAssetsMap &&
                selectedAssetsMap.size > 0 &&
                selectedAssetsMapRef.current
            ) {
                const mappedValues = Array.from(
                    selectedAssetsMapRef.current.values(),
                    (value) => {
                        return value
                    }
                )

                const style = {
                    type: 'ALL',
                    stroke: {
                        color: 'rgba(242,245,60, .8)',
                        width: 3,
                    },
                    fill: {
                        color: 'rgba(255,255,255, 0.2)',
                    },
                    graphic: {
                        size: 10,
                        radiousSize: '10',
                        rotation: 0,
                        typePoint: 'circle',
                    },
                }

                await assetMap.interactions.addHighlight(
                    MAP_ID,
                    'myHighlightCluster',
                    mappedValues,
                    style
                )
            }
        }

        addHighlight()
    }, [assetMap, MAP_ID, selectedAssetsMapRef, selectedAssetsMap])

    // remove interactions when selector changes and handle click and polygon interactions
    const selectorHandlers: any = useMemo(() => {
        if (!assetMap) return
        return {
            click: () => {
                const olMap = assetMap.getMap(MAP_ID)
                const interaction = olMap?.on(
                    'singleclick',
                    (e: MapBrowserEvent<UIEvent>) => {
                        handlePointerSelection(e, olMap)
                    }
                )
                if (interaction) {
                    currentInteractions.current.push(interaction)
                }
            },
            polygon: () => {
                assetMap.interactions.addDrawSelectByPolygon(
                    MAP_ID,
                    POLYGON_SELECTION_INTERACTION_ID,
                    handlePolygonSelection
                )
            },
            drag: () => {},
            unselect: () => {},
            intersect: () => {},
        }
    }, [
        MAP_ID,
        POLYGON_SELECTION_INTERACTION_ID,
        assetMap,
        currentInteractions,
        handlePointerSelection,
        handlePolygonSelection,
    ])

    const handleInteraction = useCallback(() => {
        removeAllInteractions()
        if (selectorHandlers?.hasOwnProperty(currentSelectorId)) {
            selectorHandlers[currentSelectorId]()
        }
    }, [currentSelectorId, removeAllInteractions, selectorHandlers])

    useEffect(() => {
        handleInteraction()
    }, [handleInteraction])

    // close intersect menu when selector changes
    useEffect(() => {
        if (currentSelectorId !== 'intersect') {
            setIsIntersectOpenMenu(false)
        }
    }, [currentSelectorId, setIsIntersectOpenMenu])

    return (
        <>
            <div
                className=" mt-10 h-[50rem]  border-2 border-orange-800"
                id={MAP_ID}
            >
                <div
                    className={`c-asset-map__selection-modal ${
                        isCollapsed || !selectedAssetsMap.size
                            ? 'c-asset-map__selection-modal--collapsed'
                            : ''
                    }`}
                >
                    {/* <AssetMapModal /> */}
                </div>

                <div className="c-asset-map__control">
                    <div className="c-asset-map__selection-group">
                        <div
                            className={
                                'c-asset-map__selection-button --drag c-asset-map__control-button ' +
                                setSelectorAsActive('drag')
                            }
                            onClick={() => setCurrentSelectorId('drag')}
                        />
                        <div
                            onClick={() => {
                                setCurrentSelectorId('intersect')
                                setIsIntersectOpenMenu(!isIntersectOpenMenu)
                            }}
                            className={
                                'c-asset-map__selection-button --intersect c-asset-map__control-button ' +
                                setSelectorAsActive('intersect')
                            }
                        >
                            {isIntersectOpenMenu && (
                                <button
                                    onClick={() => setIsOpenIntersectForm(true)}
                                    className="button-layer-options"
                                >
                                    Title
                                </button>
                            )}
                        </div>

                        <div
                            className={
                                'c-asset-map__selection-button --click c-asset-map__control-button ' +
                                setSelectorAsActive('click')
                            }
                            onClick={() => setCurrentSelectorId('click')}
                        />
                        <div
                            className={
                                'c-asset-map__selection-button --polygon c-asset-map__control-button ' +
                                setSelectorAsActive('polygon')
                            }
                            onClick={() => setCurrentSelectorId('polygon')}
                        />
                        <div
                            className={
                                'c-asset-map__selection-button --unselect c-asset-map__control-button ' +
                                (selectedAssetsMap.size === 0
                                    ? '--disabled'
                                    : '')
                            }
                            onClick={() =>
                                selectedAssetsMap.size > 0 &&
                                handleRemoveSelection()
                            }
                        />
                        <div
                            className={
                                'c-asset-map__selection-button --undo c-asset-map__control-button ' +
                                (operationCursor > -1 &&
                                operationCursor < operationList.size
                                    ? ''
                                    : '--disabled')
                            }
                            onClick={handleUndo}
                        />
                        <div
                            className={
                                'c-asset-map__selection-button --redo c-asset-map__control-button ' +
                                (operationCursor < operationList.size - 1 &&
                                operationList.size > -1
                                    ? ''
                                    : '--disabled')
                            }
                            onClick={handleRedo}
                        />
                    </div>
                    <div
                        className={
                            'c-asset-map__toc-toggle c-asset-map__control-button ' +
                            (isTocDisplayed ? '--active' : '')
                        }
                        onClick={toggleToc}
                    />
                </div>
                <div
                    className={
                        'c-asset-map-toc ' + (isTocDisplayed ? '' : '--hidden')
                    }
                    id={TOC_ID}
                />
            </div>

            {/* <IntersectLayersForm /> */}
        </>
    )
}
