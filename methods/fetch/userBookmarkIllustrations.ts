import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
const najax = require('najax');

/**
 * Get bookmarked illustrations of the specified user
 * @param loginInfo Contains login credentials and account information
 * @param userID ID of the specified user
 * @param visibility (Default: PUBLIC) Visibility of bookmarks
 * @param maxBookmarkID (optional) Max ID number of bookmarks in response
 * @param tag (optional) Bookmark tag 
 * @param callback (optional) Callback function
 */
export function main(
    loginInfo: types.loginCredential,
    userID: number,
    { visibility = "PUBLIC", maxBookmarkID, tag }: {
        visibility?: keyof typeof enums.VISIBILITY,
        maxBookmarkID?: number,
        tag?: string
    },
    callback?: (res: object, err?: object) => any
): void {
    najax({
        url: `${enums.API_BASE_URL}/v1/user/bookmarks/illust`,
        type: "GET",
        data: {
            user_id: userID,
            restrict: enums.VISIBILITY[visibility],
            max_bookmark_id: maxBookmarkID,
            tag: tag
        },
        headers: {
            "User-Agent": enums.USER_AGENT,
            "Authorization": `Bearer ${loginInfo.access_token}`,
            "Accept-Language": enums.ACCEPT_LANGUAGE
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
        if (callback !== undefined) callback({}, err);
    })
}