import { types } from "../../definition/types";
import { enums } from "../../definition/enum";
import { common } from "../common";
const najax = require('najax');

/**
 * Get most popular illustration in certain day, month, year, etc.
 * @param loginInfo Contains login credential and account information 
 * @param mode (optional) Ranking mode
 * @param date (optional) Ranking date
 * @param offset (optional) Illustration ranking offset (starting point)
 * @param callback (optional) Callback function
 */
export function main(
    loginInfo: types.loginCredential,
    { mode = "DAY", date, offset }: {
        mode: keyof typeof enums.RANKING_MODE,
        date?: string,
        offset?: string
    },
    callback?: (res?: object, err?: object) => any
): void {
    najax({
        url: `${enums.API_BASE_URL}/v1/illust/ranking`,
        type: "GET",
        data: {
            'mode': enums.RANKING_MODE[mode],
            'data': date,
            'offset': offset,
            'filter': enums.FILTER,
        },
        headers: {
            'User-Agent': enums.USER_AGENT,
            'Authorization': `Bearer ${loginInfo.access_token}`,
            'Accept-Language': "English"
        },
        success: (data: string): void => {
            let tmp = JSON.parse(data);
            let res = new Array<types.illustration>();
            for (let val of tmp.illusts) {
                res.push(common.illustToTypes(val))
            }
            if (callback !== undefined) callback(res);
        }
    }).error((err: object): void => {
        if (callback !== undefined) callback(err)
    });
}