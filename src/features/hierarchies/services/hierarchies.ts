import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../../../shared/lib/axios-base-query'
import { type HierarchyItems } from '../../../shared/types/hierarchy'

export const hierarchyApi = createApi({
    reducerPath: 'hierarchyApi',
    baseQuery: axiosBaseQuery({
        baseUrl:
            'https://gateway-proxy.dev.idrica.pro/inventory-service/api/v1/',
    }),
    tagTypes: ['Hiearchy', 'HierarchyItem'],
    endpoints: (builder) => ({
        // Queries
        getMainHierarchyItems: builder.query<HierarchyItems[], void>({
            query: () => ({
                url: `hierarchy/items/parents/main/`,
                method: 'GET',
            }),
            providesTags: (result) =>
                result != null
                    ? [
                          ...result.map(
                              ({ id }) =>
                                  ({ type: 'HierarchyItem', id } as const)
                          ),
                          { type: 'HierarchyItem', id: 'LIST' },
                      ]
                    : [{ type: 'HierarchyItem', id: 'LIST' }],
        }),
        // Mutations
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetMainHierarchyItemsQuery, usePrefetch } = hierarchyApi
