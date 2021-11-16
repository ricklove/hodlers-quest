import type p5 from 'p5';
import { pixelFontBase64_pressStart } from './fonts/pixel-font-press-start';
import { drawGame, GameCache, GameSettings, GameState } from './game-engine';
import { createNftAdventure_nftTextAdventure } from './story';
import { getGameStepFromTokenId } from './token-id';
import { createEventProvider, EventProvider } from './utils/event-provider';

const nftAdventure_nftDungeon = createNftAdventure_nftTextAdventure();

export const gameHost = {
    renderGame: ({
        tokenId = `0`,
        createP5,
        showKeyboard,
    }: {
        tokenId: string;
        createP5: (callback: (s: p5) => void) => void;
        showKeyboard: () => void;
    }) => {
        const TARGET_SIZE = 300;
        const SMALL_SIZE = 300;
        const size = window.innerWidth > TARGET_SIZE && window.innerHeight > TARGET_SIZE ? TARGET_SIZE : SMALL_SIZE;

        let canvas = null as null | HTMLCanvasElement;
        let eventProvider = null as null | EventProvider;
        const { stepIndexInit, actionIndexInit } = getGameStepFromTokenId(tokenId);

        const now = () => {
            return Date.now();
        };

        let gameState = {
            timeStart: now(),
            stepIndex: stepIndexInit,
            actionIndex: actionIndexInit,
            input: ``,
            isRespondingToInput: false,
            mode: `step`,
        } as GameState;

        const gameCache = {} as GameCache;
        let font = null as null | p5.Font;

        const gameSettings: GameSettings = {
            artPath: `/media/art/`,
        };

        return createP5((s: p5) => {
            s.setup = () => {
                console.log(`renderArt:createP5:s.setup`);

                const result = s.createCanvas(size, size, `webgl`);
                font = s.loadFont(pixelFontBase64_pressStart);

                const canvasId = `${Math.random()}`;
                result.id(canvasId);
                canvas = document.getElementById(canvasId) as HTMLCanvasElement;

                eventProvider = createEventProvider(canvas);
                eventProvider.canvasAddEventListener(`touchstart`, () => {
                    showKeyboard();
                });
                eventProvider.windowAddEventListener(`keydown`, x => {

                    if (x.key.toLowerCase() === `backspace`){
                        gameState.input = gameState.input.substr(0, gameState.input.length - 1);
                    } else if (x.key.toLowerCase() === `enter`){
                        gameState. input += `\n`;
                    } else if (x.key.match(/^[A-Za-z0-9 ]$/)) {
                        gameState.input = gameState.input.trimStart() + x.key;
                    }

                    console.log(`keypress`, { x, input: gameState.input });
                });

            };
            s.draw = () => {
                // console.log(`renderArt:createP5:s.draw`);

                // WEBGL
                s.translate(-size / 2, -size / 2, 0);
                if (font) { s.textFont(font); }

                // if (isDone){ return; }

                // if (recorder?.isWaitingForFrame() && canvas) {
                //     console.log(`game.update waitingForFrame - addFrame`, {});
                //     (async () => await recorder.getRecorder().addFrame(canvas))();
                //     return;
                // }

                const timeStart = gameState.timeStartMs ?? now();
                const timeMs = now() - timeStart;

                const result = drawGame({
                    frame: { width: size, height: size },
                    s,
                    gameData: nftAdventure_nftDungeon,
                    gameState,
                    gameCache,
                    tokenId,
                    timeMs,
                    settings: gameSettings,
                });

                gameState = result.gameState;
                if (!gameState.timeStartMs){
                    gameState.timeStartMs = now();
                }
            };
        });
    },
};
