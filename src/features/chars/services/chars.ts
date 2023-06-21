/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../../../shared/lib/axios-base-query'
import { type Characteristic } from '../../../shared/types/characteristic'

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
                result != null
                    ? [
                          ...result.map(
                              ({ id }) => ({ type: 'Char', id } as const)
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
        createChar: builder.mutation<Characteristic, Characteristic>({
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
        updateChar: builder.mutation<Characteristic, Characteristic>({
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

export const {
    useGetCharsQuery,
    useGetCharByIdQuery,
    usePrefetch,
    useCreateCharMutation,
    useUpdateCharMutation,
    useDeleteCharMutation,
} = charApi
