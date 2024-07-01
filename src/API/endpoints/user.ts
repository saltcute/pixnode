import { Base } from ".";
import {
    ICurrentUserFollowers,
    IUserBookmarkIllusts,
    IUserBookmarkTags,
    IUserDetail,
    IUserIllusts,
    IUserSearch,
    TIllustTypes,
    TVisibility,
} from "./type";

export default class User extends Base {
    /**
     * Get the details of a specific user.
     *
     * @param userId Target user id.
     * @returns Details of the user.
     */
    public async detail(userId: string) {
        return this.requestor.get<IUserDetail>(`/v1/user/detail`, {
            user_id: userId,
        });
    }
    /**
     * Get the list of illusts of a specific user.
     *
     * @param userId Target user id.
     * @param offset Multipage offset.
     * @param type Illust type.
     * @returns List of illusts.
     */
    public async illusts(userId: string, offset?: number, type?: TIllustTypes) {
        return this.requestor.get<IUserIllusts>(`/v1/user/illusts`, {
            user_id: userId,
            offset,
            type,
        });
    }
    /**
     * Get all bookmark tags of a specific user.
     *
     * @param userId Target user id.
     * @param offset Multipage offset.
     * @param restrict Bookmark visibility.
     * @returns List of tags.
     */
    public async bookmarkTags(
        userId: string,
        offset?: number,
        restrict: TVisibility = "public"
    ) {
        return this.requestor.get<IUserBookmarkTags>(
            `/v1/user/bookmark-tags/illust`,
            {
                user_id: userId,
                restrict,
                offset,
            }
        );
    }
    /**
     * Get the list of bookmarked illusts of a specific user.
     *
     * @param userId Target user id.
     * @param offset Multipage offset.
     * @param limit Max illust id.
     * @param tag Limit to a specific bookmark tag.
     * @param restrict Bookmark visibility.
     * @returns
     */
    public async bookmarkIllusts(
        userId: string,
        offset?: number,
        limit?: number,
        tag?: string,
        restrict: TVisibility = "public"
    ) {
        return this.requestor.get<IUserBookmarkIllusts>(
            `/v1/user/bookmarks/illust`,
            {
                user_id: userId,
                restrict,
                offset,
                max_bookmark_id: limit,
                tag,
            }
        );
    }
    /**
     * Search for a user.
     *
     * @param keyword The keyword used to search.
     * @param offset Multipage offset.
     * @returns List of relevant users.
     */
    public async search(keyword: string, offset?: number) {
        return this.requestor.get<IUserSearch>(`/v1/search/user`, {
            word: keyword,
            offset,
        });
    }
    /**
     * Get the list of users that is following the current user that is logged in.
     *
     * @param offset Multipage offset.
     * @returns List of followers.
     */
    public async followers(offset?: number) {
        return this.requestor.get<ICurrentUserFollowers>(`/v1/user/follower`, {
            offset,
        });
    }
    /**
     * Get the list of users that the target user is following.
     *
     * @param userId Target user id.
     * @param offset Multipage offset.
     * @param restrict Following visibility.
     * @returns List of following users.
     */
    public async following(
        userId: string,
        offset?: number,
        restrict: TVisibility = "public"
    ) {
        return this.requestor.get<ICurrentUserFollowers>(`/v1/user/following`, {
            user_id: userId,
            offset,
            restrict,
        });
    }
}
