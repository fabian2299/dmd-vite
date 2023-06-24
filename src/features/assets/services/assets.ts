import { createApi } from '@reduxjs/toolkit/query/react'
import {
    type Asset,
    type AssetPagination,
    type AssetTableView,
    type AssetTableViewFilters,
} from '../../../shared/types/asset'
import { axiosBaseQuery } from '../../../shared/lib/axios-base-query'

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
    // 5 minutes
    keepUnusedDataFor: 60 * 5,
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
        addAsset: builder.mutation<Asset, any>({
            query: (body) => ({
                url: 'asset/',
                method: 'POST',
                data: body,
            }),
        }),
        deleteAssset: builder.mutation<void, number>({
            query: (id) => ({
                url: `asset/${id}/`,
                method: 'DELETE',
            }),
        }),
    }),
})

export const {
    // Mutations
    useGetAssetsMutation,
    useGetCountMutation,
    useAddAssetMutation,
    useDeleteAsssetMutation,
} = assetApi
