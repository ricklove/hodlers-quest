import { TokenHost } from './token-host';

export const TokenPage = ({ tokenId }: { tokenId: string }) => {

    return (
        <div
            style={{ display: `flex`, flexDirection: `column`, justifyContent: `flex-start`, alignItems: `center`, minHeight: `calc(100vh - 100px)` }}>

            <div>
                Token: {tokenId}
            </div>
            <TokenHost tokenId={tokenId}/>
        </div>
    );
};
