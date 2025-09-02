import React, { useRef, useEffect, PointerEvent } from 'react';
import { useSelectedNodeContext } from '../store/contexts/SelectedNodeContext';
import styles from './Node.module.css'

export interface NodeProps {
    id: string; 
    title: string;
    content: string;
    position: Position;
    onClick?: (node: NodeProps) => void;
    onDrag?: (id: string, target: Position) => void;
    onDrop?: (id: string, target: Position) => void;
    writeable?: boolean;
    url?: string;
}

export interface Position {
    x: number;
    y: number;
}
  
const DRAG_THRESHOLD = 5;

const Node: React.FC<NodeProps> = ({ id, title, content, position, onClick, onDrag, onDrop, writeable=true, url }) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef(false);
    const offsetRef = useRef<Position>({ x: 0, y: 0 });
    const initialPointerRef = useRef<Position>({ x: 0, y: 0 });  

    const { selectedNode } = useSelectedNodeContext();
    
    const handlePointerDown = (e: PointerEvent) => {
        if (!onClick) return;
        if (e.button !== 0) return; // e.button == 0 for left mouse button
        if (!nodeRef.current) return;
    
        const rect = nodeRef.current.getBoundingClientRect();
    
        offsetRef.current = {
            x: e.pageX - (rect.left + window.scrollX),
            y: e.pageY - (rect.top + window.scrollY),
        };
        initialPointerRef.current = { x: e.pageX, y: e.pageY };
        draggingRef.current = true;

        e.stopPropagation();
        e.preventDefault();
    };

    const handlePointerMove = (e: PointerEvent) => {
        if (!onDrag) return;
        if (!draggingRef.current) return;

        const newPosition: Position = {
            x: e.pageX - offsetRef.current.x,
            y: e.pageY - offsetRef.current.y,
        };
        onDrag(id, newPosition);

        e.stopPropagation();
        e.preventDefault();
    };

    const handlePointerUp = (e: PointerEvent) => {
        if (!onClick || !onDrop) return;
        if (!draggingRef.current) return;
        
        draggingRef.current = false;
        const dx = e.pageX - initialPointerRef.current.x;
        const dy = e.pageY - initialPointerRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        if (distance < DRAG_THRESHOLD && onClick) {
            onClick({ id, title, content, position, onClick, onDrag, onDrop, writeable, url });
        } else if (onDrop) {
            const target: Position = {
                x: e.pageX - offsetRef.current.x,
                y: e.pageY - offsetRef.current.y,
            };
            onDrop(id, target);        
        }

        e.stopPropagation();
        e.preventDefault();
    };
    
    useEffect(() => {
        const node = nodeRef.current!;
        node.addEventListener('pointerdown', handlePointerDown as any);
        document.addEventListener('pointermove', handlePointerMove as any);
        document.addEventListener('pointerup', handlePointerUp as any);
        return () => {
            node.removeEventListener('pointerdown', handlePointerDown as any);
            document.removeEventListener('pointermove', handlePointerMove as any);
            document.removeEventListener('pointerup', handlePointerUp as any);
        };
    }, [draggingRef.current, content, title]);
    
    return (
        <div
            ref={nodeRef}
            onPointerDown={handlePointerDown}
            className={`node ${styles.node} ${selectedNode?.id === id ? styles.selected : ''}`}
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                transition: draggingRef.current ? 'none' : 'left 0.5s ease, top 0.5s ease'
            }}
        >
            {title.split(/\s+/).map(word => word[0]?.toUpperCase()).slice(0, 3).join('')}
        </div>
    );
};

export default Node;