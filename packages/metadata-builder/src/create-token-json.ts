import { getTokenMetadataJson, TokenMetadataUrlTemplates } from '@hodlers-quest/art';
import { promises as fs } from 'fs';
import path from 'path';

export const createTokenJson = async ({
  tokenIds,
  destDir,
  urls,
}: {
  tokenIds: string[];
  destDir: string;
  urls: TokenMetadataUrlTemplates;
}) => {

  const destPath = path.resolve(destDir);
  await fs.mkdir(destPath, { recursive: true });

  const filePaths = [] as string[];

  for (const tokenId of tokenIds) {
    const tokenJson = JSON.stringify(getTokenMetadataJson({
      tokenId,
      urls,
    }));

    const filePath = path.join(destPath, `${Number(tokenId)}.json`);
    filePaths.push(filePath);

    await fs.writeFile(filePath, tokenJson);
  }

  return { filePaths };
};
