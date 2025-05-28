import React, { useRef, useEffect, MouseEvent } from 'react';
import { useSelectedNodeContext } from '../store/contexts/SelectedNodeContext';
import styles from './Node.module.css'

export interface NodeProps {
    id: string; 
    title: string;
    content: string;
    position: Position;
    writeable?: boolean;
    onClick?: (node: NodeProps) => void;
    onDrag?: (id: string, target: Position) => void;
    onDrop?: (id: string, target: Position) => void;
}

export interface Position {
    x: number;
    y: number;
}
  
const DRAG_THRESHOLD = 5;

const Node: React.FC<NodeProps> = ({ id, title, content, position, onClick, onDrag, onDrop }) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef(false);
    const offsetRef = useRef<Position>({ x: 0, y: 0 });
    const initialMouseRef = useRef<Position>({ x: 0, y: 0 });  

    const { selectedNode } = useSelectedNodeContext();
    
    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (!onClick) return;
        if (e.button !== 0) return; // e.button == 0 for left mouse button
        if (!nodeRef.current) return;
    
        const rect = nodeRef.current.getBoundingClientRect();
    
        offsetRef.current = {
            x: e.pageX - (rect.left + window.scrollX),
            y: e.pageY - (rect.top + window.scrollY),
        };
        initialMouseRef.current = { x: e.pageX, y: e.pageY };
        draggingRef.current = true;

        e.stopPropagation();
        e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent<Document>) => {
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

    const handleMouseUp = (e: MouseEvent<Document>) => {
        if (!onClick || !onDrop) return;
        if (!draggingRef.current) return;
        
        draggingRef.current = false;
        const dx = e.pageX - initialMouseRef.current.x;
        const dy = e.pageY - initialMouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        if (distance < DRAG_THRESHOLD && onClick) {
            onClick({ id, title, content, position, onClick, onDrag, onDrop });
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
        document.addEventListener('mousemove', handleMouseMove as any);
        document.addEventListener('mouseup', handleMouseUp as any);
        
        return () => {
            document.removeEventListener('mousemove', handleMouseMove as any);
            document.removeEventListener('mouseup', handleMouseUp as any);
        };
    }, [draggingRef.current, content, title]);
    
    return (
        <div
            ref={nodeRef}
            onMouseDown={handleMouseDown}
            className={`${styles.node} ${selectedNode?.id === id ? styles.selected : ''}`}
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                transition: draggingRef.current ? 'none' : 'left 0.5s ease, top 0.5s ease'
            }}    
        />
    );
};

export default Node;