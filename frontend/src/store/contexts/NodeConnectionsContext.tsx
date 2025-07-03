import { createContext, useContext, useState, ReactNode } from "react";

type Connection = {
    from: string;
    to: string;
    score?: number;
}

interface NodeConnectionsContextValue {
    connections: Connection[];
    addConnection: (connection: Connection) => void;
    removeConnection: (connection: Connection) => void;
    getConnection: (from: string, to: string) => Connection | undefined;
    getConnections: (id: string) => Connection[] | undefined;
}

const NodeConnectionsContext = createContext<NodeConnectionsContextValue | undefined>(undefined);

export function NodeConnectionsProvider({ children }: { children: ReactNode }) {
    const [connections, setConnections] = useState<Connection[]>([]);

    const addConnection = (c: Connection) =>
        setConnections(cs => cs.find(x => x.from===c.from && x.to===c.to) ? cs : [...cs, c]);

    const removeConnection = (c: Connection) =>
        setConnections(cs => cs.filter(x => !(x.from===c.from && x.to===c.to)));

    const getConnection = (id1: string, id2: string): Connection | undefined =>
        connections.find(connection =>
            (connection.from === id1 && connection.to === id2) ||
            (connection.from === id2 && connection.to === id1)
        );
    
    const getConnections = (id: string): Connection[] | undefined => 
        connections.filter(connection => connection.from === id || connection.to === id);
    
    return (
        <NodeConnectionsContext.Provider
            value={{ connections, addConnection, removeConnection, getConnection, getConnections }}
        >
            {children}
        </NodeConnectionsContext.Provider>
    );
}

export function useNodeConnectionsContext(): NodeConnectionsContextValue {
    const context = useContext(NodeConnectionsContext);
    if (!context) {
        throw new Error(`useNodeConnectionsContext must be used within NodeConnectionsProvider`);
    }
    return context
}