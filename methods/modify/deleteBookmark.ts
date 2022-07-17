import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
const najax = require('najax');

/**
 * Remove an illustration from bookmark
 * @param loginInfo Contains login credentials and account information
 * @param illustID ID of the illustration to be deleted
 * @param callback (optional) Callback function
 */
export function main(
    loginInfo: types.loginCredential,
    illustID: string,
    callback?: (res: object, err?: object) => any
): void {
    najax({
        url: `${enums.API_BASE_URL}/v2/illust/bookmark/delete`,
        type: "POST",
        data: {
            illust_id: illustID
        },
        headers: {
            "User-Agent": enums.USER_AGENT,
            "Authorization": `Bearer ${loginInfo.access_token}`,
            "Accept-Language": enums.acceptLanguage()
        },
        success: (data: string) => {
            let res = JSON.parse(data);
            if (callback !== undefined) callback(res);
        }
    }).error((err: object) => {
        if (callback !== undefined) callback({}, err);
    })
}