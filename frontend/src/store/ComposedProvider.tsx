import { ReactNode } from 'react';
import { SelectedNodeProvider } from './contexts/SelectedNodeContext';

const providers = [
    SelectedNodeProvider,
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