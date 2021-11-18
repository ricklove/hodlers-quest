export const getGameStepFromTokenId = (tokenId: string) => {

        const projectId = parseInt(tokenId.substr(0, tokenId.length - 6), 10) as keyof typeof tokenProjectIdMap;
        const stepAction = tokenProjectIdMap[projectId];

        if (!stepAction){
            return {
                stepIndexInit: 0,
                actionIndexInit: 0,
            };
        }

        const [stepIndex, actionIndex] = stepAction.split(`:`).map(x => parseInt(x, 10) as undefined | number);
        // console.log(`getGameStepFromTokenId`, { stepIndexInit: stepIndex, actionIndexInit: actionIndex });
        return {
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
