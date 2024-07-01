import { Base } from ".";
import {
    IIllustComments,
    IIllustDetail,
    IIllustRanking,
    IIllustRecommendation,
    INewIllustsFromFollowingUsers,
    IRelatedIllusts,
    ISearchIllusts,
    TIllustRankingModes,
    TIllustSearchModes,
    TIllustTypes,
    TSortOptions,
} from "./type";

export default class Illust extends Base {
    /**
     * Get details of an illust.
     *
     * @param illustId Target illust id.
     * @returns Illust details.
     */
    public async detail(illustId: number) {
        return this.requestor.get<IIllustDetail>(`/v1/illust/detail`, {
            illust_id: illustId,
        });
    }
    /**
     * Get the comments of an illust.
     *
     * @param illustId Target illust id.
     * @returns List of comments.
     */
    public async comments(illustId: number) {
        return this.requestor.get<IIllustComments>(`/v1/illust/comments`, {
            illust_id: illustId,
        });
    }
    /**
     * Get new illust releases from following users of the current logged in user.
     *
     * @returns List of illusts.
     */
    public async newReleasesFromFollowingUsers() {
        return this.requestor.get<INewIllustsFromFollowingUsers>(
            "/v2/illust/follow"
        );
    }
    /**
     * Get illust ranking.
     *
     * @param mode Ranking mode. Eg. today, this week, this month etc.
     * @param date YYYY-MM-DD date of the ranking list.
     * @param offset Multipage offset.
     * @returns Illust ranking list.
     */
    public async ranking(
        mode: TIllustRankingModes,
        date?: string,
        offset?: number
    ) {
        return this.requestor.get<IIllustRanking>("/v1/illust/ranking", {
            mode,
            date,
            offset,
        });
    }

    /**
     * Get recommended illusts.
     *
     * @param type Illust type.
     * @returns List of recommended illusts.
     */
    public async recommdation(
        type: TIllustTypes,
        {
            offset,
            includeRanking,
            includeRankingLabel,
            includePrivacyPolicy,
            recommendMaxBookmarkId,
            recentMinBookmarkId,
            bookmarkIllustIds,
        }: {
            /**
             * Multipage offset.
             */
            offset?: number;
            /**
             * True to include ranking list in response.
             */
            includeRanking?: boolean;
            includeRankingLabel?: boolean;
            /**
             * True to include privacy policy in response.
             */
            includePrivacyPolicy?: boolean;
            /**
             * Maximum bookmark id for recommended illusts.
             */
            recommendMaxBookmarkId?: number;
            /**
             * Minimum bookmark id for recent illusts.
             */
            recentMinBookmarkId?: number;
            /**
             * List of bookmarked illust ids.
             */
            bookmarkIllustIds?: number[];
        }
    ) {
        return this.requestor.get<IIllustRecommendation>(
            "/v1/illust/recommended",
            {
                offset,
                content_type: type,
                bookmark_illust_ids: bookmarkIllustIds,
                include_ranking_illusts: includeRanking,
                include_ranking_label: includeRankingLabel,
                include_privacy_policy: includePrivacyPolicy,
                max_bookmark_id_for_recommend: recommendMaxBookmarkId,
                min_bookmark_id_for_recent_illust: recentMinBookmarkId,
            }
        );
    }

    public async related(illustId: number) {
        return this.requestor.get<IRelatedIllusts>(`/v2/illust/related`, {
            illust_id: illustId,
        });
    }

    public async search(
        keyword: string,
        mode: TIllustSearchModes,
        sort: TSortOptions,
        {
            includeTranslatedTags,
            periodStartDate,
            periodEndDate,
        }: {
            includeTranslatedTags?: boolean;
            /**
             * YYYY-MM-DD date.
             */
            periodStartDate?: string;
            /**
             * YYYY-MM-DD date.
             */
            periodEndDate?: string;
        }
    ) {
        return this.requestor.get<ISearchIllusts>(`/v1/search/illust`, {
            word: keyword,
            search_target: mode,
            sort,
            include_translated_tag_results: includeTranslatedTags,
            start_date: periodStartDate,
            end_date: periodEndDate,
        });
    }
}
