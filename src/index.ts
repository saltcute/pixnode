import { API } from "./API";
import Logger from "bunyan";
import schedue from "node-schedule";

export default class PixNode {
    private getLogger(...name: string[]) {
        return new Logger({
            name: `${["pixnode", ...name].join(".")}`,
            streams: [
                {
                    stream: process.stdout,
                    level: Logger.INFO,
                },
                {
                    stream: process.stderr,
                    level: Logger.ERROR,
                },
            ],
        });
    }

    public readonly logger = this.getLogger();

    public readonly API = new API();

    private accessTokenExpiryTimestamp = -1;

    private refreshScheduler?: schedue.Job;

    private accessToken?: string;
    private refreshToken?: string;

    private setAccessToken(accessToken: string, expiryTime: number) {
        this.accessToken = accessToken;
        this.accessTokenExpiryTimestamp = expiryTime;
        this.API.requestor.accessToken = accessToken;
    }

    private async setRefreshToken(refreshToken: string) {
        this.refreshToken = refreshToken;
        return this.refreshLogin();
    }

    private constructor() {}

    public async refreshLogin() {
        if (!this.refreshToken) return false;
        if (this.accessTokenExpiryTimestamp < Date.now()) {
            const auth = await this.API.auth.refresh(this.refreshToken);
            this.setAccessToken(
                auth.access_token,
                Date.now() + auth.expires_in * 1000
            );
        }
        this.refreshScheduler?.cancel();
        this.refreshScheduler = schedue.scheduleJob(
            this.accessTokenExpiryTimestamp - 60 * 1000,
            () => {
                this.refreshLogin();
            }
        );
        return true;
    }

    public static async create(refreshToken?: string): Promise<PixNode | null> {
        const self = new PixNode();
        if (refreshToken) {
            if (await self.setRefreshToken(refreshToken)) return self;
        } else {
            const auth = await self.API.auth.loginCLI();
            self.setAccessToken(
                auth.access_token,
                Date.now() + auth.expires_in * 1000
            );
            if (await self.setRefreshToken(auth.refresh_token)) return self;
        }
        return null;
    }
}
