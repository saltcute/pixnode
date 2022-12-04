import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
import axios from 'axios'

/**
 * Check if a specified illustration is bookmarked by current user
 * @param loginInfo Contains login credentials and account information
 * @param illustID ID of the specified illustration
 * @returns Bookmark infomation
 */
export default async (
    loginInfo: types.loginCredential,
    illustID: number
): Promise<{ is_bookmarked: number, tags: types.tag[], restrict: number }> => {
    try {
        const res = (await axios({
            url: `${enums.API_BASE_URL}/v2/illust/bookmark/detail`,
            method: 'GET',
            params: {
                illust_id: illustID
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": enums.ACCEPT_LANGUAGE
            }
        }));
        let tmp = res.data.bookmark_detail;
        return {
            is_bookmarked: tmp.is_bookmarked,
            tags: (() => {
                let tags = new Array<types.tag>();
                for (let val of tmp.tags) {
                    tags.push(common.tagToTypes(val));
                }
                return tags;
            })(),
            restrict: tmp.restrict
        };
    } catch (err) {
        return Promise.reject(err);
    }
}