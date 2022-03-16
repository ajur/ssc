import { Sound, sound } from "@pixi/sound";
import { randomInt } from "d3-random";
import { gsap } from "gsap";
import { Circle, Container, IDestroyOptions, InteractionEvent, Sprite, Ticker } from 'pixi.js';

const TOO_MUCH = [
    "Too much!",
    "Too many hits.",
    "Why so hasty?",
    "Not so fast.",
    "Bad forcast.",
    "Wait for it!"
];

const tooMuchRng = randomInt(0, TOO_MUCH.length);
const randTooMuchMsg = () => TOO_MUCH[tooMuchRng()];

const WRONG_HIT = [
    "Error.",
    "Wrong one.",
    "Boom! Wrong!",
    "Bad luck!",
    "You missed!",
    "Not this one.",
    "Ouch! Wrong.",
    "Too hard to remember?"
];
const wrongHitRng = randomInt(0, WRONG_HIT.length);
const randWrongHitMsg = () => WRONG_HIT[wrongHitRng()];


const SECTIONS = [
    {img: 'simon/ss_lights_0_yellow.png', note: 'note-0'},
    {img: 'simon/ss_lights_1_green.png', note: 'note-1'},
    {img: 'simon/ss_lights_2_cyan.png', note: 'note-2'},
    {img: 'simon/ss_lights_3_blue.png', note: 'note-3'},
    {img: 'simon/ss_lights_4_purple.png', note: 'note-4'},
    {img: 'simon/ss_lights_5_red.png', note: 'note-5'},
];


export class StarShip extends Container {
    baseSprite: Sprite;
    segments: Sprite[];
    notes: Sound;

    sequence: number[] = [];
    sequenceTimeline?: gsap.core.Timeline;
    tappedSequence: number[] = [];
    nextLevelTimeout?: number;
    getNextSequenceIndex: () => number;

    constructor() {
        super();

        const bkg = this.baseSprite = Sprite.from('simon/ss_lights_base.png');
        bkg.anchor.set(0.5);
        this.addChild(bkg);

        const segs = this.segments = this.createSegments();
        this.addChild(...segs);

        this.notes = sound.find('simon_notes');

        this.getNextSequenceIndex = randomInt(0, segs.length);

        this.interactive = false;
        this.hitArea = new Circle(0, 0, bkg.width / 2);

        Ticker.shared.add(this.rotate, this);

        this.on('pointerdown', this.clicked, this);
    }

    rotate() {
        this.rotation += 0.0003;
    }

    resetSequence() {
        this.sequence = [];
        this.tappedSequence = [];
        this.sequenceTimeline?.kill();
        this.nextLevelTimeout && clearTimeout(this.nextLevelTimeout);
    }

    extendSequence() {
        this.sequence.push(this.getNextSequenceIndex());
    }

    get level() {
        return this.sequence.length;
    }

    newGame() {
        this.resetSequence();
        this.nextLevel();
    }

    nextLevel() {
        this.interactive = false;
        this.extendSequence();
        this.emit('set_msg', `Level ${this.level}`);
        this.playSequence(1);
    }

    gameOver(reason: string) {
        this.errSound();
        this.nextLevelTimeout && clearTimeout(this.nextLevelTimeout);
        this.interactive = false;
        this.emit('game_over', reason, this.level - 1);
    }

    private playSequence(delay = 0) {
        const tl = this.sequenceTimeline = gsap.timeline({ delay });
        this.sequence.forEach(idx => tl.add(this.lightUpSegment(idx), "<0.667"));
        tl.call(() => {
            this.tappedSequence = [];
            this.interactive = true;
            this.nextLevelTimeout = setTimeout(() => {
                this.gameOver("Don't wait so long. Repeat whole pattern.");
            }, 5000);
        });
    }

    private clicked(evt: InteractionEvent) {
        const idx = this.getClickedSegmentIndex(evt);
        
        this.lightUpSegment(idx, true);
        this.checkSeqClick(idx);
    }

    private getClickedSegmentIndex(evt: InteractionEvent) {
        const pos = evt.data.getLocalPosition(this);
        const rad = Math.atan2(pos.y, pos.x);
        return (Math.floor((rad + Math.PI / 2) / (Math.PI / 3)) + 6) % 6;
    }

    private checkSeqClick(idx: number): void {
        clearTimeout(this.nextLevelTimeout);

        if (this.tappedSequence.length >= this.sequence.length) {
            this.gameOver(randTooMuchMsg());
            return;
        }

        const nextIdx = this.sequence[this.tappedSequence.length];

        if (idx !== nextIdx) {
            this.gameOver(randWrongHitMsg());
            return;
        }

        this.tappedSequence.push(idx);
        if (this.tappedSequence.length == this.sequence.length) {
            this.nextLevelTimeout = setTimeout(() => {
                this.okSound(); 
                this.nextLevel();
            }, 1000);
        } else {
            this.nextLevelTimeout = setTimeout(() => {
                this.gameOver("Don't wait so long. Repeat whole pattern.");
            }, 5000);
        }
    }

    private lightUpSegment(idx: number, fast = false) {
        const seg = this.segments[idx];
        const note = SECTIONS[idx].note;
        const tl = gsap.timeline().call(() => {this.notes.play(note)})
        if (!fast){
            tl.to(seg, {alpha: 1.0, duration: 0.1, ease: "power2.out"})
            tl.to(seg, {alpha: 0, duration: 0.6, ease: "power2.in"})
        } else {
            tl.fromTo(seg, {alpha: 1.0}, {alpha: 0, duration: 0.5, ease: "power2.in"})
        }
        return tl;
    }

    private createSegments() {
        return SECTIONS.map(sec => {
            const spr = Sprite.from(sec.img);
            spr.anchor.set(0.5);
            spr.alpha = 0;
            return spr;
        });
    }

    okSound() {
        ['note-1','note-3','note-5'].forEach((n,i) => setTimeout(() => this.notes.play(n), i * 50));
    }

    errSound() {
        ['note-0','note-3','note-4'].forEach(n => this.notes.play(n));
    }

    destroy(options?: boolean | IDestroyOptions): void {
        Ticker.shared.remove(this.rotate, this);
        super.destroy(options);
    }
}
