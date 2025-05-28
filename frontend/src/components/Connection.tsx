import { Position } from './Node';
import classes from './Connection.module.css'
//import { useEffect, useState } from 'react';

interface ConnectionProps {
  from: Position;
  to: Position;
}

export default function Connection({ from, to }: ConnectionProps) {

  return (
    <svg className={classes.layer} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <line
        x1={from.x + 25}
        y1={from.y + 25}
        x2={to.x + 25}
        y2={to.y + 25}
        className={classes.connection}
        />
    </svg>
  );
}
