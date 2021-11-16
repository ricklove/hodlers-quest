/* eslint-disable @typescript-eslint/naming-convention */
import { getGameStepFromTokenId } from './token-id';

export const getTokenMetadataJson = ({
    tokenId,
    imageUrlRoot,
    externalUrlRoot,
}: {
    tokenId: string;
    imageUrlRoot: string;
    externalUrlRoot: string;
}) => {
    const { stepIndex, actionIndex } = getGameStepFromTokenId(tokenId);
    return {
        id: Number(tokenId),
        name: ``,
        description: ``,
        image: `${imageUrlRoot}${tokenId}`,
        external_url: `${externalUrlRoot}${tokenId}`,
        attributes: [
            {
                trait_type: `stepIndex`,
                value: stepIndex,
            },
            {
                trait_type: `actionIndex`,
                value: actionIndex,
            },
        ],
    };
};
