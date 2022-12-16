import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
import axios from 'axios';

/**
 * Get bookmark tags of the specified user
 * @param loginInfo Contains login credentials and account information
 * @param userID ID of the specified user
 * @param visibility (Default: Public) Visibility of bookmarks
 * @param offset (optional) Bookmark tags order number offset
 * @param callback (optional) Callback function
 */
export default async (
    loginInfo: types.loginCredential,
    userID: number,
    { visibility = "PUBLIC", offset }: {
        visibility?: keyof typeof enums.VISIBILITY,
        offset?: number
    }
): Promise<any> => {
    try {
        const res = (await axios({
            url: `${enums.API_BASE_URL}/v1/user/bookmark-tags/illust`,
            method: 'GET',
            params: {
                user_id: userID,
                restrict: enums.VISIBILITY[visibility],
                offset: offset
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": enums.ACCEPT_LANGUAGE
            }
        }));
        return res.data;
    } catch (err) {
        return Promise.reject(err);
    }
}