import classes from './Connection.module.css'
import { useSelectedNodeContext } from '../store/contexts/SelectedNodeContext';
import { useNodesContext } from '../store/contexts/NodesContext';
import { useNodeConnectionsContext } from '../store/contexts/NodeConnectionsContext';
//import { useEffect, useState } from 'react';

interface ConnectionProps {
  from: string;
  to: string;
  score?: number;
}

export default function Connection({ from, to, score=0.8 }: ConnectionProps) {
    const { selectedNode } = useSelectedNodeContext();
    const { getNode } = useNodesContext();
    const { removeConnection } = useNodeConnectionsContext();

    const fromNode = getNode(from);
    const toNode = getNode(to);
    if (!fromNode || !toNode) {
        removeConnection({ from, to });
        return null;
    }

    const selected = Boolean(
        selectedNode &&
        (selectedNode.id === fromNode.id || selectedNode.id === toNode.id)
    );

    const baseline = 0.7;
    const normalizedScore = score > baseline ? (score - baseline) / (1 - baseline) : 0;
    const baseWidth = 2;
    const pulseWidth = baseWidth + normalizedScore * 4;

    const style = selected
        ? ({ '--pulseWidth': `${pulseWidth}px` } as React.CSSProperties)
        : {};

    const lineClass = `${classes.connection} ${selected ? classes.selectedConnection : ""}`;

    return (
        <svg className={classes.layer} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <line
            x1={getNode(from)!.position.x + 25}
            y1={getNode(from)!.position.y + 25}
            x2={getNode(to)!.position.x + 25}
            y2={getNode(to)!.position.y + 25}
            className={lineClass}
            style={style}
            />
        </svg>
    );
}
