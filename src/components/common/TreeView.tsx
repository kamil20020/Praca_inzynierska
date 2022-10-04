import { Typography } from "@mui/material";

export interface NodeData{
    id: number,
    name: string,
    children: NodeData[],
}

export interface NodeProps{
    children: NodeData[],
    childrenNames: string,
    handleSelectItem: (id: number, name: string) => void
}

const TreeView = (props: NodeProps) => {
    
    const readObjectProp = (obj: any, prop: any): any => {
        return obj[prop];
    }

    const renderTree = (node: NodeData, indent: number = 0) => {

        const nodeChildren = readObjectProp(node, props.childrenNames)

        return (
            <div className="tree-node" key={node.name}>
                <Typography
                    className="tree-node-text"
                    variant="h6" 
                    align="left" 
                    component="div" 
                    marginLeft={indent*5}
                    onClick={() => props.handleSelectItem(node.id, node.name)}
                >
                    {node.name}
                </Typography>
                {Array.isArray(nodeChildren)
                    ? nodeChildren.map((child: NodeData) => (
                        renderTree(child, indent + 1)
                    ))
                    : null
                }
            </div>
        )
    }

    return (
        <div>
            {props.children.map((child: NodeData) => renderTree(child))}
        </div>
    )
}

export default TreeView;
