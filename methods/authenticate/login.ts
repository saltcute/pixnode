import { common } from '../common';
import { enums } from '../../constants/enums';
import { types } from '../../constants/types';
import crypto from 'crypto';
const najax = require('najax');
import readlineSync from 'readline-sync';

/**
* Login with browser to a pixiv account
* @param callback (optional) Callback function
*/
export function main(
    callback?: (res: object, err?: object) => any
): void {
    let pullUpURL: string;
    let code_verifier = common.tokenBase64(32);
    let code_challenge = crypto.createHash('sha256').update(code_verifier).digest('base64').split('/').join('_').split('+').join('-').split('=').join('');
    let LOGIN_PARAMS = {
        "code_challenge": code_challenge,
        "code_challenge_method": "S256",
        "client": "pixiv-android"
    }
    console.log("Please copy the URL below to browser and proceed to login as you would usually do.");
    console.log(`${enums.API_BASE_URL}/web/v1/login?${new URLSearchParams(LOGIN_PARAMS).toString()}`);
    console.log("When you see a blank page page, press F12 or Ctrl + Shift + I (Command + Option + I on mac)");
    console.log(`Switch to "Console" tab and you will see an error shows:`);
    console.log(`"Failed to launch 'pixiv://...' because the scheme does not have a registered handler"`)
    while (true) {
        pullUpURL = readlineSync.question(`Copy the link starts with "pixiv://" and paste it here: `)
        if (pullUpURL.search("pixiv://account/login") == -1) {
            console.log(`The URL (${pullUpURL}) is not correct. Please try again.`);
        } else break;
    }
    let AUTH_CODE = new URLSearchParams(pullUpURL.substring(21)).get('code');
    // console.log(AUTH_CODE);
    najax({
        url: enums.AUTH_URL,
        type: 'POST',
        data: {
            'client_id': enums.CLIENT_ID,
            'client_secret': enums.CLIENT_SECRET,
            'code': AUTH_CODE,
            'code_verifier': code_verifier,
            'grant_type': "authorization_code",
            'include_policy': true,
            'redirect_uri': `${enums.API_BASE_URL}/web/v1/users/auth/pixiv/callback`
        },
        headers: {
            'User-Agent': enums.USER_AGENT
        },
        success: (data: string): void => {
            let tmp = JSON.parse(data);
            let res = new types.loginCredential(
                tmp.access_token,
                tmp.refresh_token,
                tmp.expires_in + Math.floor(Date.now() / 1000),
                new types.accountInformation(
                    tmp.user.id,
                    tmp.user.name,
                    tmp.user.account,
                    tmp.user.mail,
                    tmp.user.is_premium,
                    tmp.user.x_restrict,
                    tmp.user.language
                )
            )
            if (callback !== undefined) callback(res);
        }
    }).error((err: object): void => {
        if (callback !== undefined) callback(err)
    });
}