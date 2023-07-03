import { useMapContext } from '@/context/map/map-context'
import { AssetMap } from './asset-map'
import { Loader2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { type GOLayer } from '@goaigua/go-gisapi'

export function AssetMapContainer({ mapLayers }: { mapLayers: GOLayer[] }) {
    const mapLayersCopy = useMemo(() => structuredClone(mapLayers), [mapLayers])

    const {
        MAP_ID,
        TOC_ID,
        isTocDisplayed,
        isLoading,
        assetMap,
        generateMap,
        setAssetMap,
    } = useMapContext()

    useEffect(() => {
        void generateMap(mapLayersCopy)

        return () => {
            setAssetMap(undefined)
        }
    }, [generateMap, mapLayersCopy, setAssetMap])

    useEffect(() => {
        if (assetMap == null) return

        const firstChildDiv = document.querySelector(`#${MAP_ID} > div`)

        if (firstChildDiv != null) {
            firstChildDiv.classList.add(
                'rounded-md',
                'shadow-lg',
                'shadow-blue-300'
            )
        }
    }, [MAP_ID, assetMap])

    return (
        <div>
            <div className="mt-10 h-[50rem] relative" id={MAP_ID}>
                {isLoading && (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="animate-spin text-blue-500 h-10 w-10" />
                    </div>
                )}

                {assetMap != null && !isLoading && (
                    <AssetMap assetMap={assetMap} />
                )}
            </div>

            <div
                className={
                    'c-asset-map-toc ' + (isTocDisplayed ? '' : '--hidden')
                }
                id={TOC_ID}
            />
        </div>
    )
}
