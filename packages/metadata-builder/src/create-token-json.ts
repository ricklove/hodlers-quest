import { getTokenMetadataJson } from '@hodlers-quest/art';
import { promises as fs } from 'fs';
import path from 'path';

export const createTokenJson = async ({
  tokenIds,
  destDir,
  imageUrlRoot,
  imageUrlSuffix,
  externalUrlRoot,
  externalUrlSuffix,
}: {
  tokenIds: string[];
  destDir: string;
  imageUrlRoot: string;
  imageUrlSuffix: string;
  externalUrlRoot: string;
  externalUrlSuffix: string;
}) => {

  const destPath = path.resolve(destDir);
  await fs.mkdir(destPath, { recursive: true });

  const filePaths = [] as string[];

  for (const tokenId of tokenIds) {
    const tokenJson = JSON.stringify(getTokenMetadataJson({
      tokenId,
      imageUrlRoot,
      imageUrlSuffix,
      externalUrlRoot,
      externalUrlSuffix,
    }));

    const filePath = path.join(destPath, `${Number(tokenId)}.json`);
    filePaths.push(filePath);

    await fs.writeFile(filePath, tokenJson);
  }

  return { filePaths };
};
