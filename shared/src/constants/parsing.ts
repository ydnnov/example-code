export const PARSER_KEY = {
    MSUDRF_SUD_DELO: 'msudrf/sudebnoye-deloproizvodstvo',
    MSUDRF_TERR_PODS: 'msudrf/territorialnaya-podsudnost',
    FSSP_SEFIZLICO: 'fssp/search-ext-fizicheskoe-lico',
};

export const PARSER_INDEX_BY_KEY = {
    [PARSER_KEY.MSUDRF_SUD_DELO]: 1,
    [PARSER_KEY.MSUDRF_TERR_PODS]: 2,
    [PARSER_KEY.FSSP_SEFIZLICO]: 3,
};

export const PARSER_KEY_BY_INDEX = {
    1: PARSER_KEY.MSUDRF_SUD_DELO,
    2: PARSER_KEY.MSUDRF_TERR_PODS,
    3: PARSER_KEY.FSSP_SEFIZLICO,
};
