import { promises as fs } from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

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
  await page.setViewport(size);

  const destPath = path.resolve(destDir);
  await fs.mkdir(destPath, { recursive: true });

  const filePaths = [] as string[];

  for (const tokenId of tokenIds) {
    await page.goto(`${baseUrl}${tokenId}`);

    const filePath = path.join(destPath, `${tokenId}.png`.padStart(10, `0`));
    filePaths.push(filePath);
    await page.screenshot({ path: filePath });
  }

  await browser.close();

  return { filePaths };
};
