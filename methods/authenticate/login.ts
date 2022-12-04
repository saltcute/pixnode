import { common } from '../common';
import { enums } from '../../constants/enums';
import { types } from '../../constants/types';
import crypto from 'crypto';
import axios from 'axios';
import readlineSync from 'readline-sync';
import qs from 'qs';

/**
* Login with browser to a pixiv account
* @return Login credentials
*/
export default async (): Promise<types.loginCredential> => {
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
    try {
        return (await axios({
            url: enums.AUTH_URL,
            method: 'POST',
            data: qs.stringify({
                'client_id': enums.CLIENT_ID,
                'client_secret': enums.CLIENT_SECRET,
                'code': AUTH_CODE,
                'code_verifier': code_verifier,
                'grant_type': "authorization_code",
                'include_policy': true,
                'redirect_uri': `${enums.API_BASE_URL}/web/v1/users/auth/pixiv/callback`
            }),
            headers: {
                'User-Agent': enums.USER_AGENT
            }
        }).then((res: any): types.loginCredential => {
            var ret = new types.loginCredential(
                res.data.access_token,
                res.data.refresh_token,
                res.data.expires_in + Math.floor(Date.now() / 1000),
                new types.accountInformation(
                    res.data.user.id,
                    res.data.user.name,
                    res.data.user.account,
                    res.data.user.mail,
                    res.data.user.is_premium,
                    res.data.user.x_restrict,
                )
            )
            return ret;
        }));
    } catch (err) {
        return Promise.reject(err);
    }
}