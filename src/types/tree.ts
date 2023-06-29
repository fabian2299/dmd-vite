export interface Node {
    id: number
    parent?: number | null
    children?: Node[]
    name: string
    disabled?: boolean
}

export interface TreeListProps {
    treeData: Node[]
    checkedNodes: number[]
    onCheck: (node: Node) => void
    onUncheck: (node: Node) => void
    setCheckedNodes: React.Dispatch<React.SetStateAction<number[]>>
}

export interface TreeListNodeProps {
    node: Node
    checkedNodes: number[]
    onCheck: (node: Node) => void
    onUncheck: (node: Node) => void
    setCheckedNodes: React.Dispatch<React.SetStateAction<number[]>>
}
