import { useEffect, useRef, useState } from 'react'
import Node, { NodeProps, Position } from '../components/Node'
import Connection from '../components/Connection';
import { useNodesContext } from '../store/contexts/NodesContext';
import { useSelectedNodeContext } from '../store/contexts/SelectedNodeContext';
import { useNodeConnectionsContext } from '../store/contexts/NodeConnectionsContext';
import { scrape } from '../utils/api';
import { IconPlus, IconLink } from '@tabler/icons-react';
import classes from './SemanticPlot.module.css';
import { ActionIcon, Modal, Stack, TextInput, Text, Button, Notification } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const NODE_SIZE = 50

export default function SemanticPlot(){
    const containerRef = useRef<HTMLDivElement>(null); 

    const { nodes, addNode, setNodes, getNode } = useNodesContext();
    const { selectNode } = useSelectedNodeContext();
    const { connections } = useNodeConnectionsContext();

    const [opened, {close, open}] = useDisclosure(false);
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleAdd = () => {
        const newNode = {
            id: crypto.randomUUID(),
            title: '',
            content: '',
            position: { x: 0, y: 0 },
        };
        addNode(newNode);
    };

    const handleClick = (node: NodeProps) => {
        selectNode(node);
    }

    // when number of nodes changes, check all node positions and correct if needed
    useEffect(() => {
        nodes.forEach(n => handleMove(n.id, n.position));
    }, [nodes.length]);

    // set listener for window resize event: if window changes size, check all node positions and correct
    useEffect(() => {
        const handleResize = () => {
            nodes.forEach((node) => {
                handleMove(node.id, node.position);
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [nodes]);

    // wrapper, define how nodes should behave when dragged and dropped on Demo page
    const handleDrag = (id: string, target: Position) => {
        moveNode(id, target);
    }

    const handleDrop = (id: string, target: Position) => {
        handleMove(id, target);
    }

    // handler for modal; add story for scraping via url
    const handleScrape = async () => {
        setLoading(true);
        setFeedback(null);

        try {
            await scrape(url);
            setFeedback({ type: 'success', message: 'URL successfully queued for scraping.' });
            setUrl('');
        } catch (error) {
            setFeedback({ type: 'error', message: 'Failed to queue URL.' });
        }

        setLoading(false);
    };

    // helper functions
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
            const centerX = rect.left + rect.width  / 2 - NODE_SIZE / 2;
            const centerY = rect.top  + rect.height / 2 - NODE_SIZE / 2;

            const theta = Math.random() * Math.PI * 2;

            const maxR = Math.min(rect.width, rect.height) * 0.2;
            const r    = Math.random() * maxR;

            let x = centerX + Math.cos(theta) * r;
            let y = centerY + Math.sin(theta) * r;

            x = Math.max(rect.left, Math.min(x, rect.right  - NODE_SIZE));
            y = Math.max(rect.top,  Math.min(y, rect.bottom - NODE_SIZE));
             
            target = { x, y};
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
        <div ref={containerRef} className={classes.container}>
            {connections.map(({from, to, score}) => {
                return <Connection 
                    key={`${from}-${to}-${getNode(from)?.position.x}-${getNode(from)?.position.y}-${getNode(to)?.position.x}-${getNode(to)?.position.y}`} 
                    from={from} 
                    to={to}
                    score={score}
                />;
            })}

            {nodes.map((node) => (
                <Node key={node.id} {...node} onClick={handleClick} onDrag={handleDrag} onDrop={handleDrop}/>
            ))}


            <Stack className={classes.buttonContainer}>
                <ActionIcon
                    onClick={handleAdd}
                    size="lg"
                >
                    <IconPlus strokeWidth={2} />
                </ActionIcon>
                <ActionIcon
                    size="lg"
                    onClick={open}
                >
                    <IconLink strokeWidth={2}/>
                </ActionIcon>
            </Stack>

            <Modal opened={opened} onClose={close} title="Add Story from URL">
                <TextInput 
                    label="Story URL" 
                    placeholder="https://www.royalroad.com/fiction/your-story-slug"
                    value={url}
                    onChange={(event) => setUrl(event.currentTarget.value)}
                    disabled={loading}
                    required
                />

                <Text size="xs" mt="xs" c="dimmed">
                    This only queues the story for scraping. Please wait a few minutes after a successful queue for the story to be added to the vector database.
                </Text>
                <Text size="xs" mt="xs" c="red">
                    Only accepts <strong>RoyalRoad.com</strong> links currently.
                </Text>
                <Button mt="md" onClick={handleScrape} loading={loading}>
                    Submit
                </Button>

                {feedback && (
                    <Notification mt="md" color={feedback.type === 'success' ? 'teal' : 'red'} onClose={() => setFeedback(null)}>
                        {feedback.message}
                    </Notification>
                )}

            </Modal>
        </div>
    )
  }