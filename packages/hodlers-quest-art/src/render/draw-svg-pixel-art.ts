import type p5 from 'p5';
import { js2xml, xml2js } from 'xml-js';
import { colorFormat } from '../utils/color-format';
import { createRandomGenerator } from '../utils/random';
import { RgbHex, SvgDoc } from './inkscape-svg-types';
import { transformSvgWithTraits } from './transform-svg-with-traits';

const loadSvgIntoImage = async (svgContent: string) => {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
        const svgDataUrl = window.URL.createObjectURL(new Blob([svgContent], { type: `image/svg+xml` }));
        const svgImage = new Image();
        svgImage.onload = function() {
            resolve(svgImage);
        };
        svgImage.onerror = reject;
        svgImage.src = svgDataUrl;
    });
};

const PIXEL_SIZE = 32;
const BUFFER_SCALE = 7;

export const renderSvgPixelArt = async (svgContent: string, tokenId: string, buffer: HTMLCanvasElement, destination: HTMLCanvasElement, scale: number) => {
    console.log(`# renderSvgPixelArt`, {});

    const OUT_SCALE = scale;

    const K_H_RANGE = 4 / 256 * 360;
    const K_S_RANGE = 4 / 256 * 100;
    const K_L_RANGE = 16 / 256 * 100;
    const JITTER = 16;
    const { random } = createRandomGenerator(`${tokenId}-pixel-jitter`);

    buffer.width = PIXEL_SIZE * BUFFER_SCALE;
    buffer.height = PIXEL_SIZE * BUFFER_SCALE;
    const ctxBuffer = buffer.getContext(`2d`);
    if (!ctxBuffer){ return; }

    const svgBufferImage = await loadSvgIntoImage(svgContent);
    if (!svgBufferImage){ return; }

    ctxBuffer.drawImage(svgBufferImage, 0, 0, buffer.width, buffer.height);

    // .resize(SIZE, SIZE, { kernel: `nearest`, withoutEnlargement: true })
    // .png({ dither: 0 })
    // .toFile(`${x}.png`);

    destination.width = PIXEL_SIZE * OUT_SCALE;
    destination.height = PIXEL_SIZE * OUT_SCALE;
    const ctxDest = destination.getContext(`2d`);
    if (!ctxDest){return;}
    ctxDest.imageSmoothingEnabled = false;

    const imageDataSource = ctxBuffer.getImageData(0, 0, PIXEL_SIZE * BUFFER_SCALE, PIXEL_SIZE * BUFFER_SCALE);
    const imageDataDest = ctxDest.getImageData(0, 0, PIXEL_SIZE * OUT_SCALE, PIXEL_SIZE * OUT_SCALE);

    // Pixelize data
    for (let i = 0; i < imageDataSource.width / BUFFER_SCALE; i++){
        for (let j = 0; j < imageDataSource.height / BUFFER_SCALE; j++){

            type RGB = { r: number; g: number; b: number; a?: number };
            const getColorKey = (rgb: RGB) => {
                return colorFormat.rgbToRgbHex(rgb);
            };
            const getColorFromColorKey = (rgbKey: RgbHex): RGB => {
                return colorFormat.rgbHexToRgb(rgbKey);
            };

            const getColorKeyQuantized = ({ r, g, b }: RGB) => {
                const hslRaw = colorFormat.rgbToHsl({ r, g, b });
                const hsl = {
                    h: Math.round(hslRaw.h / K_H_RANGE) * K_H_RANGE,
                    s: Math.round(hslRaw.s / K_S_RANGE) * K_S_RANGE,
                    l: Math.round(hslRaw.l / K_L_RANGE) * K_L_RANGE,
                };
                const rgb = colorFormat.hslToRgb(hsl);

                return getColorKey(rgb);
            };

            const kMeansPixels = new Map<RgbHex, RGB[]>();
            let alphaPixelCount = 0;
            let nonAlphaPixelCount = 0;

            const totalPixelValue = {
                r: 0,
                g: 0,
                b: 0,
                a: 0,
            };

            const iCenter = (
                (i * BUFFER_SCALE + Math.floor(BUFFER_SCALE / 2))
                + (j * BUFFER_SCALE + Math.floor(BUFFER_SCALE / 2))
                * imageDataSource.width) * 4;
            const centerPixelValue = {
                r: imageDataSource.data[iCenter + 0],
                g: imageDataSource.data[iCenter + 1],
                b: imageDataSource.data[iCenter + 2],
                a: imageDataSource.data[iCenter + 3],
            };

            for (let i2 = 0; i2 < BUFFER_SCALE; i2++){
                for (let j2 = 0; j2 < BUFFER_SCALE; j2++){
                    const iPixel = i * BUFFER_SCALE + i2;
                    const jPixel = j * BUFFER_SCALE + j2;
                    const iData = (iPixel + jPixel * imageDataSource.width) * 4;
                    const r = imageDataSource.data[iData + 0];
                    const g = imageDataSource.data[iData + 1];
                    const b = imageDataSource.data[iData + 2];
                    const a = imageDataSource.data[iData + 3];

                    // totalPixelValue.r += r;
                    // totalPixelValue.g += g;
                    // totalPixelValue.b += b;
                    // totalPixelValue.a += a;


                    // Alpha threshold
                    if (a < 128){
                        imageDataSource.data[iData + 3] = 0;
                        alphaPixelCount++;
                    } else {
                        imageDataSource.data[iData + 3] = 255;
                        nonAlphaPixelCount++;

                        // Posterize channels

                        const key = getColorKeyQuantized({ r, g, b });
                        if (!kMeansPixels.has(key)){
                            kMeansPixels.set(key, []);
                        }
                        kMeansPixels.get(key)?.push({ r, g, b });

                        totalPixelValue.r += r;
                        totalPixelValue.g += g;
                        totalPixelValue.b += b;
                        totalPixelValue.a += 255;
                    }
                }
            }

            // Average pixel value
            // // const totalPixelValue = [...pixelCounts.entries()].reduce((out, p) => {
            // //     out.r += p[1] * (p[0] >> 16) % 256;
            // //     out.g += p[1] * (p[0] >> 8) % 256;
            // //     out.b += p[1] * (p[0] >> 0) % 256;
            // //     out.a += p[1] * (p[0] > 0 ? 255 : 0);
            // //     return out;
            // // }, { r: 0, g: 0, b: 0, a: 0 });
            const avePixelValue = {
                r: Math.floor(totalPixelValue.r / (BUFFER_SCALE * BUFFER_SCALE)),
                g: Math.floor(totalPixelValue.g / (BUFFER_SCALE * BUFFER_SCALE)),
                b: Math.floor(totalPixelValue.b / (BUFFER_SCALE * BUFFER_SCALE)),
                a: Math.floor(totalPixelValue.a / (BUFFER_SCALE * BUFFER_SCALE)),
            };
            // // const iDestData = (i + j * imageData2.width) * 4;
            // // imageData2.data[iDestData + 0] = avePixelValue.r;
            // // imageData2.data[iDestData + 1] = avePixelValue.g;
            // // imageData2.data[iDestData + 2] = avePixelValue.b;
            // // imageData2.data[iDestData + 3] = avePixelValue.a > 128 ? 255 : 0;

            // // Center pixel value
            // const iDestData = (i + j * imageData2.width) * 4;
            // imageData2.data[iDestData + 0] = centerPixelValue.r;
            // imageData2.data[iDestData + 1] = centerPixelValue.g;
            // imageData2.data[iDestData + 2] = centerPixelValue.b;
            // imageData2.data[iDestData + 3] = centerPixelValue.a > 128 ? 255 : 0;

            // Most common pixel value

            // Alpha should be scored against all other colors
            const mostPixel = [...kMeansPixels.entries()].sort((a, b) => -(a[1].length - b[1].length))[0];
            const isAlpha = alphaPixelCount > nonAlphaPixelCount;

            // if (!isAlpha && i % 4 === 0 && j % 4 === 0){
            //     console.log(`renderSvgPixelArt sample`, {
            //         pixelCounts: kMeansPixels,
            //         isAlpha,
            //         mostPixel,
            //         centerPixelValueHex: getColorKey(centerPixelValue),
            //         avePixelValueHex: getColorKey(avePixelValue),
            //         centerPixelValue,
            //         avePixelValue,
            //     });
            // }

            const getOutputColor = () => {

                const kValue = getColorFromColorKey(mostPixel[0]);
                // imageData2.data[iDestData + 0] = kValue.r;
                // imageData2.data[iDestData + 1] = kValue.g;
                // imageData2.data[iDestData + 2] = kValue.b;
                // imageData2.data[iDestData + 3] = 255;

                const valuesSorted = mostPixel[1].map(x => ({
                    x,
                    order: 0
                        + x.r - kValue.r
                        + x.g - kValue.g
                        + x.b - kValue.b
                    ,
                })).sort((a, b) => a.order - b.order);
                const midValue = valuesSorted[Math.floor(mostPixel[1].length / 2)].x;

                // Add Random Additive Jitter
                // const pOutput = {
                //     r: Math.max(0, Math.min(255, Math.floor(midValue.r + JITTER * (0.5 - random())))),
                //     g: Math.max(0, Math.min(255, Math.floor(midValue.g + JITTER * (0.5 - random())))),
                //     b: Math.max(0, Math.min(255, Math.floor(midValue.b + JITTER * (0.5 - random())))),
                // };
                // Add Random Mult Jitter (Brightness)
                const jitterMult = (1 + (JITTER * 1.0 / 256) * (0.5 - random()));
                return {
                    r: Math.max(0, Math.min(255, Math.floor(midValue.r * jitterMult))),
                    g: Math.max(0, Math.min(255, Math.floor(midValue.g * jitterMult))),
                    b: Math.max(0, Math.min(255, Math.floor(midValue.b * jitterMult))),
                };
            };

            const pOutput = isAlpha ? { r: 0, g: 0, b: 0, a: 0 }
                : { ...getOutputColor(), a: 255 };

            for (let i2 = 0; i2 < OUT_SCALE; i2++){
                for (let j2 = 0; j2 < OUT_SCALE; j2++){
                    const iPixel = i * OUT_SCALE + i2;
                    const jPixel = j * OUT_SCALE + j2;
                    const iData = (iPixel + jPixel * imageDataDest.width) * 4;

                    imageDataDest.data[iData + 0] = pOutput.r;
                    imageDataDest.data[iData + 1] = pOutput.g;
                    imageDataDest.data[iData + 2] = pOutput.b;
                    imageDataDest.data[iData + 3] = pOutput.a;
                }
            }

            // // // TEST
            // // imageData2.data[iDestData + 0] = 255;
            // // imageData2.data[iDestData + 1] = 0;
            // // imageData2.data[iDestData + 2] = 0;
            // // imageData2.data[iDestData + 3] = 255;
        }
    }

    ctxDest.putImageData(imageDataDest, 0, 0);
};

