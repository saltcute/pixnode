import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import axios from "axios";
import qs from 'qs';

/**
 * Add an illustration to bookmark
 * @param loginInfo Contains login credentials and account information
 * @param illustID ID of the illustration to be added to bookmark
 * @param visibility (Default: PUBLIC) Visibility of the specified illustration in bookmark
 * @param tags (optional) Bookmark tags of the specified illustration
 */
export default async (
    loginInfo: types.loginCredential,
    illustID: string,
    { visibility = "PUBLIC", tags }: {
        visibility: keyof typeof enums.VISIBILITY,
        tags?: Array<string>
    }
): Promise<void> => {
    let tag = tags?.join(" ");
    try {
        return axios({
            url: `${enums.API_BASE_URL}/v2/illust/bookmark/add`,
            method: "POST",
            data: qs.stringify({
                illust_id: illustID,
                restrict: enums.VISIBILITY[visibility],
                "tags[]": tag
            }),
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": enums.ACCEPT_LANGUAGE
            }
        })
    } catch (err) {
        return Promise.reject(err);
    }
}