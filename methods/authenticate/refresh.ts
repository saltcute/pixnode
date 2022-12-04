import { enums } from '../../constants/enums';
import { types } from '../../constants/types';
import axios from 'axios';
import qs from 'qs';

/**
* Establish a new login session of current user
* @param refresh_token Refresh token of user
* @returns Login credential of user
*/
export default async (refresh_token: string): Promise<types.loginCredential> => {
    try {
        const res = (await axios({
            url: enums.AUTH_URL,
            method: 'POST',
            data: qs.stringify({
                'client_id': enums.CLIENT_ID,
                'client_secret': enums.CLIENT_SECRET,
                'grant_type': "refresh_token",
                'include_policy': true,
                'refresh_token': refresh_token
            }),
            headers: {
                'User-Agent': enums.USER_AGENT
            }
        }));
        var tmp = new types.loginCredential(
            res.data.access_token,
            res.data.refresh_token,
            res.data.expires_in + Math.floor(Date.now() / 1000),
            new types.accountInformation(
                res.data.user.id,
                res.data.user.name,
                res.data.user.account,
                res.data.user.mail_address,
                res.data.user.is_premium,
                res.data.user.x_restrict
            )
        )
        return tmp;
    } catch (err) {
        return Promise.reject(err);
    }
}