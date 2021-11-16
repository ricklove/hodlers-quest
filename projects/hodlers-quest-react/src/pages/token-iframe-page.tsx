import React from 'react';
import '../blank.css';
import { TokenHost } from './token-host';

export const TokenIframePage = ({ tokenId }: { tokenId: string }) => {

    return (
        <div style={{ display: `flex`, width: `100vw`, height: `100vh`, justifyContent: `center`, alignItems: `center` }}>
            <TokenHost tokenId={tokenId}/>
        </div>
    );
};
