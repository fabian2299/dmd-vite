import {
    type Node,
    type TreeListNodeProps,
    type TreeListProps,
} from '../types/tree'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from './ui/accordion'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'

export function TreeList({
    treeData,
    checkedNodes,
    setCheckedNodes,
    onCheck,
    onUncheck,
}: TreeListProps) {
    const handleUncheck = (node: Node) => {
        onUncheck(node)
    }

    return (
        <Accordion type="multiple" className="">
            {treeData.map((node) => (
                <TreeListNode
                    key={node.id}
                    node={node}
                    checkedNodes={checkedNodes}
                    onCheck={onCheck}
                    onUncheck={handleUncheck}
                    setCheckedNodes={setCheckedNodes}
                />
            ))}
        </Accordion>
    )
}

function TreeListNode({
    node,
    checkedNodes,
    setCheckedNodes,
    onCheck,
    onUncheck,
}: TreeListNodeProps) {
    const isChecked = checkedNodes.includes(node.id)

    const handleCheck = () => {
        if (isChecked) {
            onUncheck(node)
        } else {
            onCheck(node)
        }
    }

    return (
        <div>
            {node.children != null ? (
                <AccordionItem
                    value={node.id.toString()}
                    className="border-none pl-6"
                >
                    <div className="flex items-center gap-4">
                        <Checkbox
                            checked={isChecked}
                            onCheckedChange={handleCheck}
                            id={`checkbox-${node.id}`}
                            disabled={node.disabled}
                            className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        />
                        <Label
                            htmlFor={`checkbox-${node.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {node.name}
                        </Label>
                        <AccordionTrigger />
                    </div>
                    <AccordionContent>
                        <TreeList
                            treeData={node.children}
                            checkedNodes={checkedNodes}
                            onCheck={onCheck}
                            onUncheck={onUncheck}
                            setCheckedNodes={setCheckedNodes}
                        />
                    </AccordionContent>
                </AccordionItem>
            ) : (
                <AccordionItem
                    value={node.id.toString()}
                    className="border-none py-4 pl-6"
                >
                    <div className="flex items-center gap-4">
                        <Checkbox
                            checked={isChecked}
                            onCheckedChange={handleCheck}
                            id={`checkbox-${node.id}`}
                            disabled={node.disabled}
                            className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        />
                        <Label
                            htmlFor={`checkbox-${node.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {node.name}
                        </Label>
                    </div>
                </AccordionItem>
            )}
        </div>
    )
}
