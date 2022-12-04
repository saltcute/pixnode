import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
import axios from 'axios';

/**
 * Get related illustration of the illustration of the specified ID
 * @param loginInfo Contains login credentials and account information
 * @param illustID Illustration ID
 * @param offset (optional) Illustration order offset (starting point)
 * @param callback (optional) Callback function
 */
export default async (
    loginInfo: types.loginCredential,
    illustID: number,
    { offset }: {
        offset?: number
    }
): Promise<types.illustration[]> => {
    try {
        const res = (await axios({
            url: `${enums.API_BASE_URL}/v2/illust/related`,
            method: 'GET',
            params: {
                illust_id: illustID,
                offset: offset
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": enums.ACCEPT_LANGUAGE
            }
        }));
        let tmp = new Array<types.illustration>();
        for (let val of res.data.illusts) {
            tmp.push(common.illustToTypes(val))
        }
        return tmp;
    } catch (err) {
        return Promise.reject(err);
    }
}