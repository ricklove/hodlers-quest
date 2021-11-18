import React, { useEffect, useRef } from 'react';
import { gameHost } from '@hodlers-quest/art';
import { GameRenderMode } from '@hodlers-quest/art/lib/src/types';
import p5 from 'p5';

export const TokenHost = ({ tokenId, renderMode, canvasScale: canvasScaleOverride, hideStyle }: { tokenId: string; renderMode?: GameRenderMode; canvasScale?: number; hideStyle?: boolean }) => {

    const hostRef = useRef(null as null | HTMLDivElement);
    const inputKeyboardRef = useRef(null as null | HTMLInputElement);

    const canvasScale = canvasScaleOverride ? canvasScaleOverride
        : window.innerWidth >= 900 && window.innerHeight >= 900 ? 3
        : window.innerWidth >= 600 && window.innerHeight >= 600 ? 2
        : window.innerWidth >= 450 && window.innerHeight >= 450 ? 1.5
        : 1;

    useEffect(() => {
        gameHost.renderGame({
            tokenId,
            renderMode,
            canvasScale,
            createP5: (callback) => {
                if (!hostRef.current){return;}
                const result = new p5(callback, hostRef.current);
                // TODO: Unsub
            },
            showKeyboard: () => {
                inputKeyboardRef.current?.focus();
            },
        });
    }, []);

    return (
        <div style={hideStyle ? {} : { boxShadow: `0px 0px 1px 0px #FFFFFF`, borderRadius: 0 }}>
            <div
                style={{ width: 320 * canvasScale, height: 320 * canvasScale, position: `relative` }}
            >
                <input type='text' ref={inputKeyboardRef}
                    style={{
                        width: 320 * canvasScale, height: 320 * canvasScale,
                        opacity: 0,
                        position: `absolute`,
                        left: 0, bottom: 0,
                        fontSize: 16,
                        padding: 0, margin: 0,
                        textAlign: `end`,
                        verticalAlign: `bottom`,
                    }}
                    autoCorrect='off'
                    autoCapitalize='off'
                    autoFocus={true}
                    />
                <div ref={hostRef}
                    style={{ width: 320 * canvasScale, height: 320 * canvasScale }} />

            </div>
        </div>
    );
};
