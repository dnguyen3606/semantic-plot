import { ReactNode } from 'react';
import { SelectedNodeProvider } from './contexts/SelectedNodeContext';
import { NodesProvider } from './contexts/NodesContext';
import { NodeConnectionsProvider } from './contexts/NodeConnectionsContext';

const providers = [
    NodesProvider,
    SelectedNodeProvider,
    NodeConnectionsProvider,
    //...
] as const;

export function ComposedProvider({ children }: { children: ReactNode }) {
    return (
        <>
            {providers.reduceRight<ReactNode>(
                (kids, Provider) => <Provider>{kids}</Provider>,
                children
            )}        
        </>
    );
}