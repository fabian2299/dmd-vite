import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAsideMenuContext } from '../context/aside-menu-context'
import { Switch } from './ui/switch'
import { useMainHierarchyFilterContext } from '../context/main-hierarchy-items-filter-context'
import { type HierarchyItems } from '../types/hierarchy'
import { Label } from './ui/label'
import {
    findNodeById,
    getAllNodeIds,
    getNestedIds,
    normalizeTreeData,
} from '../utils/utils'
import { type Node } from '../types/tree'
import { TreeList } from './tree-list'

export function MainHierarchyMenu({
    mainHierarchyItems,
}: {
    mainHierarchyItems: HierarchyItems[]
}) {
    const { isHierarchyMenuOpen } = useAsideMenuContext()
    const { setSelectedHierarchyItems } = useMainHierarchyFilterContext()

    const mainHierarchyItemsCopy = useMemo(
        () => structuredClone(mainHierarchyItems),
        [mainHierarchyItems]
    )

    const [mainFilter, setMainFilter] = useState(() => true)

    const [checkedNodes, setCheckedNodes] = useState<number[]>([])

    const treeData = useMemo(() => {
        const n = normalizeTreeData(mainHierarchyItemsCopy)

        return n.map((node) => ({
            children: node.children,
            id: node.id,
            name: node.name,
            parent: node.parent,
        }))
    }, [mainHierarchyItemsCopy])

    useEffect(() => {
        setSelectedHierarchyItems(checkedNodes)
    }, [checkedNodes, setSelectedHierarchyItems])

    useEffect(() => {
        if (mainFilter) {
            const allNodeIds = getAllNodeIds(treeData)
            setCheckedNodes(allNodeIds)
        }
    }, [mainFilter, treeData])

    const handleCheck = useCallback(
        (node: Node) => {
            const ids = getNestedIds(node)

            setCheckedNodes((prev) => {
                const newCheckedNodes = [...prev]

                ids.childIds.forEach((id) => {
                    if (!newCheckedNodes.includes(id)) {
                        newCheckedNodes.push(id)
                    }
                })

                let currentNode: Node | null =
                    node.parent != null
                        ? findNodeById(node.parent, treeData)
                        : null

                while (currentNode != null) {
                    if (!newCheckedNodes.includes(currentNode.id)) {
                        newCheckedNodes.push(currentNode.id)
                    }

                    currentNode =
                        currentNode.parent != null
                            ? findNodeById(currentNode.parent, treeData)
                            : null
                }

                return newCheckedNodes
            })
        },
        [treeData]
    )

    const handleUncheck = useCallback(
        (node: Node) => {
            const ids = getNestedIds(node)

            setCheckedNodes((prev) => {
                let newCheckedNodes = prev.filter(
                    (id) => !ids.childIds.includes(id)
                )

                let currentNode: Node | null =
                    node.parent != null
                        ? findNodeById(node.parent, treeData)
                        : null

                while (currentNode != null) {
                    if (
                        currentNode.children?.every(
                            (child) => !newCheckedNodes.includes(child.id)
                        ) ??
                        false
                    ) {
                        newCheckedNodes = newCheckedNodes.filter(
                            (id) => id !== currentNode?.id
                        )
                    }
                    currentNode =
                        currentNode.parent != null
                            ? findNodeById(currentNode.parent, treeData)
                            : null
                }

                return newCheckedNodes
            })
        },
        [treeData]
    )

    useEffect(() => {
        const allNodeIds = getAllNodeIds(treeData)
        if (checkedNodes.length === allNodeIds.length) {
            setMainFilter(true)
        } else {
            setMainFilter(false)
        }
    }, [checkedNodes, treeData])

    return (
        <>
            {isHierarchyMenuOpen && (
                <aside className="min-h-[calc(100vh_-_80px)] w-full max-w-md border-r px-4">
                    <div className="mt-10 h-[80vh] w-full">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="checked-nodes"
                                checked={mainFilter}
                                onCheckedChange={(checked) => {
                                    if (!checked) {
                                        setCheckedNodes([])
                                        setMainFilter(false)
                                    } else {
                                        const allNodeIds =
                                            getAllNodeIds(treeData)
                                        setCheckedNodes(allNodeIds)
                                        setMainFilter(true)
                                    }
                                }}
                            />

                            <Label htmlFor="checked-nodes">Select All</Label>
                        </div>

                        <TreeList
                            treeData={treeData}
                            checkedNodes={checkedNodes}
                            setCheckedNodes={setCheckedNodes}
                            onCheck={handleCheck}
                            onUncheck={handleUncheck}
                        />
                    </div>
                </aside>
            )}
        </>
    )
}
