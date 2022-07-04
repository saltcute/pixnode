import { types } from "../../definition/types";
import { enums } from "../../definition/enum";
import { common } from "../common";
const najax = require('najax');

/**
 * Get illustrations published by the specified user
 * @param loginInfo Contains login credentials and account information
 * @param userID User ID
 * @param contentType (optional) Content type
 * @param offset (optional) Response order offset
 * @param callback (optional) Callback function
 */
export function main(
    loginInfo: types.loginCredential,
    userID: number,
    { contentType, offset }: {
        contentType?: keyof typeof enums.CONTENT_TYPE,
        offset?: number
    },
    callback?: (res: object, err?: object) => any
): void {
    najax({
        url: `${enums.API_BASE_URL}/v1/user/illusts`,
        type: "GET",
        data: {
            user_id: userID,
            type: contentType,
            offset: offset,
            filter: enums.FILTER
        },
        headers: {
            "User-Agent": enums.USER_AGENT,
            "Authorization": `Bearer ${loginInfo.access_token}`,
            "Accept-Language": "English"
        },
        success: (data: string): void => {
            let tmp = JSON.parse(data);
            let res = new Array<types.illustration>();
            for (let val of tmp.illusts) {
                res.push(common.illustToTypes(val));
            }
            if (callback !== undefined) callback(res);
        }
    }).error((err: object) => {
        if (callback !== undefined) callback(err);
    })
}