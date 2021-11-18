import { GameStep } from './types';

const metadata = {
    key: `hodlers-quest`,
    name: `HODLer's Quest`,
    description: `An Interactive NFT Art Adventure Game - https://HODLersQuest.xyz`,
    author: `Rick Love`,
};

const items = [
    {
        key: `torch`,
        name: `Torch`,
        description: `This torch will be your light when all other lights go out...`,
    },
    {
        key: `torch_lit`,
        name: `Lit Torch`,
        description: `This torch it lit!`,
    },
    {
        key: `rope`,
        name: `Knife`,
        description: `That's not a knife... This is a knife!`,
    },
] as const;
type GameItemKey = typeof items[number]['key'];


/** There is only a single linear progression, all other choices end in death */
const story: GameStep<GameItemKey>[] = [
    {
        title: `HODLer's Quest`,
        art: { svgName: `arm-up` },
        description: `
        
You were just expecting an NFT... but you are surprised to find something more.

Your interest piques as you listen to the story. This is different. This is new. 

You wonder how deep the interaction goes:

What secrets are hidden in the code, in the contract? 

What kind of prize lies in wait for those who can find it?
`,
        inventory: [],
        actions: [
            {
                name: `play`,
                description: `You decide to play...`,
                result: { gameOver: false },
            },
        ],
    },
    {
        title: `Cold`,
        art: { svgName: `cold` },
        description: `

Cold, wet, afraid... you wake up shivering. 

When you open your eyes, everything is still dark.

You can't see anything, but you can feel that you are lying on a cold hard surface...`,
        glitch: {
            ratio: 0.07,
            messages: [`HELP ME!`, `Who are you?`, `What are you?`, `How are you?`, `Where are you?`, `Why are you?`, `I'm cold`, `I'm alone`, `I'm afraid`],
        },
        inventory: [],
        actions: [
            {
                name: `search the ground`,
                description: `You search the ground...`,
                result: {
                    art: { svgName: `arm-up` },
                    // art: { svgName: `search-ground` },
                    gameOver: `
As you feel around your position, you realize that there is no ground anywhere around you.

There is no way you can escape...

`,
                },
            },
            {
                name: `call for help`,
                description: `You call for help...`,
//                 result: {
//                     art: { svgName: `call-for-help` },
//                     gameOver: `
// You listen for a response, but hear nothing at first.

// Then, after a moment, you hear clicking.

// The sound grows louder as it gets near.

// Suddenly, you feel a sharp pain in your stomach. Your muscles spasm for a moment, but then you are no longer able to move...
// `,
//                 },
            },
            {
                name: `listen`,
                description: `You carefully listen without making a sound...`,
                result: { gameOver: false },
            },
        ],
    },
    {
        title: `Whispers`,
        art: { svgName: `cold` },
        description: `

In the distance, you hear the slight brookling of water flowing over stones, but nothing else at first.

Then, you hear something you did not expect, a whisper in your ear that says:

"Do not move... They will see you..."`,
        glitch: {
            ratio: 0.03,
            messages: [`HELP ME!`, `Who are you?`, `What are you?`, `How are you?`, `Where are you?`, `Why are you?`, `I'm cold`, `I'm alone`, `I'm afraid`],
        },
        inventory: [],
        actions: [
            { name: `remain still`, description: `You decide not moving is a good idea for now...` },
            { name: `move away`, description: `You jerk away from the whisper...` },
            { name: `stand up`, description: `You push yourself off the ground...` },
        ],
    },
];

export const createNftAdventure_nftTextAdventure = () => {

    return {
        metadata,
        items,
        story,
    };
};
