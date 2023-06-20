import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../../../shared/lib/axios-base-query'
import { Characteristic } from '../../../shared/types/characteristic'
import { Template } from '../../../shared/types/template'

export const templateApi = createApi({
    reducerPath: 'templateApi',
    baseQuery: axiosBaseQuery({
        baseUrl:
            'https://gateway-proxy.dev.idrica.pro/inventory-service/api/v1/',
    }),
    tagTypes: ['Template'],
    endpoints: (builder) => ({
        // Queries
        getTemplates: builder.query<Template[], void>({
            query: () => ({
                url: `template/`,
                method: 'GET',
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(
                              ({ id }: any) =>
                                  ({ type: 'Template', id } as const)
                          ),
                          { type: 'Template', id: 'LIST' },
                      ]
                    : [{ type: 'Template', id: 'LIST' }],
        }),
        // Mutations
        createTemplate: builder.mutation<Characteristic, any>({
            query(body) {
                return {
                    url: `template/`,
                    method: 'POST',
                    data: {
                        ...body,
                    },
                }
            },
            invalidatesTags: [{ type: 'Template', id: 'LIST' }],
        }),
        updateTemplate: builder.mutation<Characteristic, any>({
            query(body) {
                return {
                    url: `template/`,
                    method: 'PUT',
                    data: {
                        ...body,
                    },
                }
            },
            invalidatesTags: (_result, _error, arg) => [
                { type: 'Template', id: arg.id },
                { type: 'Template', id: 'LIST' },
            ],
        }),
        deleteTemplate: builder.mutation<void, number>({
            query(id) {
                return {
                    url: `template/${id}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: [{ type: 'Template', id: 'LIST' }],
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetTemplatesQuery,
    useCreateTemplateMutation,
    useUpdateTemplateMutation,
    useDeleteTemplateMutation,
} = templateApi
