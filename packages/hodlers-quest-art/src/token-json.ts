/* eslint-disable @typescript-eslint/naming-convention */
import { getGameStepFromTokenId } from './token-id';


export type TokenMetadataUrlTemplates = {
    imageUrlRoot: string;
    imageUrlSuffix: string;
    externalUrlRoot: string;
    externalUrlSuffix: string;
    animationUrlRoot: string;
    animationUrlSuffix: string;
};
export const getTokenMetadataJson = ({
    tokenId,
    urls,
}: {
    tokenId: string;
    urls: TokenMetadataUrlTemplates;
}) => {
    const { stepIndex, actionIndex } = getGameStepFromTokenId(tokenId);
    return {
        id: Number(tokenId),
        name: ``,
        description: ``,
        image: `${urls.imageUrlRoot}${tokenId}${urls.imageUrlSuffix}`,
        external_url: `${urls.externalUrlRoot}${tokenId}${urls.externalUrlSuffix}`,
        animation_url: `${urls.animationUrlRoot}${tokenId}${urls.animationUrlSuffix}`,
        attributes: [
            {
                trait_type: `stepIndex`,
                value: stepIndex,
            },
            {
                trait_type: `actionIndex`,
                value: actionIndex,
            },
            // TODO: Other attributes
        ],
    };
};
