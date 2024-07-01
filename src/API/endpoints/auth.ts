import { Base } from ".";
import crypto from "crypto";
import readlineSync from "readline-sync";
export default class Auth extends Base {
    private getSecureToken() {
        return crypto.randomBytes(32).toString("base64url");
    }

    public async loginCLI() {
        let pullUpURL: string;
        let code_verifier = this.getSecureToken();
        let code_challenge = crypto
            .createHash("sha256")
            .update(code_verifier)
            .digest("base64")
            .split("/")
            .join("_")
            .split("+")
            .join("-")
            .split("=")
            .join("");
        let LOGIN_PARAMS = {
            code_challenge: code_challenge,
            code_challenge_method: "S256",
            client: "pixiv-android",
        };
        console.log(
            "Please copy the URL below to browser and proceed to login as you would usually do."
        );
        console.log(
            `${this.requestor.API_BASE_URL}/web/v1/login?${new URLSearchParams(LOGIN_PARAMS).toString()}`
        );
        console.log(
            "When you see a blank page page, press F12 or Ctrl + Shift + I (Command + Option + I on mac)"
        );
        console.log(`Switch to "Console" tab and you will see an error shows:`);
        console.log(
            `"Failed to launch 'pixiv://...' because the scheme does not have a registered handler"`
        );
        while (true) {
            pullUpURL = readlineSync.question(
                `Copy the link starts with "pixiv://" and paste it here: `
            );
            if (pullUpURL.search("pixiv://account/login") == -1) {
                console.log(
                    `The URL (${pullUpURL}) is not correct. Please try again.`
                );
            } else break;
        }
        let AUTH_CODE = new URLSearchParams(
            pullUpURL.replace("pixiv://account/login", "")
        ).get("code");

        return await this.requestor.auth({
            client_id: this.requestor.CLIENT_ID,
            client_secret: this.requestor.CLIENT_SECRET,
            code: AUTH_CODE,
            code_verifier: code_verifier,
            grant_type: "authorization_code",
            include_policy: false,
            redirect_uri: `${this.requestor.API_BASE_URL}/web/v1/users/auth/pixiv/callback`,
        });
    }

    public async refresh(refreshToken: string) {
        return await this.requestor.auth({
            client_id: this.requestor.CLIENT_ID,
            client_secret: this.requestor.CLIENT_SECRET,
            grant_type: "refresh_token",
            include_policy: false,
            refresh_token: refreshToken,
        });
    }
}
