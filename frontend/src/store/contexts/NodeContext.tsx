import { createContext, useContext, useState, ReactNode } from "react";
import { NodeProps } from '../../components/Node'

interface NodeContextValue {
    selectedNode?: NodeProps;
    selectNode: (node: NodeProps) => void;
}

const NodeContext = createContext<NodeContextValue | undefined>(undefined);

export function NodeProvider({ children }: { children: ReactNode }) {
    const [selectedNode, setSelectedNode] = useState<NodeProps>();
    return (
        <NodeContext.Provider
            value={{ selectedNode, selectNode: setSelectedNode }}
        >
            {children}
        </NodeContext.Provider>
    );
}

export function useNodeContext(): NodeContextValue {
    const context = useContext(NodeContext);
    if (!context) {
        throw new Error(`UseNodeContext must be used within NodeProvider`);
    }
    return context
}