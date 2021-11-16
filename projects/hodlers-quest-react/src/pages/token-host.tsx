import React, { useEffect, useRef } from 'react';
import '../blank.css';
import { gameHost } from '@hodlers-quest/art';
import p5 from 'p5';

export const TokenHost = ({ tokenId, isStaticImage }: { tokenId: string; isStaticImage?: boolean }) => {

    const id = `art-host`;
    const inputKeyboardRef = useRef(null as null | HTMLInputElement);

    const canvasScale = isStaticImage ? 2
        : window.innerWidth >= 900 && window.innerHeight >= 900 ? 3
        : window.innerWidth >= 600 && window.innerHeight >= 600 ? 2
        : window.innerWidth >= 450 && window.innerHeight >= 450 ? 1.5
        : 1;

    useEffect(() => {
        gameHost.renderGame({
            tokenId,
            isStaticImage: isStaticImage ?? false,
            canvasScale,
            createP5: (callback) => {
                const element = document.getElementById(id) as HTMLElement;
                const result = new p5(callback, element);

                // TODO: Unsub
            },
            showKeyboard: () => {
                inputKeyboardRef.current?.focus();
            },
        });
    }, []);

    return (
        <div
            style={{ width: 300 * canvasScale, height: 300 * canvasScale, position: `relative` }}
        >
            <input type='text' ref={inputKeyboardRef}
                style={{
                    width: 300 * canvasScale, height: 300 * canvasScale,
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
            <div id={id}
                style={{ width: 300 * canvasScale, height: 300 * canvasScale }} />

        </div>
    );
};
