import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
const najax = require('najax');

/**
 * Get current trending tags
 * @param loginInfo Contains login credentials and account information
 * @param callback (optional) Callback function
 */
export function main(
    loginInfo: types.loginCredential,
    callback?: (res: object, err?: object) => any
): void {
    najax({
        url: `${enums.API_BASE_URL}/v1/trending-tags/illust`,
        type: "GET",
        data: {
            filter: enums.FILTER
        },
        headers: {
            "User-Agent": enums.USER_AGENT,
            "Authorization": `Bearer ${loginInfo.access_token}`,
            "Accept-Language": enums.acceptLanguage()
        },
        success: (data: string) => {
            let tmp = JSON.parse(data);
            let res = new Array()
            for (let val of tmp.trend_tags) {
                res.push({
                    tag: new types.tag(
                        val.tag,
                        val.translated_name,
                    ),
                    illust: common.illustToTypes(val.illust)
                })
            }
            if (callback !== undefined) callback(res);
        }
    }).error((err: object) => {
        if (callback !== undefined) callback({}, err);
    })
}