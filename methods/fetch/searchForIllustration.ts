import { types } from "../../definition/types";
import { enums } from "../../definition/enum";
import { common } from "../common";
const najax = require('najax');

/**
 * Search for illustration with the specified information
 * @param loginInfo Contains login credential and account information
 * @param keyword Search keyword
 * @param searchTarget (optional) Keyword matching rule
 * @param sort (optional) Sort criteria
 * @param duration (optional) Rank duration
 * @param offset (optional) Illustration order offset (starting point)
 * @param callback (optional) Callback function
 */
export function main(
    loginInfo: types.loginCredential,
    keyword: string,
    { searchTarget = "TAGS_PARTIAL", sort = "DATE_DESC", duration = "LAST_DAY", offset }: {
        searchTarget: keyof typeof enums.SEARCH_TARGET,
        sort: keyof typeof enums.SORT,
        duration?: keyof typeof enums.DURATION,
        offset?: number
    },
    callback?: (res?: object, err?: object) => any
): void {
    najax({
        url: `${enums.API_BASE_URL}/v1/search/illust`,
        data: {
            word: keyword,
            search_target: enums.SEARCH_TARGET[searchTarget],
            sort: enums.SORT[sort],
            duration: duration,
            offset: offset,
            filter: enums.FILTER,
        },
        headers: {
            "User-Agent": enums.USER_AGENT,
            "Authorization": `Bearer ${loginInfo.access_token}`,
            "Accept-Language": "English"
        },
        success: (data: string) => {
            let tmp = JSON.parse(data);
            let res = new Array<types.illustration>();
            for (let val of tmp.illusts) {
                res.push(common.illustToTypes(val))
            }
            if (callback !== undefined) callback(res);
        }
    }).error((err: object) => {
        if (callback !== undefined) callback(err);
    });
};