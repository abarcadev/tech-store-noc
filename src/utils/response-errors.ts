import { Response } from "express";
import { CustomError } from "../config/custom-error";
import { StatusCodeEnum } from "../enums/status-code.enum";

export const resError = (error: unknown, res: Response) => {
    if (error instanceof CustomError)
        return res.status(error.statusCode).json({ message: error.message });
    else
        return res.status(StatusCodeEnum.InternalServer).json({ message: 'Internal server error'});
};