import { GlobalArtControllerWindow } from '@hodlers-quest/common';
import { promises as fs } from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

declare const window: GlobalArtControllerWindow;

export const createTokenImages = async ({
  baseUrl,
  tokenIds,
  destDir,
  size,
}: {
  baseUrl: string;
  tokenIds: string[];
  destDir: string;
  size: { width: number; height: number };
}) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`${baseUrl}`);
  await page.setViewport(size);

  const destPath = path.resolve(destDir);
  await fs.mkdir(destPath, { recursive: true });

  const filePaths = [] as string[];

  for (const tokenId of tokenIds) {
    const evaluateArgs = {
      tokenId,
    };
    await page.evaluate(({ tokenId }: typeof evaluateArgs) => {
      const c = window.globalArtController;
      if (!c) {
        return;
      }
      return c.loadTokenImage(tokenId, 'image-only');
    }, evaluateArgs);

    const filePath = path.join(destPath, `${Number(tokenId)}.png`);
    filePaths.push(filePath);
    await page.screenshot({
      path: filePath,
      type: `png`,
    });

    console.log(`## createTokenImages - created`, { filePath });
  }

  await browser.close();

  return { filePaths };
};
