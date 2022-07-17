import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
const najax = require('najax');

/**
 * Get an list of user that is followed by the given user
 * @param loginInfo Contains login credentials and account information
 * @param userID ID of the specified user
 * @param visibility (Default: Public) Visibility of following user
 * @param offset (optional) User order number offset (starting point)
 * @param callback (optional) Callback function
 */
export function main(
    loginInfo: types.loginCredential,
    userID: number,
    { visibility = "PUBLIC", offset }: {
        visibility?: keyof typeof enums.VISIBILITY,
        offset?: number
    },
    callback?: (res: object, err?: object) => any
): void {
    najax({
        url: `${enums.API_BASE_URL}/v1/user/following`,
        type: "GET",
        data: {
            user_id: userID,
            restrict: enums.VISIBILITY[visibility],
            offset: offset
        },
        headers: {
            "User-Agent": enums.USER_AGENT,
            "Authorization": `Bearer ${loginInfo.access_token}`,
            "Accept-Language": enums.acceptLanguage()
        },
        success: (data: string): void => {
            let tmp = JSON.parse(data).user_previews;
            let res = new Array();
            for (let val of tmp) {
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
                })
            }
            if (callback !== undefined) callback(res);
        }
    }).error((err: object) => {
        if (callback !== undefined) callback({}, err);
    })
}