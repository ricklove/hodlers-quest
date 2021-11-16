import React, { useEffect, useRef } from 'react';
import '../blank.css';
import { gameHost } from '@hodlers-quest/art';
import p5 from 'p5';

export const TokenHost = ({ tokenId }: { tokenId: string }) => {

    const id = `art-host`;
    const inputKeyboardRef = useRef(null as null | HTMLInputElement);

    useEffect(() => {
        gameHost.renderGame({
            tokenId,
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
        <div>
            <div id={id}
                style={{ width: 300, height: 300 }} />
            <input type='text' ref={inputKeyboardRef} style={{ opacity: 0, height: 0, width: 0 }} />
        </div>
    );
};
