/* eslint-disable @typescript-eslint/naming-convention */
import { getGameStepFromTokenId } from './token-id';

export const getTokenMetadataJson = ({
    tokenId,
    imageUrlRoot,
    imageUrlSuffix,
    externalUrlRoot,
    externalUrlSuffix,
}: {
    tokenId: string;
    imageUrlRoot: string;
    imageUrlSuffix: string;
    externalUrlRoot: string;
    externalUrlSuffix: string;
}) => {
    const { stepIndex, actionIndex } = getGameStepFromTokenId(tokenId);
    return {
        id: Number(tokenId),
        name: ``,
        description: ``,
        image: `${imageUrlRoot}${tokenId}${imageUrlSuffix}`,
        external_url: `${externalUrlRoot}${tokenId}${externalUrlSuffix}`,
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
