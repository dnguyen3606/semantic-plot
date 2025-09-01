import { useState, useRef, useEffect } from 'react';
import { toScreenCoordinate, toWorldCoordinate } from '../utils/coordinate';
import classes from './MapViewport.module.css';

const MapViewPort = () => {
    const [camera, setCamera] = useState({ cx: 0, cy: 0, scale: 1 });
    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 })
    
    // resize observer to track container size relative to screen changing
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                setSize({ width, height });
            }
        });

        resizeObserver.observe(container);

        return () => {
            resizeObserver.unobserve(container);
            resizeObserver.disconnect();
        };
    }, []);


    return (
        <div ref={containerRef} className={classes.container}>
            <canvas width={size.width} height={size.height}></canvas>
            <div style={{ position: "absolute", top: size.height / 2, left: size.width / 2, color: "black" }}>
                {size.width} x {size.height}
            </div>
        </div>
    )
}

export default MapViewPort;