interface ResponseGetParamByNameI {
    name        : string;
    textValue   : string | null;
    numericValue: string | null;
}

interface ParamBodyI {
    textValue   : string | null;
    numericValue: string | null;
}

export {
    ResponseGetParamByNameI,
    ParamBodyI,
};