export const drawSvgPixelArtWithTraits = async (svgContent: string, tokenId: string, buffer: HTMLCanvasElement, destination: HTMLCanvasElement, scale: number) => {
    console.log(`## drawSvgPixelArtWithTraits - Transforming svg`, { svgContent, tokenId });

    const svgDoc = xml2js(svgContent, { compact: false }) as SvgDoc;
    const result = transformSvgWithTraits(svgDoc, tokenId);
    if (!result){ return; }

    const svgTransformed = js2xml(svgDoc, { spaces: 2, indentAttributes: true });
    await renderSvgPixelArt(svgTransformed, tokenId, buffer, destination, scale);

    console.log(`## drawSvgPixelArtWithTraits - Done`, { svgContent, tokenId });
};

export const loadSvgPixelArtFromUrl = (p5: p5, svgUrl: string, tokenId: string, size: { width: number; height: number }) => {
    const scale = Math.floor(Math.min(size.width / PIXEL_SIZE, size.height / PIXEL_SIZE));

    let isLoaded = false;

    const buffer = document.createElement(`canvas`);
    const destination = document.createElement(`canvas`);
    const image = p5.createGraphics(PIXEL_SIZE * scale, PIXEL_SIZE * scale);
    image.setup = () => {image.noLoop();};

    const load = async () => {
        try {
            console.log(`## loadSvgPixelArtFromUrl - loading`, { destination });

            const svgContent = await (await fetch(svgUrl)).text();
            await drawSvgPixelArtWithTraits(svgContent, tokenId, buffer, destination, scale);

            const ctx = image.drawingContext as CanvasRenderingContext2D;
            ctx.drawImage(destination, 0, 0);

            isLoaded = true;
            console.log(`## loadSvgPixelArtFromUrl - loaded`, { destination, image });
        } catch (err){
            console.log(`## loadSvgPixelArtFromUrl - ERROR`, { err });
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
        load();

    // let image: HTMLCanvasElement = document.createCa;
    return {
        getIsLoaded: () => isLoaded,
        image,
    };
};
