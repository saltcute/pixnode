import { types } from "../../definition/types";
import { enums } from "../../definition/enum";
import { common } from "../common";
const najax = require('najax');

/**
 * Get detail for a illustration of the specified ID
 * @param loginInfo Contains login credential and account information
 * @param illustID Illustration ID
 * @param callback (optional) Callback function
 */
export function main(
    loginInfo: types.loginCredential,
    illustID: string,
    callback?: (res?: object, err?: object) => any
) {
    najax({
        url: `${enums.API_BASE_URL}/v1/illust/detail`,
        type: 'GET',
        data: {
            illust_id: illustID
        },
        headers: {
            "User-Agent": enums.USER_AGENT,
            "Authorization": `Bearer ${loginInfo.access_token}`,
            "Accept-Language": "English"
        },
        success: (data: string) => {
            let tmp = JSON.parse(data).illust;
            let res = common.illustToTypes(tmp);
            if (callback !== undefined) callback(res);
        }
    }).error((err: object) => {
        if (callback !== undefined) callback(err);
    });
}