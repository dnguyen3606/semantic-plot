import { ReactNode } from 'react';
import { NodeProvider } from './contexts/NodeContext';

const providers = [
    NodeProvider,
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