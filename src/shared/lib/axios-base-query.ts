import { BaseQueryFn } from '@reduxjs/toolkit/query/react'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { ErrorTypeEnum } from './errors'

const token =
    localStorage.getItem('token') ||
    'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJPVi1uMm9RSER2SHhuZW4zTi01WVYybnd2eTVUTV9MNjZNVEpTdVhaRHowIn0.eyJleHAiOjE2ODgwMzQyNjUsImlhdCI6MTY4NzIxMzcyMywiYXV0aF90aW1lIjoxNjg3MTcwMjY1LCJqdGkiOiJlNzk0NmNjNi0zYjY5LTRkYjUtYmRiMi0xZGZmYjU4MTBjZTkiLCJpc3MiOiJodHRwczovL2tleWNsb2FrLXByZS5kZXYuaWRyaWNhLnByby9hdXRoL3JlYWxtcy9Hb2FpZ3VhUHJlIiwiYXVkIjpbInJlYWxtLW1hbmFnZW1lbnQiLCJhY2NvdW50Il0sInN1YiI6ImU2MDJiZWE5LTlkYjktNDU3Yy1hMDRkLTU1M2I1Yzc0ZTJjOCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImdvLWFpZ3VhLWRtZCIsIm5vbmNlIjoiZWFkOGQ1NWEtYTlkYS00Y2JhLTk2YzgtMjQyYWU3ZTdiMmM3Iiwic2Vzc2lvbl9zdGF0ZSI6Ijk5NTEzYWUwLTgxM2QtNGQ4Ny05ZjA3LTVjNDQ3ZDhmYTY1NSIsImFjciI6IjAiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJtYW5hZ2UtcmVhbG0iLCJtYW5hZ2UtdXNlcnMiLCJxdWVyeS1yZWFsbXMiLCJtYW5hZ2UtY2xpZW50cyIsInF1ZXJ5LWNsaWVudHMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19LCJnby1haWd1YS1kbWQiOnsicm9sZXMiOlsiRE1EX0FQUExJQ0FUSU9OX01PRFVMRSIsIkRNRF9XUklURV9DSEFSQUNURVJJU1RJQyIsIkRNRF9XUklURV9URU1QTEFURSIsIkRNRF9ST0xFU19NT0RVTEUiLCJETURfV1JJVEVfSElFUkFSQ0hZX0lURU0iLCJETURfV1JJVEVfQVBJIiwiRE1EX1dSSVRFX0hJRVJBUkNIWSIsIkRNRF9BU1NFVF9NT0RVTEUiLCJETURfQURNSU4iLCJETURfUkVUUklFVkVfSElFUkFSQ0hZX0lURU0iLCJETURfVVNFUl9BRE1JTiIsIkRNRF9ET0NVTUVOVEFUSU9OX01PRFVMRSIsIkRNRF9XUklURV9BU1NFVCIsIkRNRF9SRUFEX0VYVEVSTkFMX0FQUExJQ0FUSU9OIiwiRE1EX1dSSVRFX0NMQVNTIiwiRE1EX1JFQURfQVNTRVQiLCJBUFBfRE1EIiwiRE1EX1JFQURfQVBJIiwiRE1EX0hJRVJBUkNIWV9NT0RVTEUiLCJETURfUkVBRF9ISUVSQVJDSFkiLCJETURfUkVBRF9URU1QTEFURSIsIkRNRF9XUklURV9NRUFTVVJFTUVOVCIsIkRNRF9XUklURV9FWFRFUk5BTF9BUFBMSUNBVElPTiIsIkRNRF9VTklUX01PRFVMRSJdfX0sInNjb3BlIjoib3BlbmlkIGdvYWlndWEgcHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJ1c2VyX25hbWUiOiJmYW5pdmkiLCJuYW1lIjoiRkFCSUFOIEFMRUpBTkRSTyBOSUVWRVMgVklaQ0FJTk8iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJmYW5pdmkiLCJsb2NhbGUiOiJlbiIsImdpdmVuX25hbWUiOiJGQUJJQU4gQUxFSkFORFJPIiwiZmFtaWx5X25hbWUiOiJOSUVWRVMgVklaQ0FJTk8iLCJlbWFpbCI6ImYubmlldmVzQGNsZXZlcnB5LmNvbSJ9.Op25nW6R9ELE6X8UZclvE_cyi7foOmGzH0ABXlN17Oth_YKVe3Lmwi6QBNedpkCFFOIRbT0DSj5aNvwCXzxxIVEYiZQP4DZNWcGM0TrPgTPA5VznOB6kzaA-XT2XrOu1Luo1UhqXhsuIV_EGOnGR_SRFQMX_kNo0aLbrEsTdy4c6d8gAHyXH0BnKkRY8OeySKp68Mq4zeMiiWequ2uM2z1RAubrIe2szNINtM-YZaCYUwd9qwaoRmgKGo2xJxfH2aZE2UTS7I0MDmpVduIndygGDtgi1t079uTszqLPYV7GpLSrdbBl5vk9t3R5bl83Nj48CYz4DHAm56Gjx0Vh_RA'

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
            await new Promise((resolve) => setTimeout(resolve, 1000))

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
                    status: number
                    data: { error: string }
                }
            }

            return {
                error: {
                    status: err.response?.status,
                    data: err.response?.data || err.message,
                    name:
                        err.response?.data?.error || ErrorTypeEnum.DefaultError,
                },
            }
        }
    }