import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
import axios from 'axios';

/**
 * Get illustrations published by the specified user
 * @param loginInfo Contains login credentials and account information
 * @param userID User ID
 * @param contentType (optional) Content type
 * @param offset (optional) Response order offset
 * @param callback (optional) Callback function
 */
export default async (
    loginInfo: types.loginCredential,
    userID: number,
    { contentType = "ILLUSTRATION", offset }: {
        contentType?: keyof typeof enums.CONTENT_TYPE,
        offset?: number
    }
): Promise<types.illustration[]> => {
    try {
        const res = (await axios({
            url: `${enums.API_BASE_URL}/v1/user/illusts`,
            method: 'GET',
            params: {
                user_id: userID,
                type: enums.CONTENT_TYPE[contentType],
                offset: offset,
                filter: enums.FILTER
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": enums.ACCEPT_LANGUAGE
            }
        }));
        let tmp = new Array<types.illustration>();
        for (let val of res.data.illusts) {
            tmp.push(common.illustToTypes(val));
        }
        return tmp;
    } catch (err) {
        return Promise.reject(err);
    }
}