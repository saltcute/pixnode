import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
import axios from 'axios';

/**
 * Get most popular illustration in certain day, month, year, etc.
 * @param loginInfo Contains login credential and account information 
 * @param mode (optional) Ranking mode
 * @param date (optional) Ranking date
 * @param offset (optional) Illustration ranking offset (starting point)
 */
export default async (
    loginInfo: types.loginCredential,
    { mode = "DAY", date, offset }: {
        mode?: keyof typeof enums.RANKING_MODE,
        date?: string,
        offset?: number
    }
): Promise<types.illustration[]> => {
    try {
        const res = (await axios({
            url: `${enums.API_BASE_URL}/v1/illust/ranking`,
            method: 'GET',
            params: {
                'mode': enums.RANKING_MODE[mode],
                'data': date,
                'offset': offset,
                'filter': enums.FILTER,
            },
            headers: {
                'User-Agent': enums.USER_AGENT,
                'Authorization': `Bearer ${loginInfo.access_token}`,
                'Accept-Language': "English"
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