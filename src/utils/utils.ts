/* eslint-disable @typescript-eslint/no-explicit-any */
import { rankItem } from '@tanstack/match-sorter-utils'
import { type FilterFn } from '@tanstack/react-table'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { type Node } from '../types/tree'

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
        if (showSelected !== false) {
            return row.getIsSelected() && itemRank.passed
        }

        // Otherwise, return if the item should be filtered in/out based on the searchTerm
        return itemRank.passed
    }

    return true // if value is not an object, don't filter out anything
}

export function normalizeTreeData(items: Node[]): Node[] {
    const idMapping: Record<number, number> = {}

    for (let i = 0; i < items.length; i++) {
        idMapping[items[i].id] = i
    }

    const root: Node[] = []

    items.forEach((item) => {
        if (item.parent === null) {
            root.push(item)
        } else {
            const parentEl = items[idMapping[item.parent as number]]
            if (parentEl != null) {
                if (parentEl.children == null) {
                    parentEl.children = [item]
                } else if (
                    parentEl.children.find((child) => child.id === item.id) ==
                    null
                ) {
                    parentEl.children.push(item)
                }
            }
        }
    })

    return root
}

export const findNodeById = (nodeId: number, nodes: Node[]): Node | null => {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === nodeId) {
            return nodes[i]
        } else if (nodes[i].children != null) {
            const foundNode = findNodeById(nodeId, nodes[i].children as Node[])
            if (foundNode != null) {
                return foundNode
            }
        }
    }
    return null
}

export const getNestedIds = (node: Node) => {
    const ids: { childIds: number[]; parentIds: number[] } = {
        childIds: [],
        parentIds: node.parent != null ? [node.parent] : [],
    }

    if (node.children != null) {
        for (const child of node.children) {
            const childIds = getNestedIds(child)
            ids.childIds = [...ids.childIds, ...childIds.childIds]
            ids.parentIds = [...ids.parentIds, ...childIds.parentIds]
        }
    }

    ids.childIds.push(node.id)
    return ids
}

export const getAllNodeIds = (nodes: Node[]): number[] => {
    const ids: number[] = []
    nodes.forEach((node) => {
        ids.push(node.id)
        if (node.children != null) {
            ids.push(...getAllNodeIds(node.children))
        }
    })
    return ids
}

export const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
