import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
const najax = require('najax');

/**
 * Get detail of a user
 * @param loginInfo Contains login credentials and account information
 * @param userID ID of the user to be looked up
 * @param callback (optional) Callback function
 */
export function main(
    loginInfo: types.loginCredential,
    userID: number,
    callback?: (res: object, err?: object) => any
): void {
    najax({
        url: `${enums.API_BASE_URL}/v1/user/detail`,
        type: "GET",
        data: {
            user_id: userID,
            filter: enums.FILTER
        },
        headers: {
            "User-Agent": enums.USER_AGENT,
            "Authorization": `Bearer ${loginInfo.access_token}`,
            "Accept-Language": "English"
        },
        success: (data: string): void => {
            let res = JSON.parse(data);

            if (callback !== undefined) callback(res);
        }
    }).error((err: object) => {
        if (callback !== undefined) callback(err);
    })
}