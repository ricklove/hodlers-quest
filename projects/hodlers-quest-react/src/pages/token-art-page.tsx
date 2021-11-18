import { GameRenderMode } from '@hodlers-quest/art/lib/src/types';
import { TokenHost } from './token-host';

export const TokenArtPage = ({ tokenId }: { tokenId: string }) => {

    return (
        <div style={{ display: `flex`, flexDirection: `row`, flexWrap: `wrap` }}>
            <TokenArtItem tokenId={tokenId} renderMode={`image-only`}/>
            <TokenArtItem tokenId={tokenId} renderMode={`image-title`}/>
            <TokenArtItem tokenId={tokenId} renderMode={`image-description`}/>
            <TokenArtItem tokenId={tokenId} renderMode={`image-prompt`}/>
            <TokenArtItem tokenId={tokenId} renderMode={`image-prompt-no-description`}/>
            <TokenArtItem tokenId={tokenId} renderMode={`image-action`}/>
            {/* <TokenArtItem tokenId={tokenId} renderMode={`image-action-no-description`}/> */}
            <TokenArtItem tokenId={tokenId} renderMode={`image-action-result`}/>
        </div>
    );
};

const TokenArtItem = ({ tokenId, renderMode }: { tokenId: string; renderMode: GameRenderMode }) => {

    return (
        <div style={{ margin: 4 }}>
            <div style={{ margin: 4 }}>{renderMode}</div>
            <TokenHost tokenId={tokenId} canvasScale={1} renderMode={renderMode}/>
        </div>
    );
};
