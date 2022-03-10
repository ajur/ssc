import { Application } from 'pixi.js';
import { sounds } from './Sounds';
import './main.css';
import { preload } from "./preloader";
import { Scene } from "./simon/interfaces";
import { SpaceSimon } from './simon/SpaceSimon';
// just for debugging
import { withGlobals } from './debug';
import { Pane } from 'tweakpane';


preload({onLoaded, onClicked});

function onLoaded() {
    const app = new Application({
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        resizeTo: window,
        backgroundColor: 0x000000
    });
    const appElem = document.querySelector<HTMLDivElement>('#app') ?? document.body;
    appElem.appendChild(app.view);


    const scene: Scene = new SpaceSimon(app.screen.width, app.screen.height);
    app.stage.addChild(scene);
    app.renderer.on('resize', scene.resize, scene);

    const menu = createTweakPane();

    withGlobals(app, menu);
}

function onClicked() {
    sounds.playMusic('simon_music');
}

function createTweakPane(): Pane {

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const menuDiv = document.getElementById('menu')!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const toggleButton = document.getElementById('menu-toggle')!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const container = document.getElementById('menu-container')!

    const pane = new Pane({container});

    sounds.addSoundsControlPanel(pane);

    toggleButton.addEventListener('pointerdown', () => {
        menuDiv.classList.toggle('closed');
    });

    pane.addSeparator();

    pane.addButton({
        title: 'Close menu',
    }).on('click', () => {
        menuDiv.classList.add('closed');
    });
    

    return pane;
}
