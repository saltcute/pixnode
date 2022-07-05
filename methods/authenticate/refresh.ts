import { enums } from '../../constants/enums';
import { types } from '../../constants/types';
const najax = require('najax');

/**
* Establish a new login session of current user
* @param refresh_token Refresh token of user
* @param callback (optional) Callback function
*/
export function main(
    refresh_token: string,
    callback?: (res: types.loginCredential, err?: object) => any
): void {
    najax({
        url: enums.AUTH_URL,
        type: "POST",
        data: {
            'client_id': enums.CLIENT_ID,
            'client_secret': enums.CLIENT_SECRET,
            'grant_type': "refresh_token",
            'include_policy': true,
            'refresh_token': refresh_token
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
                    tmp.user.mail_address,
                    tmp.user.is_premium,
                    tmp.user.x_restrict,
                    "English"
                )
            )
            if (callback !== undefined) callback(res);
        }
    }).error((err: any): void => {
        if (callback !== undefined) callback(err)
    });
}