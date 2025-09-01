// 'scale' represents the zoom of the camera to affect the size of the tiles.
// 'width', 'height' are of the viewport holding the map.

export const toScreenCoordinate = (
    wx: number, wy: number, 
    scale: number, 
    cx: number, cy: number, 
    width: number, height: number
): [number, number] => {
    const sx = (wx - cx) * scale + width/2;
    const sy = (wy - cy) * scale + height/2;
    return [sx, sy]
}

export const toWorldCoordinate = (
    sx: number, sy: number, 
    scale: number, 
    cx: number, cy: number, 
    width: number, height: number
): [number, number] => {
    const wx = (sx - width/2) / scale + cx;
    const wy = (sy - height/2) / scale + cy;
    return [wx, wy]
}