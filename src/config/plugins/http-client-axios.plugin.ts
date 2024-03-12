import axios from "axios";
import { APIPayloadSave, APIPayloadParams } from "../../interfaces/tech-store";

const login = async <B, R>(payload: APIPayloadSave<B>): Promise<R> => {
    const { url, body } = payload;

    const { data } = await axios.post<R>(url, body);
    return data;
};

const getAll = async <B, R>(payload: APIPayloadParams<B>): Promise<R> => {
    const { 
        url,
        token, 
        query 
    } = payload;

    const { data } = await axios.get<R>(
        url,
        {
            headers: { Authorization: `Bearer ${ token }` },
            params : { ...query }
        }
    );

    return data;
}

const getById = async <B, R>(payload: APIPayloadParams<B>): Promise<R> => {
    const {
        url,
        token,
        id
    } = payload;

    const { data } = await axios.get<R>(
        `${ url }/${ id }`,
        {
            headers: { Authorization: `Bearer ${ token }` }
        }
    );

    return data;
}

const patch = async <B, R>(payload: APIPayloadSave<B>): Promise<R> => {
    const {
        url,
        token,
        id,
        body
    } = payload;

    const { data } = await axios.patch<R>(
        `${ url}/${ id }`,
        body,
        {
            headers: { Authorization: `Bearer ${ token }` }
        }
    );

    return data;
}

export const httpClientAdapter = {
    login,
    getAll,
    getById,
    patch
};