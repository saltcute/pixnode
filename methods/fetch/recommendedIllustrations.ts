import { types } from "../../definition/types";
import { enums } from "../../definition/enum";
import { common } from "../common";
const najax = require('najax');

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
 * @param callback (optional) Callback function
 */
export function main(
    loginInfo: types.loginCredential,
    { contentType, includeRankingIllustration = "false", maxBookmarkIDForRecommend, minBookmarkIDForRecentIllustrations, offset, bookmarkIllustIDs, includeRankingLabel = "true" }: {
        contentType?: keyof typeof enums.CONTENT_TYPE,
        includeRankingIllustration?: "false" | "true",
        maxBookmarkIDForRecommend?: number,
        minBookmarkIDForRecentIllustrations?: number,
        offset?: number,
        bookmarkIllustIDs?: [],
        includeRankingLabel?: "false" | "true"
    },
    callback?: (res: object, err?: object) => any
): void {
    let bookmarkIllustID = bookmarkIllustIDs?.join(",");
    najax({
        url: `${enums.API_BASE_URL}/v1/illust/recommended`,
        type: "GET",
        data: {
            content_type: contentType,
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
            "Accept-Language": "English"
        },
        success: (data: string) => {
            let tmp = JSON.parse(data);
            let res = new Array<types.illustration>();
            for (let val of tmp.illusts) {
                res.push(common.illustToTypes(val))
            }
            if (callback !== undefined) callback(res);
        }
    }).error((err: object) => {
        if (callback !== undefined) callback(err);
    })
}