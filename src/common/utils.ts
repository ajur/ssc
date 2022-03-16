import { DisplayObject } from 'pixi.js';

export const math = {
    clamp: (val: number, min: number, max: number): number => val < min ? min : val > max ? max : val
}

export const storage = {
    load: localStorageLoad,
    loadDefault: localStorageLoadDefault,
    save: localStorageSave
}

export const fun = {
    debounce 
}

export const display = {
    scaleToFit,
    scaleDownToFit
}

function localStorageLoad<Type>(key: string): Type | undefined {
    return localStorageLoadDefault(key, undefined);
}
function localStorageLoadDefault<Type>(key: string, fallback: Type): Type {
    const saved = globalThis.localStorage.getItem(key)
    if (saved) {
        return JSON.parse(saved) as Type;
    }
    return fallback;
}

function localStorageSave<Type>(key: string, data: Type): void {
    globalThis.localStorage.setItem(key, JSON.stringify(data));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DebouncedFunction<P extends unknown[]> = (this: any, ...p: P) => void;
function debounce<P extends unknown[]>(func: DebouncedFunction<P>, waitMS = 300): DebouncedFunction<P>  {
    let timeout: number;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, waitMS);
    }
}


export function scaleToFit(obj: DisplayObject, width: number, height: number): number {
    const bounds = obj.getLocalBounds();
    const w = Math.max(1, bounds.width);
    const h = Math.max(1, bounds.height);
    return Math.min(width / w, height / h);
}

export function scaleDownToFit(...params: Parameters<typeof scaleToFit>): number {
    return Math.min(1, scaleToFit(...params));
}