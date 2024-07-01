import { IUser } from "./API/endpoints/type";

export interface IAuthStorage {
    accessToken: string;
    refreshToken: string;
    expiryTimestamp: number;
}
