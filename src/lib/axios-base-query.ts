import { type BaseQueryFn } from '@reduxjs/toolkit/query/react'
import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'
import { ErrorTypeEnum } from './errors'

const token = import.meta.env.VITE_TOKEN as string

export const axiosBaseQuery =
    (
        { baseUrl }: { baseUrl: string } = { baseUrl: '' }
    ): BaseQueryFn<
        {
            url: string
            method: AxiosRequestConfig['method']
            data?: AxiosRequestConfig['data']
            params?: AxiosRequestConfig['params']
            headers?: AxiosRequestConfig['headers']
        },
        unknown,
        unknown
    > =>
    async ({ url, method, data, params, headers }) => {
        try {
            const result = await axios({
                url: baseUrl + url,
                method,
                data,
                params,
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...headers,
                },
            })

            return { data: result.data }
        } catch (axiosError) {
            const err = axiosError as AxiosError & {
                response: {
                    data: { error: string; code: string; message: string }
                }
            }

            return {
                error: {
                    status: err.response?.status ?? 500,
                    data: err.response?.data ?? err.message,
                    name:
                        err.response?.data?.error ?? ErrorTypeEnum.DefaultError,
                },
            }
        }
    }
