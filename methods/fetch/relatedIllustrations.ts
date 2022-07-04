import { types } from "../../definition/types";
import { enums } from "../../definition/enum";
import { common } from "../common";
const najax = require('najax');

/**
 * Get related illustration of the illustration of the specified ID
 * @param loginInfo Contains login credentials and account information
 * @param illustID Illustration ID
 * @param offset (optional) Illustration order offset (starting point)
 * @param callback (optional) Callback function
 */
export function main(
    loginInfo: types.loginCredential,
    illustID: string,
    { offset }: {
        offset?: string
    },
    callback?: (res?: object, err?: object) => any
): void {
    najax({
        url: `${enums.API_BASE_URL}/v2/illust/related`,
        type: "GET",
        data: {
            illust_id: illustID,
            offset: offset
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
}