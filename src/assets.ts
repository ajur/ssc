import { SoundSpriteDataMap } from "@pixi/sound";
import { IAddOptions, LoaderResource } from "pixi.js";

export function assets(): IAddOptions[] {
    return [
        { url: "/simon/TeacherA.ttf", name: "TeacherA"},
        { url: "/simon/AegrisOutlineRegular.ttf", name: "AegisOutlet"},
        { url: "/simon/simon.json" },
        { url: "/simon/music.mp3", name: "simon_music"},
        { url: "/simon/notes.mp3", name: "simon_notes", onComplete: withSprites(simonNotesSprite) }
    ].map(fixBasePath);
}

const simonNotesSprite: SoundSpriteDataMap = {
    'note-0': { start: 0, end: 1 },
    'note-1': { start: 1, end: 2 },
    'note-2': { start: 2, end: 3 },
    'note-3': { start: 3, end: 4 },
    'note-4': { start: 4, end: 5 },
    'note-5': { start: 5, end: 6 },
}

const withSprites = 
    (sprites: SoundSpriteDataMap) => 
        (resource: LoaderResource) => resource.sound?.addSprites(sprites);

const fixBasePath = 
    (opt: IAddOptions) => {
        if (opt.url?.startsWith('/')) {
            return {...opt, url: import.meta.env.BASE_URL + opt.url.substring(1)};
        }
        return opt;
    };