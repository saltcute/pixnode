import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
const najax = require('najax');

/**
 * Get bookmark tags of the specified user
 * @param loginInfo Contains login credentials and account information
 * @param userID ID of the specified user
 * @param visibility (Default: Public) Visibility of bookmarks
 * @param offset (optional) Bookmark tags order number offset
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
        url: `${enums.API_BASE_URL}/v1/user/bookmark-tags/illust`,
        type: "GET",
        data: {
            user_id: userID,
            restrict: enums.VISIBILITY[visibility],
            offset: offset
        },
        headers: {
            "User-Agent": enums.USER_AGENT,
            "Authorization": `Bearer ${loginInfo.access_token}`,
            "Accept-Language": enums.ACCEPT_LANGUAGE
        },
        success: (data: string): void => {
            let res = JSON.parse(data);

            if (callback !== undefined) callback(res);
        }
    }).error((err: object) => {
        if (callback !== undefined) callback({}, err);
    })
}