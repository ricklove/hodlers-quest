import { GlobalArtControllerWindow } from '@hodlers-quest/common';
import type p5 from 'p5';
import { pixelFontBase64_pressStart } from './fonts/pixel-font-press-start';
import { drawGame, GameCache, GameSettings, GameState } from './game-engine';
import { createNftAdventure_nftTextAdventure } from './story';
import { getGameStepFromTokenId } from './token-id';
import { GameRenderMode } from './types';
import { createEventProvider, EventProvider } from './utils/event-provider';

const nftAdventure_nftDungeon = createNftAdventure_nftTextAdventure();

export const gameHost = {
    renderGame: ({
        tokenId = `0`,
        renderMode,
        canvasScale = 1,
        createP5,
        showKeyboard,
    }: {
        tokenId: string;
        renderMode?: GameRenderMode;
        canvasScale: number;
        createP5: (callback: (s: p5) => void) => void;
        showKeyboard: () => void;
    }) => {

        const RENDERER: p5.RENDERER = renderMode ? `p2d` : `webgl`;

        const TARGET_SIZE = 300 * canvasScale;
        const SMALL_SIZE = 300 * canvasScale;
        const size = window.innerWidth > TARGET_SIZE && window.innerHeight > TARGET_SIZE ? TARGET_SIZE : SMALL_SIZE;

        const windowGlobalController = window as unknown as GlobalArtControllerWindow;
        windowGlobalController.globalArtController = {
            loadTokenId: async (tokenIdNew) => {
                return await new Promise((resolve) => {

                    globalControllerState.onDrawStart = () => {
                        globalControllerState.onDrawStart = null;

                        const { stepIndex, actionIndex } = getGameStepFromTokenId(tokenIdNew);
                        gameState = {
                            timeStartMs: now(),
                            stepIndex,
                            actionIndex,
                            tokenId: tokenIdNew,
                            input: ``,
                            mode: `step`,
                            autoPlayMode: `step-image`,
                            renderMode,
                        };
                        console.log(`globalControllerState.onDrawStart`, { gameState, stepIndex, actionIndex });
                    };
                    globalControllerState.onDrawEnd = () => {
                        globalControllerState.onDrawEnd = null;
                        resolve();
                        console.log(`globalControllerState.onDrawEnd`, { gameState });
                    };
                });
            },
        };
        const globalControllerState = {
            onDrawStart: null as null | (() => void),
            onDrawEnd: null as null | (() => void),
        };

        let canvas = null as null | HTMLCanvasElement;
        let eventProvider = null as null | EventProvider;
        const { stepIndex: stepIndexInit, actionIndex: actionIndexInit } = getGameStepFromTokenId(tokenId);

        const now = () => {
            return Date.now();
        };

        let gameState: GameState = {
            timeStartMs: now(),
            stepIndex: stepIndexInit,
            actionIndex: actionIndexInit,
            tokenId,
            input: ``,
            mode: `step`,
            autoPlayMode: renderMode ? `step-image` : (stepIndexInit ?? 0) > 0 ? `play` : false,
            renderMode,
        };

        const gameCache = {} as GameCache;
        let font = null as null | p5.Font;

        const gameSettings: GameSettings = {
            artPath: `/media/art/`,
            canvasScale,
        };

        return createP5((s: p5) => {
            s.setup = () => {
                console.log(`renderArt:createP5:s.setup`);

                const result = s.createCanvas(size, size, RENDERER);
                font = s.loadFont(pixelFontBase64_pressStart);

                const canvasId = `${Math.random()}`;
                result.id(canvasId);
                canvas = document.getElementById(canvasId) as HTMLCanvasElement;

                eventProvider = createEventProvider(canvas);
                eventProvider.canvasAddEventListener(`touchend`, () => {
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
                globalControllerState.onDrawStart?.();

                // WEBGL
                if (RENDERER === `webgl`){
                    s.translate(-size / 2, -size / 2, 0);
                }
                if (font) { s.textFont(font); }

                // if (isDone){ return; }

                // if (recorder?.isWaitingForFrame() && canvas) {
                //     console.log(`game.update waitingForFrame - addFrame`, {});
                //     (async () => await recorder.getRecorder().addFrame(canvas))();
                //     return;
                // }

                const timeStart = gameState.timeStartMs ?? now();
                const timeMs = now() - timeStart;

                let isStillLoading = false;
                const result = drawGame({
                    frame: { width: size, height: size },
                    s,
                    gameData: nftAdventure_nftDungeon,
                    gameState,
                    gameCache,
                    timeMs,
                    settings: gameSettings,
                    onStillLoading: () => {
                        isStillLoading = true;
                    },
                });

                gameState = result.gameState;
                if (!gameState.timeStartMs){
                    gameState.timeStartMs = now();
                }

                if (!isStillLoading){
                    globalControllerState.onDrawEnd?.();
                }
            };
        });
    },
};
