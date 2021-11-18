export const getGameStepFromTokenId = (tokenIdRaw: number | string) => {

        const tokenId = `${parseInt(tokenIdRaw + '', 10)}`;
        const projectId = parseInt(tokenId.substr(0, tokenId.length - 6), 10) as keyof typeof tokenProjectIdMap;
        const stepAction = tokenProjectIdMap[projectId||0];

        if (!stepAction){
            return {
                tokenId: '0',
                stepIndexInit: 0,
                actionIndexInit: 0,
            };
        }

        const [stepIndex, actionIndex] = stepAction.split(`:`).map(x => parseInt(x, 10) as undefined | number);
        // console.log(`getGameStepFromTokenId`, { stepIndexInit: stepIndex, actionIndexInit: actionIndex });
        return {
            tokenId,
            stepIndex,
            actionIndex,
        };
};

const tokenProjectIdMap = {
    0: `0:0`,
    1: `1:0`,
    2: `1:1`,
    3: `1:2`,
};
