import { GameRenderMode, GlobalArtControllerWindow } from '@hodlers-quest/common';
import fsRaw, { promises as fs } from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import GIFEncoder from 'gifencoder';
import PNG from 'png-js';

declare const window: GlobalArtControllerWindow;

export const createTokenGifs = async ({
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
  
    //const encoder = new GIFEncoder(size.width, size.height, 'octree', true);
    const encoder = new GIFEncoder(size.width, size.height);

    encoder.start();
    // 0 - repeat
    encoder.setRepeat(0);
    encoder.setQuality(10);

    const addFrame = async(renderMode: GameRenderMode, stepIndex?:number, actionIndex?:number)=>{
      const evaluateArgs = {
        tokenId,
        renderMode,
        stepIndex: stepIndex ?? null,
        actionIndex: actionIndex ?? null,
      };
      await page.evaluate(({ tokenId, renderMode, stepIndex, actionIndex }: typeof evaluateArgs) => {
        const c = window.globalArtController;
        if (!c) {
          return;
        }
        return c.loadTokenImage(tokenId, renderMode, stepIndex??undefined, actionIndex??undefined);
      }, evaluateArgs);

      const pngBuffer = await page.screenshot({encoding:'binary'}) as Buffer;
      const png = new PNG(pngBuffer);
      const pngPixels = await new Promise<Buffer>((resolve)=>{
        png.decode(resolve);
      });
      encoder.addFrame(pngPixels);
      // console.log('addFrame DONE', {pngPixels});
    };

    encoder.setDelay(1000);
    await addFrame('image-title');
    encoder.setDelay(5000);
    await addFrame('image-description');
    encoder.setDelay(1000);
    await addFrame('image-prompt');
    encoder.setDelay(3000);
    await addFrame('image-action');
    encoder.setDelay(3000);
    await addFrame('image-action-result');
    encoder.setDelay(2000);
    await addFrame('image-title', 0, 0);

    encoder.finish();

    const filePath = path.join(destPath, `${Number(tokenId)}.gif`);
    filePaths.push(filePath);
    await fs.writeFile(filePath, encoder.out.getData());
    console.log(`## createTokenImages - created`, { filePath });
  }

  await browser.close();

  return { filePaths };
};
