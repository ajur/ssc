/* eslint-disable @typescript-eslint/no-explicit-any */

import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';
import * as SOUND from '@pixi/sound';
import { Pane } from 'tweakpane';

export function withGlobals(app: PIXI.Application, menu: Pane) {
    const global = window as any;

    global.gsap = gsap;
    global.PIXI = {
        ...PIXI,
        ...SOUND
    };

    global.APP = app;
    global.MENU = menu;
    
}
