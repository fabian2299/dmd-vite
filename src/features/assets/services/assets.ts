import { createApi } from '@reduxjs/toolkit/query/react'
import {
    type AssetPagination,
    type AssetTableView,
    type AssetTableViewFilters,
} from '@/types/asset'
import { axiosBaseQuery } from '@/lib/axios-base-query'

interface AssetFilters {
    filters: AssetTableViewFilters[]
    pagination: AssetPagination
}

export const assetApi = createApi({
    reducerPath: 'assetApi',
    baseQuery: axiosBaseQuery({
        baseUrl:
            'https://gateway-proxy.dev.idrica.pro/inventory-service/api/v1/',
    }),
    tagTypes: ['Asset'],
    endpoints: (builder) => ({
        // Queries
        // Mutations
        getAssets: builder.mutation<AssetTableView[], AssetFilters>({
            query: ({ filters, pagination }) => ({
                url: 'asset/asset-view/table/',
                method: 'POST',
                params: pagination,
                data: filters,
            }),
        }),
        getCount: builder.mutation<number, Omit<AssetFilters, 'pagination'>>({
            query: ({ filters }) => ({
                url: 'asset/count/',
                method: 'POST',
                data: filters,
            }),
        }),
    }),
})

export const {
    // Mutations
    useGetAssetsMutation,
    useGetCountMutation,
} = assetApi
