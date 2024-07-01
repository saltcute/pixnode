import { Base } from ".";
import crypto from "crypto";
import readlineSync from "readline-sync";
export default class Auth extends Base {
    private getSecureToken() {
        return crypto.randomBytes(32).toString("base64url");
    }

    public async login(code: string, codeVerifier: string) {
        return await this.requestor.auth({
            client_id: this.requestor.CLIENT_ID,
            client_secret: this.requestor.CLIENT_SECRET,
            code,
            code_verifier: codeVerifier,
            grant_type: "authorization_code",
            include_policy: false,
            redirect_uri: `${this.requestor.API_BASE_URL}/web/v1/users/auth/pixiv/callback`,
        });
    }

    public async loginCLI() {
        let codeVerifier = this.getSecureToken();
        let codeChallenge = crypto
            .createHash("sha256")
            .update(codeVerifier)
            .digest("base64")
            .split("/")
            .join("_")
            .split("+")
            .join("-")
            .split("=")
            .join("");
        let LOGIN_PARAMS = {
            code_challenge: codeChallenge,
            code_challenge_method: "S256",
            client: "pixiv-android",
        };
        console.log(
            "Please copy the URL below to browser and proceed to login as you would usually do.\n" +
                `${this.requestor.API_BASE_URL}/web/v1/login?${new URLSearchParams(LOGIN_PARAMS).toString()}\n` +
                "When you see a blank page page, press F12 or Ctrl + Shift + I (Command + Option + I on mac)\n" +
                `Switch to "Console" tab and you will see an error shows:\n` +
                `"Failed to launch 'pixiv://...' because the scheme does not have a registered handler"`
        );
        let answer = "";
        while (true) {
            answer = readlineSync.question(
                `Copy the link starts with "pixiv://" and paste it here: `
            );
            if (answer.search("pixiv://account/login") == -1) {
                console.log(
                    `The URL (${answer}) is not correct. Please try again.`
                );
            } else {
                let code = new URLSearchParams(
                    answer.replace("pixiv://account/login", "")
                ).get("code");
                if (code) {
                    const res = await this.login(code, codeVerifier);
                    if (this.isSuccessData(res)) return res;
                    else console.error(res);
                } else {
                    console.log(
                        `Code not found in the URL. Did you copy the entire URL?`
                    );
                }
            }
        }
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
