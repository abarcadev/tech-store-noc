type APIPayloadParams<T> = {
    url   : string;
    token : string;
    query?: T;
    id   ?: number | string;
};

type APIPayloadSave<T> = {
    url   : string;
    body  : T; 
    token?: string;
    id   ?: number | string;
};

export {
    APIPayloadParams,
    APIPayloadSave,
};