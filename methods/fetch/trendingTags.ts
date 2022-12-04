import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
import axios from 'axios';

/**
 * Get current trending tags
 * @param loginInfo Contains login credentials and account information
 * @param callback (optional) Callback function
 */
export default async (
    loginInfo: types.loginCredential
): Promise<{ tag: types.tag, illust: types.illustration }[]> => {
    try {
        const res = (await axios({
            url: `${enums.API_BASE_URL}/v1/trending-tags/illust`,
            method: 'GET',
            params: {
                filter: enums.FILTER
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": enums.ACCEPT_LANGUAGE
            }
        }));
        let tmp = new Array()
        for (let val of res.data.trend_tags) {
            tmp.push({
                tag: new types.tag(
                    val.tag,
                    val.translated_name,
                ),
                illust: common.illustToTypes(val.illust)
            })
        }
        return tmp;
    } catch (err) {
        return Promise.reject(err);
    }
}