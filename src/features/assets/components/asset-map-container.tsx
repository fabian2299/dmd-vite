/* eslint-disable @typescript-eslint/no-floating-promises */
import { AssetMap } from './asset-map'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useMapContext } from '../../../shared/context/map/map-context'

export function AssetMapContainer() {
    return <AssetMapLoaded />
}

const AssetMapLoaded = () => {
    const {
        MAP_ID,
        TOC_ID,
        isTocDisplayed,
        isLoading,
        generateMap,
        assetMap,
        setAssetMap,
    } = useMapContext()

    useEffect(() => {
        generateMap()

        return () => {
            setAssetMap(undefined)
        }
    }, [generateMap, setAssetMap])

    useEffect(() => {
        if (assetMap == null) return

        const firstChildDiv = document.querySelector('#' + MAP_ID + ' > div')

        if (firstChildDiv != null) {
            // Add tailwind classes to the first child div
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
