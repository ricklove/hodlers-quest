import path from 'path';
import { createTokenGifs } from './create-token-gif';
import { createTokenImages } from './create-token-image';
import { createTokenJson } from './create-token-json';

export const run = async () => {
    const PROJECT_BUCKET_SIDE = 1000000;
    const PROJECT_ID_MAX = 3;
    const PROJECT_TOKEN_COUNT = 10;

    const THREADS = 10;

    const projectIds = [... new Array(PROJECT_ID_MAX + 1)].map((_, i) => i);
    const tokenIdsAll = projectIds
        .flatMap(projectId => [... new Array(PROJECT_TOKEN_COUNT)]
            .map((_, i) => `${projectId * PROJECT_BUCKET_SIDE + i}`));

    try {

        const tokenIdsSlices = [...new Array(THREADS)].map(() => [] as typeof tokenIdsAll);
        tokenIdsAll.forEach((t, i) => {
            tokenIdsSlices[i % THREADS].push(t);
        });

        await Promise.all(tokenIdsSlices.map(async tokenIdsSlice => {
            await createTokenGifs({
                baseUrl: `http://localhost:4201/image/0`,
                tokenIds: tokenIdsSlice,
                destDir: path.resolve(`./out/nft/images`),
                size: {
                    width: 320,
                    height: 320,
                },
            });

            // await createTokenImages({
            //     baseUrl: `http://localhost:4201/image/0`,
            //     tokenIds: tokenIdsSlice,
            //     destDir: path.resolve(`./out/nft/images`),
            //     size: {
            //         width: 600,
            //         height: 600,
            //     },
            // });

            await createTokenJson({
                tokenIds: tokenIdsSlice,
                destDir: path.resolve(`./out/nft/metadata`),
                urls:{
                    imageUrlRoot: `https://hodlersquest.xyz/_metadata/nft/images/`,
                    imageUrlSuffix: `.gif`,
                    externalUrlRoot: `https://hodlersquest.xyz/nft/`,
                    externalUrlSuffix: ``,
                    animationUrlRoot: `https://hodlersquest.xyz/iframe/`,
                    animationUrlSuffix: ``,
                },
            });
        }));

    } catch (err){
        console.error(err);
    }

    return;
};
// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
