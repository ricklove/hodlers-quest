import { useEffect } from 'react';
import { gameHost } from '@hodlers-quest/art';
import p5 from 'p5';

export const TokenPage = ({ tokenId }: { tokenId: string }) => {

    const id = `art-host`;

    useEffect(() => {
        gameHost.renderGame(tokenId, (callback) => {
            const element = document.getElementById(id) as HTMLElement;
            const result = new p5(callback, element);

            // TODO: Unsub
        });
    }, []);


    return (
        <div
            style={{ display: `flex`, flexDirection: `column`, justifyContent: `space-between`, alignItems: `center`, minHeight: `calc(100vh - 100px)` }}>

            <div>
                Token: {tokenId}
            </div>

            <div id={id} style={{ width: `100%` }}>
            {/* <NftProjectsLoader/> */}
            </div>

            <div style={{ flex: 1 }} />
        </div>
    );
};
