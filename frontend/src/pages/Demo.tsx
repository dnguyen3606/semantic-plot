import { useEffect, useRef, useState } from 'react'
import Node, { NodeProps, Position } from '../components/Node'
import { useNodeContext } from '../store/contexts/NodeContext';

const NODE_SIZE = 50

export default function Demo(){
    const containerRef = useRef<HTMLDivElement>(null); 

    const [nodes, setNodes] = useState<NodeProps[]>([
        {
          id: '1',
          title: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.',
          content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.',
          position: { x: 550, y: 250 },
        },
        {
          id: '2',
          title: 'Creative Conduit',
          content: 'Channeling innovative ideas with precision.',
          position: { x: 450, y: 250 },
        },
    ]);

    const { selectedNode, selectNode } = useNodeContext();

    // const addNode = (node: NodeProps) => {
    //     setNodes((prev) => [...prev, node]);
    // }

    const handleClick = (node: NodeProps) => {
        selectNode(node);
    }

    useEffect(() => {
        if (!selectedNode) return;
        setNodes((prev) =>
            prev.map((node) =>
                node.id === selectedNode.id ? selectedNode : node
            )
        );
    }, [selectedNode]);

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
                node.id === id ? { ...node, position: { ...target } } : node
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
            {nodes.map((node) => (
                <Node key={node.id} {...node} onClick={handleClick} onDrag={handleDrag} onDrop={handleDrop}/>
            ))}
        </div>
    )
  }