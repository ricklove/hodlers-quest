import { HslColor } from '../utils/color-format';
import { createRandomGenerator } from '../utils/random';
import { ColorRange, ColorTrait, ColorTraitRange, colorTraits, nftTextAdventureTraits, TraitName, TraitSelections, VersionDate } from './traits';

const filterVersions = <T extends { [key: string]: { version: VersionDate } }>(
    traitObject: T,
    version: VersionDate,
): Partial<T> => {
    const clone = { ...traitObject } as Partial<T>;

    Object.keys(clone).map(k => k as keyof typeof clone).forEach(k => {
        const v = clone[k];
        if (v && v.version <= version){ return; }

        // Remove if trait did not exist before version
        clone[k] = undefined;
    });

    return clone;
};

const selectTrait = <
    T extends Record<TTraitName, Record<string, { rarity?: number; version: VersionDate }>>,
    TTraitName extends TraitName,
>(
    traitContainer: T,
    traitName: TTraitName,
    version: VersionDate,
    tokenId: string,
    forcedSelections: TraitSelections,
): {
    traitKey: keyof T[TTraitName];
    trait: T[TTraitName][keyof T[TTraitName]];
    createRandomGenerator: typeof createRandomGenerator;
} => {
    const traitObjectRaw = traitContainer[traitName];
    const traitObject = filterVersions(traitObjectRaw, version);

    const options = Object.entries(traitObject)
        .filter(f => f[1])
        .map(f => ({ key: f[0] as keyof typeof traitObject, value: f[1] }));

    const forcedTraitKey = forcedSelections[traitName];
    const forcedOption = options.find(o => o.key === forcedTraitKey);

    if (forcedOption){
        return {
            traitKey: forcedTraitKey as keyof T[TTraitName],
            trait: forcedOption.value as T[TTraitName][keyof T[TTraitName]],
            createRandomGenerator: (key: string) => createRandomGenerator(`${tokenId}-${traitName}-${key}`),
        };
    }

    const totalRarity = options.reduce((out, x) => {
        out += x.value?.rarity ?? 0;
        return out;
    }, 0);

    const countNonRarity = options.filter(x => x.value.rarity == null).length;
    const totalScore = 100;
    const rarityForNonRare = !countNonRarity ? 0 : (totalScore - totalRarity) / countNonRarity;

    const optionsByRarity = options.sort((a, b) =>
        (a.value.rarity ?? rarityForNonRare)
        - (b.value.rarity ?? rarityForNonRare));


    const { random } = createRandomGenerator(`${tokenId}-${traitName}`);
    const randomScore = random() * totalScore;
    // const randomScore = totalScore - 1;


    let scoreSoFar = 0;
    let itemAtScore = optionsByRarity[0];
    optionsByRarity.forEach(x => {
        if (scoreSoFar > randomScore){ return; }
        scoreSoFar += x.value.rarity ?? rarityForNonRare;
        itemAtScore = x;
    });

    // console.log(`options_byRarity`, { randomScore, scoreSoFar, itemAtScore, options_byRarity, countNonRarity, rarityForNonRare });

    // Use override (but still go through random)
    const traitKey = itemAtScore.key;
    return {
        traitKey: traitKey as keyof T[TTraitName],
        trait: itemAtScore.value as T[TTraitName][keyof T[TTraitName]],
        createRandomGenerator: (key: string) => createRandomGenerator(`${tokenId}-${traitName}-${key}`),
    };
};

export const selectTraits = (tokenId: string, version: VersionDate) => {
    const { traits, themes, effects } = nftTextAdventureTraits;

    const theme = selectTrait({ theme: themes }, `theme`, version, tokenId, {});
    const forcedSelections = theme.trait.selections;

    // console.log(`selectTraits`, { theme, forcedSelections });

    const selectedTraits = {
        theme,
        effect: selectTrait({ effect: effects }, `effect`, version, tokenId, forcedSelections),
        humanoid: selectTrait(traits, `humanoid`, version, tokenId, forcedSelections),
        hair: selectTrait(traits, `hair`, version, tokenId, forcedSelections),
        facehair: selectTrait(traits, `facehair`, version, tokenId, forcedSelections),
        weapon: selectTrait(traits, `weapon`, version, tokenId, forcedSelections),
        clothes: selectTrait(traits, `clothes`, version, tokenId, forcedSelections),
        headwear: selectTrait(traits, `headwear`, version, tokenId, forcedSelections),
    };

    const selectedColors = selectColors(tokenId, selectedTraits.humanoid.trait.colors);

    return {
        tokenId,
        version,
        selectedTraits,
        selectedColors,
    };
};


export const selectColorInRange = (range: ColorRange, tokenId: string, key: string) => {
    const { random } = createRandomGenerator(`${tokenId}-colors-${key}`);

    const randomIntInRangeInclusive = (range: readonly [number, number]) =>
        Math.max(range[0], Math.min(range[1], Math.floor(range[0] + (range[1] - range[0] + 1) * random())));

    const hsl = {
        h: randomIntInRangeInclusive(range.h),
        s: randomIntInRangeInclusive(range.s),
        l: randomIntInRangeInclusive(range.l),
    };
    return { hsl };
};

export const selectColors = (
    tokenId: string,
    colorRanges: readonly ColorTraitRange[],
): { [colorTrait in ColorTrait]: HslColor } => {
    const selections = colorTraits.map(c => {

        const range = colorRanges.find(r => r.targets.some(t => t === c)) ?? colorRanges[ colorRanges.length - 1 ];
        const { hsl } = selectColorInRange(range, tokenId, c);

        return ({
            colorTrait: c,
            color: hsl,
        });
    });

    const obj = {} as { [colorTrait in ColorTrait]: HslColor };
    selections.forEach(s => {
        obj[s.colorTrait] = s.color;
    });
    return obj;
};
