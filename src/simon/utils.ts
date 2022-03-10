import { DisplayObject } from 'pixi.js';

export function scaleToFit(obj: DisplayObject, width: number, height: number): number {
    const bounds = obj.getLocalBounds();
    const w = Math.max(1, bounds.width);
    const h = Math.max(1, bounds.height);
    return Math.min(width / w, height / h);
}

export function scaleDownToFit(...params: Parameters<typeof scaleToFit>): number {
    return Math.min(1, scaleToFit(...params));
}
