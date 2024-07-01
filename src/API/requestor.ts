import axios, { AxiosInstance, toFormData } from "axios";
import { IError, IOauthToken, TAcceptedLanguages } from "./endpoints/type";

export class Requestor {
    public readonly AUTH_URL = "https://oauth.secure.pixiv.net/auth/token";
    public readonly API_BASE_URL = "https://app-api.pixiv.net";

    public readonly CLIENT_ID = "MOBrBDS8blbauoSck0ZfDbtuzpyT";
    public readonly CLIENT_SECRET = "lsACyCD94FhDUtGTXi3QzcFE2uU1hqtDaKeqrdwj";

    protected readonly USER_AGENT =
        "PixivAndroidApp/5.0.234 (Android 11; Pixel 5)";

    protected _acceptedLanguage: TAcceptedLanguages = "en-us";
    public get acceptedLanguage() {
        return this._acceptedLanguage;
    }
    protected set aceeptedLanguage(payload: TAcceptedLanguages) {
        this._acceptedLanguage = payload;
    }

    protected readonly axios: AxiosInstance;

    private _accessToken: string = "";
    public set accessToken(token: string) {
        this._accessToken = token;
        this.axios.defaults.headers["Authorization"] = `Bearer ${token}`;
    }
    public get accessToken() {
        return this._accessToken;
    }

    constructor() {
        this.axios = axios.create({
            baseURL: this.API_BASE_URL,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": this.USER_AGENT,
                "Accept-Language": this.acceptedLanguage,
            },
        });
    }
    public async get<T extends {}>(
        endpoint: string,
        params?: any
    ): Promise<T | IError> {
        return await this.axios
            .get(endpoint, { params })
            .then((res) => res.data)
            .catch((e) => e.response.data);
    }
    public async post<T extends {}>(
        endpoint: string,
        data?: any
    ): Promise<T | IError> {
        return await this.axios
            .post(endpoint, data)
            .then((res) => res.data)
            .catch((e) => e.response.data);
    }
    public async auth(data?: any): Promise<IOauthToken | IError> {
        return await this.axios
            .post(this.AUTH_URL, data)
            .then((res) => res.data)
            .catch((e) => e.response.data);
    }
}
