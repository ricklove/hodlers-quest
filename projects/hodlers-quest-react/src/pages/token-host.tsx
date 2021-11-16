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
        <div
            style={{ width: 300, height: 300, position: `relative` }}
        >
            <input type='text' ref={inputKeyboardRef}
                style={{
                    width: 300, height: 300,
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
                style={{ width: 300, height: 300 }} />

        </div>
    );
};
