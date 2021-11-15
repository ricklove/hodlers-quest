import React, { useEffect } from 'react';
import '../blank.css';
import { gameHost } from '@hodlers-quest/art';
import p5 from 'p5';

export const TokenIframePage = ({ tokenId }: { tokenId: string }) => {

    const id = `art-host`;

    useEffect(() => {
        gameHost.renderGame(tokenId, (callback) => {
            const element = document.getElementById(id) as HTMLElement;
            const result = new p5(callback, element);

            // TODO: Unsub
        });
    }, []);


    return (
        <div style={{ display: `flex`, width: `100vw`, height: `100vh`, justifyContent: `center`, alignItems: `center` }}>
            <div id={id}
                style={{ width: 300, height: 300 }} />
        </div>
    );
};
