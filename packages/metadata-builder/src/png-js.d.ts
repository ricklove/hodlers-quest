declare module 'png-js' {
    export default class PNG {
        constructor(buffer: Buffer);
        decode(callback:(pixels:Buffer)=>void):void;
    }
}