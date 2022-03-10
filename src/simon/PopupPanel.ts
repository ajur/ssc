import { gsap } from 'gsap';
import { Container, NineSlicePlane, Text, Texture } from 'pixi.js';

export class PopupPanel extends Container {
    _panelWidth: number;
    _panelHeight: number;

    bkg: NineSlicePlane;
    msg: Text;

    constructor(width: number, height: number, text = "") {
        super();
        this._panelWidth = width;
        this._panelHeight = height;
        this.bkg = this.addChild(this.createBackground(width, height));
        this.msg = this.addChild(this.createMsg(width, text));

        this.show(text, true);
    }

    public show(text = "", instant = false, delayClose = false) {
        this.msg.text = text;
        const tl = gsap.timeline()
            .set(this, { visible: true })
            .add([
                gsap.fromTo(this.scale, { x: 0 }, { x: 1, ease: "power2.out", duration: 0.2 }),
                gsap.fromTo(this, { alpha: 0 }, { alpha: 1, ease: "power2.out", duration: 0.2 })
            ])
            .set(this, { interactive: true }, delayClose ? '<1' : '>');
        if (instant) {
            tl.progress(1);
        }
    }

    public hide() {
        this.interactive = false;
        gsap.timeline()
            .to(this.scale, {x: 0, ease: "power2.out", duration: 0.2})
            .to(this, {alpha: 0, ease: "power2.in", duration: 0.2}, "<")
            .set(this, { visible: false });
    }

    private createBackground(width: number, height: number): NineSlicePlane {
        const bkg = new NineSlicePlane(Texture.from('/simon/glassPanel.png'), 10, 10, 10, 10);
        bkg.width = width;
        bkg.height = height;
        bkg.position.set(-width / 2, -height / 2);
        bkg.renderable = false;
        return bkg;
    }

    private createMsg(width: number, msg: string | undefined): Text {
        const txt = new Text(msg ?? "", {
            fill: 0xe7e7e7,
            fontSize: 32,
            padding: 15,
            fontFamily: "AegisOutlet",
            wordWrap: true,
            wordWrapWidth: width * 0.9,
            align: "center"
        });
        txt.anchor.set(0.5);
        return txt;
    }
}
