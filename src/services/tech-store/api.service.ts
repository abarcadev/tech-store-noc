import { httpClientAdapter } from "../../config/plugins";
import { APIPayloadParams, APIPayloadSave } from "../../interfaces/tech-store";

export class ApiService {

    static async login<B, R>(payload: APIPayloadSave<B>) {
        return httpClientAdapter.login<B, R>(payload);
    }

    static async getAll<B, R>(payload: APIPayloadParams<B>) {
        return httpClientAdapter.getAll<B, R>(payload);
    }

    static async getById<B, R>(payload: APIPayloadParams<B>) {
        return httpClientAdapter.getById<B, R>(payload);
    }

    static async patch<B, R>(payload: APIPayloadSave<B>) {
        return httpClientAdapter.patch<B, R>(payload);
    }

}