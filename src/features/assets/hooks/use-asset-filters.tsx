/* eslint-disable @typescript-eslint/no-explicit-any */
import debounce from 'lodash.debounce'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface Props {
    selectedItems: number[]
}

export const useAssetFilters = ({ selectedItems }: Props) => {
    const [filters, setFilters] = useState({
        name: '',
        shortDescription: '',
        templateID: '',
    })

    const nameFilter = useMemo(
        () => ({
            entity: 'asset',
            filterOperation: 'MATCH',
            filterValue: filters.name,
            filterValueType: 'string',
            property: 'name',
        }),
        [filters.name]
    )

    const shortDescriptionFilter = useMemo(
        () => ({
            entity: 'asset',
            filterOperation: 'MATCH',
            filterValue: filters.shortDescription,
            filterValueType: 'string',
            property: 'shortDescription',
        }),
        [filters.shortDescription]
    )

    const assetsInTemplateFilter = useMemo(
        () => ({
            entity: 'asset',
            filterOperation: 'EQUALS',
            filterValue: +filters.templateID ?? '',
            filterValueType: 'integer',
            property: 'template',
        }),
        [filters.templateID]
    )
    const hierarchyItemsIdFilter = useMemo(
        () => ({
            property: 'parent',
            filterOperation: 'IN',
            filterValue: selectedItems.map((id) => id),
            filterValueType: 'long',
            entity: 'hierarchyItem',
        }),
        [selectedItems]
    )

    const notDeletedFilter = useMemo(
        () => ({
            entity: 'asset',
            filterOperation: 'EQUALS',
            filterValue: false,
            filterValueType: 'boolean',
            property: 'isDeleted',
        }),
        []
    )

    const [assetFilters, setAssetFilters] = useState<any>(() => [
        hierarchyItemsIdFilter,
        notDeletedFilter,
    ])

    useEffect(() => {
        if (hierarchyItemsIdFilter.filterValue.length === 0) {
            setAssetFilters((prev: any) => {
                return prev.filter(
                    (filter: any) => filter.property !== 'parent'
                )
            })
            return
        }

        setAssetFilters((prev: any) => {
            const newFilters = prev.filter(
                (filter: any) => filter.property !== 'parent'
            )
            return [...newFilters, hierarchyItemsIdFilter]
        })
    }, [hierarchyItemsIdFilter])

    // update name filter
    useEffect(() => {
        if (nameFilter.filterValue === '') {
            // delete filter
            setAssetFilters((prev: any) => {
                return prev.filter(
                    (filter: any) => filter.property !== nameFilter.property
                )
            })

            return
        }
        // update filters but keep prev state
        setAssetFilters((prev: any) => {
            // delete same filter and keep the rest
            const newFilters = prev.filter(
                (filter: any) => filter.property !== nameFilter.property
            )
            // add new filter
            return [...newFilters, nameFilter]
        })
    }, [nameFilter])

    // update short description filter
    useEffect(() => {
        if (shortDescriptionFilter.filterValue === '') {
            // delete filter
            setAssetFilters((prev: any) => {
                return prev.filter(
                    (filter: any) =>
                        filter.property !== shortDescriptionFilter.property
                )
            })

            return
        }
        // update filters but keep prev state
        setAssetFilters((prev: any) => {
            // delete same filter and keep the rest
            const newFilters = prev.filter(
                (filter: any) =>
                    filter.property !== shortDescriptionFilter.property
            )
            // add new filter
            return [...newFilters, shortDescriptionFilter]
        })
    }, [shortDescriptionFilter])

    // update assets in template filter
    useEffect(() => {
        if (
            assetsInTemplateFilter.filterValue === 0 ||
            filters.templateID === ''
        ) {
            // delete filter
            setAssetFilters((prev: any) => {
                return prev.filter(
                    (filter: any) =>
                        filter.property !== assetsInTemplateFilter.property
                )
            })

            return
        }
        // update filters but keep prev state
        setAssetFilters((prev: any) => {
            // delete same filter and keep the rest
            const newFilters = prev.filter(
                (filter: any) =>
                    filter.property !== assetsInTemplateFilter.property
            )
            // add new filter
            return [...newFilters, assetsInTemplateFilter]
        })
    }, [assetsInTemplateFilter, filters.templateID])

    const updateFilter = useCallback((name: any, value: any) => {
        setFilters((prev) => ({ ...prev, [name]: value }))
    }, [])

    return { updateFilter, assetFilters }
}
