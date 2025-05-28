import { useEffect, useRef } from 'react'
import Node, { NodeProps, Position } from '../components/Node'
import Connection from '../components/Connection';
import { useNodesContext } from '../store/contexts/NodesContext';
import { useSelectedNodeContext } from '../store/contexts/SelectedNodeContext';
import { useNodeConnectionsContext } from '../store/contexts/NodeConnectionsContext';
import classes from './Demo.module.css';

const NODE_SIZE = 50

export default function Demo(){
    const containerRef = useRef<HTMLDivElement>(null); 

    const { nodes, addNode, setNodes } = useNodesContext();
    const { selectNode } = useSelectedNodeContext();
    const { connections } = useNodeConnectionsContext();

    const handleAdd = () => {
        const newNode = {
            id: crypto.randomUUID(),
            title: 'New Node',
            content: '',
            position: { x: 0, y: 0 },
        };
        addNode(newNode);
    };

    const handleClick = (node: NodeProps) => {
        selectNode(node);
    }

    useEffect(() => {
        if (nodes.length === 0) return;
        const lastNode = nodes[nodes.length - 1];
        handleMove(lastNode.id, lastNode.position);
    }, [nodes.length]);

    useEffect(() => {
        const handleResize = () => {
            nodes.forEach((node) => {
                handleMove(node.id, node.position);
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [nodes]);

    const handleDrag = (id: string, target: Position) => {
        moveNode(id, target);
    }

    const handleDrop = (id: string, target: Position) => {
        handleMove(id, target);
    }

    // helper function
    const moveNode = (id: string, target: Position) => {
        setNodes(prev =>
            prev.map(node =>
                node.id === id ? { ...node, position: target } : node
            )
        ); 
    }

    const handleMove = (id: string, target: Position) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        const node = nodes.find(n => n.id === id);
        if (!node) return;

        // 1. out of bounds -> redirect to center
        const outOfBounds = 
            target.x < rect.left ||
            target.y < rect.top ||
            target.x + NODE_SIZE > rect.right ||
            target.y + NODE_SIZE > rect.bottom;

        if (outOfBounds) {
            const center: Position = {
                x: rect.right / 2 + (Math.random() * (5 * NODE_SIZE) - (5 * NODE_SIZE) / 2),
                y: rect.bottom / 2 + (Math.random() * (5 * NODE_SIZE) - (5 * NODE_SIZE) / 2),
            };                  
            target = center;
            moveNode(id, target);
        }

        // 2. node collision -> redirect away from collision
        let collisionFound = false;
        let tries = 0;
        do {
            collisionFound = false;
            for (const other_node of nodes) {
                if (other_node.id === id) continue;
                if (collides(other_node.position, target)) {
                    target = resolveCollision(target, other_node.position)
                    collisionFound = true;
                    break;
                }
            }
            tries++;
        } while (collisionFound && tries < 20)
        moveNode(id, target);
    }

    const collides = (posA: Position, posB: Position): boolean => {
        return (
            posA.x < posB.x + NODE_SIZE &&
            posA.x + NODE_SIZE > posB.x &&
            posA.y < posB.y + NODE_SIZE &&
            posA.y + NODE_SIZE > posB.y
        );
    };

    function resolveCollision(posA: Position, posB: Position): Position {
        const centerA = { x: posA.x + NODE_SIZE / 2, y: posA.y + NODE_SIZE / 2 };
        const centerB = { x: posB.x + NODE_SIZE / 2, y: posB.y + NODE_SIZE / 2 };
      
        const dx = centerA.x - centerB.x;
        const dy = centerA.y - centerB.y;

        const overlapX = NODE_SIZE - Math.abs(dx);
        const overlapY = NODE_SIZE - Math.abs(dy);
      
        if (overlapX < overlapY) {
            const offsetX = overlapX * (dx < 0 ? -1 : 1);
            return { x: posA.x + offsetX, y: posA.y };
        } else {
            const offsetY = overlapY * (dy < 0 ? -1 : 1);
            return { x: posA.x, y: posA.y + offsetY };
        }
    }
    // end helpers

    return (
        <div ref={containerRef} style={{height: '100vh', width: '100%'}}>
            {connections.map(({from, to}) => {
                const fromPosition = nodes.find(node => node.id === from)?.position;
                const toPosition = nodes.find(node => node.id === to)?.position;
                if (!fromPosition || !toPosition) return null;
                return <Connection 
                    key={`${from}-${to}-${fromPosition.x},${fromPosition.y}-${toPosition.x},${toPosition.y}`} 
                    from={fromPosition} 
                    to={toPosition} 
                />;
            })}

            {nodes.map((node) => (
                <Node key={node.id} {...node} onClick={handleClick} onDrag={handleDrag} onDrop={handleDrop}/>
            ))}
            
            <button
                onClick={handleAdd}
                className={classes.addButton}
            >
                +
            </button>
        </div>
    )
  }