import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import axios from "axios";
import qs from 'qs';

/**
 * Remove an illustration from bookmark
 * @param loginInfo Contains login credentials and account information
 * @param illustID ID of the illustration to be deleted
 */
export default async (
    loginInfo: types.loginCredential,
    illustID: number
): Promise<void> => {
    try {
        return axios({
            url: `${enums.API_BASE_URL}/v2/illust/bookmark/delete`,
            method: 'POST',
            data: qs.stringify({
                illust_id: illustID
            }),
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": enums.ACCEPT_LANGUAGE
            }
        });
    } catch (err) {
        return Promise.reject(err);
    }
}