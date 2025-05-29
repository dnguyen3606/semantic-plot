import { createContext, useContext, useState, ReactNode } from "react";
import { NodeProps } from '../../components/Node'

interface NodesContextValue {
    nodes: NodeProps[];
    setNodes: React.Dispatch<React.SetStateAction<NodeProps[]>>;
    addNode: (node: NodeProps) => void;
    removeNode: (id: string) => void;
    updateNode: (id: string, updates: Partial<NodeProps>) => void;
    getNode: (id: string) => NodeProps | undefined;
}

const NodesContext = createContext<NodesContextValue | undefined>(undefined);

export function NodesProvider({ children }: { children: ReactNode }) {
    const [nodes, setNodes] = useState<NodeProps[]>([]);

    const addNode = (node: NodeProps) => {
        setNodes(prev => [...prev, node]);
    };

    const removeNode = (id: string) => {
        setNodes(prev => prev.filter(node => node.id !== id));
    };

    const getNode = (id: string): NodeProps | undefined =>
        nodes.find(node => node.id === id);

    const updateNode = (id: string, updates: Partial<NodeProps>) => {
        setNodes(prev =>
            prev.map(node =>
                node.id === id ? { ...node, ...updates } : node
            )
        );
    };

    return (
        <NodesContext.Provider
            value={{ nodes, setNodes, addNode, removeNode, updateNode, getNode }}
        >
            {children}
        </NodesContext.Provider>
    );
}

export function useNodesContext(): NodesContextValue {
    const context = useContext(NodesContext);
    if (!context) {
        throw new Error(`useNodesContext must be used within NodesProvider`);
    }
    return context
}