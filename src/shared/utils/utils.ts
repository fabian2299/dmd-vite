import { rankItem } from '@tanstack/match-sorter-utils'
import { FilterFn } from '@tanstack/react-table'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Check if value is the global filter object
    if (typeof value === 'object') {
        const { searchTerm, showSelected } = value

        // Rank the item
        const itemRank = rankItem(row.getValue(columnId), searchTerm)

        // Store the itemRank info
        addMeta({
            itemRank,
        })

        // If showSelected is true, return only selected rows that also match the searchTerm
        if (showSelected) {
            return row.getIsSelected() && itemRank.passed
        }

        // Otherwise, return if the item should be filtered in/out based on the searchTerm
        return itemRank.passed
    }

    return true // if value is not an object, don't filter out anything
}
