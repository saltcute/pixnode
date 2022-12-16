import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
import axios from 'axios';

/**
 * Get bookmarked illustrations of the specified user
 * @param loginInfo Contains login credentials and account information
 * @param userID ID of the specified user
 * @param visibility (Default: PUBLIC) Visibility of bookmarks
 * @param maxBookmarkID (optional) Max ID number of bookmarks in response
 * @param tag (optional) Bookmark tag 
 * @param callback (optional) Callback function
 */
export default async (
    loginInfo: types.loginCredential,
    userID: number,
    { visibility = "PUBLIC", maxBookmarkID, tag }: {
        visibility?: keyof typeof enums.VISIBILITY,
        maxBookmarkID?: number,
        tag?: string
    }
): Promise<types.illustration[]> => {
    try {
        const res = (await axios({
            url: `${enums.API_BASE_URL}/v1/user/bookmarks/illust`,
            method: 'GET',
            params: {
                user_id: userID,
                restrict: enums.VISIBILITY[visibility],
                max_bookmark_id: maxBookmarkID,
                tag: tag
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": enums.ACCEPT_LANGUAGE
            }
        }));

        let tmp = new Array<types.illustration>();
        for (let val of res.data.illusts) {
            tmp.push(common.illustToTypes(val));
        }
        return tmp;
    } catch (err) {
        return Promise.reject(err);
    }
}