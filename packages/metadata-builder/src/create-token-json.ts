import { promises as fs } from 'fs';
import path from 'path';

export const createTokenJson = async ({
  tokenIds,
  destDir,
}: {
  tokenIds: string[];
  destDir: string;
}) => {

  const destPath = path.resolve(destDir);
  await fs.mkdir(destPath, { recursive: true });

  const filePaths = [] as string[];

  for (const tokenId of tokenIds) {
    const tokenJson = ``;

    const filePath = path.join(destPath, `${Number(tokenId)}.png`);
    filePaths.push(filePath);

    await fs.writeFile(filePath, tokenJson);
  }

  return { filePaths };
};
