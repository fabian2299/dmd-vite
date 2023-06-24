import { useCallback, useEffect, useState } from 'react'
import { useGetAssetsMutation, useGetCountMutation } from '../services/assets'
import {
    type AssetTableViewFilters,
    type AssetTableView,
} from '../../../shared/types/asset'

interface Props {
    filters: any
    pagination: {
        page: number
        pageSize: number
    }
}

export const useGetAssets = ({ filters, pagination }: Props) => {
    const [getAssets, { isLoading: isLoadingAssets }] = useGetAssetsMutation()
    const [getCount] = useGetCountMutation()
    const [assets, setAssets] = useState<AssetTableView[]>([])
    const [count, setCount] = useState(0)

    const fetchAssets = useCallback(async () => {
        try {
            const result = await getAssets({ filters, pagination }).unwrap()
            setAssets(result)
        } catch (error) {
            console.log('error', error)
        }
    }, [filters, pagination, getAssets])

    const fetchCount = useCallback(async () => {
        try {
            const result = await getCount({ filters }).unwrap()
            setCount(result)
        } catch (error) {
            console.log('error', error)
        }
    }, [filters, getCount])

    useEffect(() => {
        void fetchAssets()
    }, [fetchAssets])

    useEffect(() => {
        void fetchCount()
    }, [fetchCount])

    return { assets, count, isLoadingAssets }
}
