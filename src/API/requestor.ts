import axios, { AxiosInstance } from "axios";
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
                "User-Agent": this.USER_AGENT,
                "Accept-Language": this.acceptedLanguage,
            },
        });
    }
    public async get<T extends {}>(
        endpoint: string,
        params?: any
    ): Promise<T | IError> {
        return this.axios.get(endpoint, { params });
    }
    public async post<T extends {}>(
        endpoint: string,
        data?: any
    ): Promise<T | IError> {
        return this.axios.post(endpoint, { data });
    }
    public async auth(data?: any): Promise<IOauthToken> {
        return this.axios.post(this.AUTH_URL, { data });
    }
}
