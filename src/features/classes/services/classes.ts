import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../../../shared/lib/axios-base-query'
import { Class } from '../../../shared/types/class'

// Define a service using a base URL and expected endpoints
export const classApi = createApi({
    reducerPath: 'classApi',
    baseQuery: axiosBaseQuery({
        baseUrl:
            'https://gateway-proxy.dev.idrica.pro/inventory-service/api/v1/',
    }),
    tagTypes: ['Class'],
    endpoints: (builder) => ({
        // Queries
        getClasses: builder.query<Class[], void>({
            query: () => ({
                url: `class/`,
                method: 'GET',
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(
                              ({ id }: any) => ({ type: 'Class', id } as const)
                          ),
                          { type: 'Class', id: 'LIST' },
                      ]
                    : [{ type: 'Class', id: 'LIST' }],
        }),
        // Mutations
        createClass: builder.mutation<Class, any>({
            query(body) {
                return {
                    url: `class/`,
                    method: 'POST',
                    data: {
                        ...body,
                    },
                }
            },
            invalidatesTags: [{ type: 'Class', id: 'LIST' }],
        }),
        updateClass: builder.mutation<Class, any>({
            query(body) {
                return {
                    url: `class/`,
                    method: 'PUT',
                    data: {
                        ...body,
                    },
                }
            },
            invalidatesTags: (_result, _error, arg) => [
                { type: 'Class', id: arg.id },
                { type: 'Class', id: 'LIST' },
            ],
        }),
        deleteClass: builder.mutation<void, number>({
            query(id) {
                return {
                    url: `class/${id}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: [{ type: 'Class', id: 'LIST' }],
        }),
    }),
})

export const {
    useGetClassesQuery,
    useCreateClassMutation,
    useUpdateClassMutation,
    useDeleteClassMutation,
} = classApi
