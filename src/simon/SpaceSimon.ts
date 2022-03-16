import { Container, IDestroyOptions, MIPMAP_MODES, Text, Ticker, TilingSprite } from 'pixi.js';
import { StarShip } from "./StarShip";
import { Scene } from './interfaces';
import { PopupPanel } from './PopupPanel';
import { scaleDownToFit } from './utils';


export class SpaceSimon extends Container implements Scene {
    bkg: TilingSprite;
    bottom: Container;

    sceneWidth: number;
    sceneHeight: number;
    starShip: StarShip;
    txt: Text;
    popup: PopupPanel;
    title: TilingSprite;

    constructor(width: number, height: number) {
        super();

        this.sceneWidth = width;
        this.sceneHeight = height;

        this.bkg = this.addChild(this.createBkg());

        this.bottom = this.addChild(new Container());
        this.txt = this.bottom.addChild(this.infoText());
        
        this.starShip = this.addChild(new StarShip());

        this.title = this.addChild(this.createTitle());

        this.popup = this.addChild(new PopupPanel(400, 400, "Welcome!\n\nClick to start new game."));

        this.popup.on('pointertap', this.newGame, this);
        this.starShip.on('set_msg', this.logMsg, this);
        this.starShip.on('game_over', this.gameOver, this);

        this.resize(width, height);

        Ticker.shared.add(this.moveBackground, this);
    }

    newGame() {
        this.popup.hide();
        this.starShip.newGame();
    }

    logMsg(msg: string) {
        this.txt.text = msg;
    }

    gameOver(msg: string, level: number) {
        this.logMsg(msg);
        this.popup.show(`Game Over!\nYou managed to remember ${level} beats!\nClick to start new game.`, false, true);
    }

    createBkg(): TilingSprite {
        const spr = TilingSprite.from("simon/background.png", { width: this.width, height: this.height });
        spr.texture.baseTexture.mipmap = MIPMAP_MODES.OFF;  // fix flickering
        return spr;
    }

    private createTitle(): TilingSprite {
        const txt = new Text("SpaceSimon", {
            fill: 0xe7e7e7,
            fontSize: 64,
            padding: 15,
            fontFamily: "TeacherA"
        });
        txt.anchor.set(0.5, 0);

        const spr = TilingSprite.from("simon/titleBackgrund.png", {width: txt.width, height: txt.height});
        spr.texture.baseTexture.mipmap = MIPMAP_MODES.OFF;  // fix flickering
        spr.anchor.set(0.5, 0);
        spr.mask = spr.addChild(txt);

        return spr;
    }

    infoText() {
        const txt = new Text("", {
            fill: 0xe7e7e7,
            fontSize: 32,
            padding: 15,
            fontFamily: "AegisOutlet"
        });
        txt.anchor.set(0.5);
        return txt;
    }

    resize(width: number, height: number) {
        this.bkg.width = width;
        this.bkg.height = height;

        const W95 = width * 0.95;
        const H95 = height * 0.95;
        const W75 = width * 0.75;

        this.starShip.position.set(width / 2, height / 2);
        this.starShip.scale.set(scaleDownToFit(this.starShip, W95, H95));

        this.title.position.set(width / 2, 10);
        this.title.scale.set(scaleDownToFit(this.title, W75, H95));
        if (height < width) {
            this.title.scale.set(this.title.scale.x * 0.7);
            this.title.position.x = this.title.width / 2;
        }

        this.popup.position.set(width / 2, height / 2);
        this.popup.scale.set(scaleDownToFit(this.popup, W95, H95));

        const bottomScale = scaleDownToFit(this.bottom, W95, H95);
        this.bottom.scale.set(bottomScale);
        const bottomRect = this.bottom.getLocalBounds()
        this.bottom.position.set(width / 2, height - bottomRect.height * bottomScale);
    }

    moveBackground() {
        this.bkg.tilePosition.y = (this.bkg.tilePosition.y + 0.1) % this.bkg.texture.height;
        this.title.tilePosition.y = (this.title.tilePosition.y + 0.1) % this.title.texture.height;
    }

    destroy(options?: boolean | IDestroyOptions): void {
        Ticker.shared.remove(this.moveBackground, this);
        super.destroy(options);
    }
}
