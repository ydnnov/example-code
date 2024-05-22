import { MsudrfSudDeloParser } from './msudrf-sud-delo.parser.js';
import { TerritorialnayaPodsudnostParser } from './territorialnaya-podsudnost.parser.js';

export const parsers = {
    msudrfSudDelo: new MsudrfSudDeloParser(),
    territorialnayaPodsudnost: new TerritorialnayaPodsudnostParser(),
};
