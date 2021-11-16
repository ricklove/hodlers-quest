import path from 'path';
import { createScreenshots } from './create-screenshot';

export const run = async () => {
    const PROJECT_BUCKET_SIDE = 1000000;
    const PROJECT_TOKEN_COUNT = 1000;

    const projectIds = [... new Array(4)].map((_, i) => i);
    const tokenIds = projectIds
        .flatMap(projectId => [... new Array(PROJECT_TOKEN_COUNT)]
            .map((_, i) => `${projectId * PROJECT_BUCKET_SIDE + i}`));


    try {
        await createScreenshots({
            baseUrl: `http://localhost:4201/image/`,
            tokenIds,
            destDir: path.resolve(`../../../out`),
            size: {
                width: 300,
                height: 300,
            },
        });
    } catch (err){
        console.error(err);
    }

    return;
};
// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
