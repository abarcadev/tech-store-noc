import { StatusCodeEnum } from "../enums/status-code.enum";

export class CustomError extends Error {

    constructor(
        public readonly statusCode: number,
        public readonly message: string
    ) {
        super(message);
    }

    static badRequest(message: string) {
        return new CustomError(StatusCodeEnum.BadRequest, message);
    }

    static unauthorized(message: string) {
        return new CustomError(StatusCodeEnum.Unauthorized, message);
    }

    static notFound(message: string) {
        return new CustomError(StatusCodeEnum.NotFound, message);
    }

    static internalServer(message: string) {
        return new CustomError(StatusCodeEnum.InternalServer, message);
    }

}