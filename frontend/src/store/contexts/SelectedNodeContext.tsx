import { createContext, useContext, useState, ReactNode } from "react";
import { NodeProps } from '../../components/Node'

interface SelectedNodeContextValue {
    selectedNode?: NodeProps;
    selectNode: (node: NodeProps) => void;
}

const SelectedNodeContext = createContext<SelectedNodeContextValue | undefined>(undefined);

export function SelectedNodeProvider({ children }: { children: ReactNode }) {
    const [selectedNode, setSelectedNode] = useState<NodeProps>();
    return (
        <SelectedNodeContext.Provider
            value={{ selectedNode, selectNode: setSelectedNode }}
        >
            {children}
        </SelectedNodeContext.Provider>
    );
}

export function useSelectedNodeContext(): SelectedNodeContextValue {
    const context = useContext(SelectedNodeContext);
    if (!context) {
        throw new Error(`UseNodeContext must be used within NodeProvider`);
    }
    return context
}