import React from 'react';
import '../blank.css';
import { TokenHost } from './token-host';

export const TokenIframePage = ({ tokenId }: { tokenId: string }) => {

    return (
        <div style={{ display: `flex`, width: `100%`, height: `100%`, justifyContent: `center`, alignItems: `center` }}>
            <TokenHost tokenId={tokenId}/>
        </div>
    );
};
