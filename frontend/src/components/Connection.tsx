import classes from './Connection.module.css'
import { useSelectedNodeContext } from '../store/contexts/SelectedNodeContext';
import { useNodesContext } from '../store/contexts/NodesContext';
import { useNodeConnectionsContext } from '../store/contexts/NodeConnectionsContext';

interface ConnectionProps {
  from: string;
  to: string;
  score?: number;
}

const Connection = ({ from, to, score=0.8 }: ConnectionProps) => {
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

    const x1 = fromNode.position.x + 25;
    const y1 = fromNode.position.y + 25;
    const x2 = toNode.position.x   + 25;
    const y2 = toNode.position.y   + 25;

    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

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
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className={lineClass}
            style={style}
            />
            {selected && (
                <text
                    key={`${mx}-${my}`}
                    x={mx}
                    y={my}
                    className={classes.scoreLabel}
                >
                {score.toFixed(2)}
                </text>
            )}
        </svg>
    );
}

export default Connection;