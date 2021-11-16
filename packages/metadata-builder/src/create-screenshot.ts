import { GlobalArtControllerWindow } from '@hodlers-quest/common';
import { promises as fs } from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

declare const window: GlobalArtControllerWindow;

export const createScreenshots = async ({
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
      return c.loadTokenId(tokenId);
    }, evaluateArgs);

    const filePath = path.join(destPath, `${tokenId}.png`.padStart(10, `0`));
    filePaths.push(filePath);
    await page.screenshot({
      path: filePath,
      type: `png`,
    });
  }

  await browser.close();

  return { filePaths };
};
