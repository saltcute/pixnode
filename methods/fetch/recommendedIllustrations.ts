import { types } from "../../constants/types";
import { enums } from "../../constants/enums";
import { common } from "../common";
import axios from 'axios';

/**
 * Get recommended illustration
 * @param loginInfo Contains login credentials and account information
 * @param contentType (optional) Type of content (illustration, manga, etc.)
 * @param includeRankingIllustration (Defualt: false) Include top 10 illustration of the day in response
 * @param maxBookmarkIDForRecommend (optional) 
 * @param minBookmarkIDForRecentIllustrations (optional) 
 * @param offset (optional) Illustration offset (starting point)
 * @param bookmarkIllustIDs (optional) An array containing illustration IDs
 * @param includeRankingLabel (Default: true) Whether to include ranking label or not
 */
export default async (
    loginInfo: types.loginCredential,
    { contentType = "ILLUSTRATION", includeRankingIllustration = "false", maxBookmarkIDForRecommend, minBookmarkIDForRecentIllustrations, offset, bookmarkIllustIDs, includeRankingLabel = "true" }: {
        contentType?: keyof typeof enums.CONTENT_TYPE,
        includeRankingIllustration?: "false" | "true",
        maxBookmarkIDForRecommend?: number,
        minBookmarkIDForRecentIllustrations?: number,
        offset?: number,
        bookmarkIllustIDs?: [],
        includeRankingLabel?: "false" | "true"
    }
): Promise<types.illustration[]> => {
    let bookmarkIllustID = bookmarkIllustIDs?.join(",");
    try {
        const res = (await axios({
            url: `${enums.API_BASE_URL}/v1/illust/recommended`,
            method: 'GET',
            params: {
                content_type: enums.CONTENT_TYPE[contentType],
                include_ranking_label: includeRankingLabel,
                max_bookmark_id_for_recommend: maxBookmarkIDForRecommend,
                min_bookmark_id_for_recent_illust: minBookmarkIDForRecentIllustrations,
                offset: offset,
                include_ranking_illusts: includeRankingIllustration,
                bookmark_illust_ids: bookmarkIllustID
            },
            headers: {
                "User-Agent": enums.USER_AGENT,
                "Authorization": `Bearer ${loginInfo.access_token}`,
                "Accept-Language": enums.ACCEPT_LANGUAGE
            }
        }));
        let tmp = new Array<types.illustration>();
        for (let val of res.data.illusts) {
            tmp.push(common.illustToTypes(val))
        }
        return tmp;
    } catch (err) {
        return Promise.reject(err);
    }
}