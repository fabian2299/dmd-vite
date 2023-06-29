import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@/lib/axios-base-query'
import { type Template } from '@/types/template'
import { type GOLayer } from '@goaigua/go-gisapi'

export const templateApi = createApi({
    reducerPath: 'templateApi',
    baseQuery: axiosBaseQuery({
        baseUrl:
            'https://gateway-proxy.dev.idrica.pro/inventory-service/api/v1/',
    }),
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: 30,
    tagTypes: ['Template'],
    endpoints: (builder) => ({
        // Queries
        getTemplates: builder.query<Template[], void>({
            query: () => ({
                url: `template/`,
                method: 'GET',
            }),
            providesTags: (result) =>
                result != null
                    ? [
                          ...result.map(
                              ({ id }) => ({ type: 'Template', id } as const)
                          ),
                          { type: 'Template', id: 'LIST' },
                      ]
                    : [{ type: 'Template', id: 'LIST' }],
        }),
        getTemplateById: builder.query<Template, string>({
            query: (id) => ({
                url: `template/${id}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'Template', id }],
        }),
        getMapLayers: builder.query<GOLayer[], void>({
            query: () => ({
                url: 'portal/layers/assigned/',
                method: 'GET',
            }),
        }),
        // Mutations
        createTemplate: builder.mutation<Template, Template>({
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
        updateTemplate: builder.mutation<Template, Template>({
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
        deleteTemplate: builder.mutation<void, string>({
            query(id) {
                return {
                    url: `template/${id}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: [{ type: 'Template', id: 'LIST' }],
        }),
        publishLayer: builder.mutation<void, string>({
            query(id) {
                return {
                    url: `geoserver/layer/${id}`,
                    method: 'POST',
                }
            },
            invalidatesTags: (_result, _error, arg) => [
                { type: 'Template', id: arg },
                { type: 'Template', id: 'LIST' },
            ],
        }),
        unpublishLayer: builder.mutation<void, string>({
            query(id) {
                return {
                    url: `geoserver/layer/${id}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: (_result, _error, arg) => [
                { type: 'Template', id: arg },
                { type: 'Template', id: 'LIST' },
            ],
        }),
    }),
})

export const {
    useGetTemplatesQuery,
    useGetTemplateByIdQuery,
    useGetMapLayersQuery,
    usePrefetch,
    useCreateTemplateMutation,
    useUpdateTemplateMutation,
    useDeleteTemplateMutation,
    usePublishLayerMutation,
    useUnpublishLayerMutation,
} = templateApi
