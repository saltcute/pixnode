import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
const najax = require('najax');

/**
 * Check if a specified illustration is bookmarked by current user
 * @param loginInfo Contains login credentials and account information
 * @param illustID ID of the specified illustration
 * @param callback (optional) Callback function
 */
export function main(
    loginInfo: types.loginCredential,
    illustID: string,
    callback?: (res: object, err?: object) => any
): void {
    najax({
        url: `${enums.API_BASE_URL}/v2/illust/bookmark/detail`,
        type: "GET",
        data: {
            illust_id: illustID
        },
        headers: {
            "User-Agent": enums.USER_AGENT,
            "Authorization": `Bearer ${loginInfo.access_token}`,
            "Accept-Language": enums.ACCEPT_LANGUAGE
        },
        success: (data: string) => {
            let tmp = JSON.parse(data).bookmark_detail;
            if (callback !== undefined) callback({
                is_bookmarked: tmp.is_bookmarked,
                tags: (() => {
                    let res = new Array<types.tag>();
                    for (let val of tmp.tags) {
                        res.push(common.tagToTypes(val));
                    }
                    return res;
                })(),
                restrict: tmp.restrict
            });
        }
    }).error((err: object) => {
        if (callback !== undefined) callback({}, err);
    })
}