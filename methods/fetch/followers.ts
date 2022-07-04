import { types } from "../../definition/types";
import { enums } from "../../definition/enum";
import { common } from "../common";
const najax = require('najax');

/**
 * Get an list of user that is following the current user
 * @param loginInfo Contains login credentials and account information
 * @param userID ID of the specified user
 * @param offset (optional) User order number offset (starting point)
 * @param callback (optional) Callback function
 */
export function main(
    loginInfo: types.loginCredential,
    { offset }: {
        offset?: number
    },
    callback?: (res?: object, err?: object) => any
): void {
    najax({
        url: `${enums.API_BASE_URL}/v1/user/follower`,
        type: "GET",
        data: {
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
            let res = new Array();
            for (let val of tmp.user_previews) {
                res.push({
                    user: new types.userInformation(
                        val.user.id,
                        val.user.name,
                        val.user.account
                    ),
                    illust: (() => {
                        let rt = new Array<types.illustration>();
                        for (let value of val.illusts) {
                            rt.push(common.illustToTypes(value));
                        }
                        return rt;
                    })()
                });
            }
            if (callback !== undefined) callback(res);
        }
    }).error((err: object) => {
        if (callback !== undefined) callback(err);
    })
}