import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../../../shared/lib/axios-base-query'
import { Characteristic } from '../../../shared/types/characteristic'

// Define a service using a base URL and expected endpoints
export const charApi = createApi({
    reducerPath: 'charApi',
    baseQuery: axiosBaseQuery({
        baseUrl:
            'https://gateway-proxy.dev.idrica.pro/inventory-service/api/v1/',
    }),
    tagTypes: ['Char'],
    endpoints: (builder) => ({
        // Queries
        getChars: builder.query<Characteristic[], void>({
            query: () => ({
                url: `characteristic/`,
                method: 'GET',
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(
                              ({ id }: any) => ({ type: 'Char', id } as const)
                          ),
                          { type: 'Char', id: 'LIST' },
                      ]
                    : [{ type: 'Char', id: 'LIST' }],
        }),
        getCharById: builder.query<Characteristic, string>({
            query: (id) => ({
                url: `characteristic/${id}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'Char', id }],
        }),
        // Mutations
        createChar: builder.mutation<Characteristic, any>({
            query(body) {
                return {
                    url: `characteristic/`,
                    method: 'POST',
                    data: {
                        ...body,
                    },
                }
            },
            invalidatesTags: [{ type: 'Char', id: 'LIST' }],
        }),
        updateChar: builder.mutation<Characteristic, any>({
            query(body) {
                return {
                    url: `characteristic/`,
                    method: 'PUT',
                    data: {
                        ...body,
                    },
                }
            },
            invalidatesTags: (_result, _error, arg) => [
                { type: 'Char', id: arg.id },
                { type: 'Char', id: 'LIST' },
            ],
        }),
        deleteChar: builder.mutation<void, string>({
            query(id) {
                return {
                    url: `characteristic/${id}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: [{ type: 'Char', id: 'LIST' }],
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetCharsQuery,
    useGetCharByIdQuery,
    usePrefetch,
    useCreateCharMutation,
    useUpdateCharMutation,
    useDeleteCharMutation,
} = charApi
