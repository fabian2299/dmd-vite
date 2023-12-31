import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@/lib/axios-base-query'
import { type Class } from '@/types/class'
import { type ClassDTO } from '@/features/classes/slices/classFormSlice'

export const classApi = createApi({
    reducerPath: 'classApi',
    baseQuery: axiosBaseQuery({
        baseUrl:
            'https://gateway-proxy.dev.idrica.pro/inventory-service/api/v1/',
    }),
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: 30,
    tagTypes: ['Class'],
    endpoints: (builder) => ({
        // Queries
        getClasses: builder.query<Class[], void>({
            query: () => ({
                url: `class/`,
                method: 'GET',
            }),
            providesTags: (result) =>
                result != null
                    ? [
                          ...result.map(
                              ({ id }) => ({ type: 'Class', id } as const)
                          ),
                          { type: 'Class', id: 'LIST' },
                      ]
                    : [{ type: 'Class', id: 'LIST' }],
        }),

        getClassById: builder.query<Class, string>({
            query: (id) => ({
                url: `class/${id}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'Class', id }],
        }),
        // Mutations
        createClass: builder.mutation<Class, ClassDTO>({
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
        updateClass: builder.mutation<Class, ClassDTO>({
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
        deleteClass: builder.mutation<void, string>({
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
    useGetClassByIdQuery,
    usePrefetch,
    useCreateClassMutation,
    useUpdateClassMutation,
    useDeleteClassMutation,
} = classApi
