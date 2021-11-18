import React from 'react';
import '../blank.css';
import { GameRenderMode } from '@hodlers-quest/art/lib/src/types';
import { TokenHost } from './token-host';

export const TokenIframePage = ({ tokenId, renderMode }: { tokenId: string; renderMode?: GameRenderMode }) => {

    return (
        <div style={{ display: `flex`, width: `100%`, height: `100%`, justifyContent: `center`, alignItems: `center` }}>
            <TokenHost tokenId={tokenId}
                renderMode={renderMode}
                canvasScale={renderMode ? 2 : undefined}
                hideStyle={renderMode ? true : undefined}
            />
        </div>
    );
};
