import * as Bookmark from './fetch/bookmark'
import * as Followers from './fetch/followers'
import * as FollowingUsers from './fetch/followingUsers'
import * as Illustration from './fetch/illustration'
import * as IllustrationComments from './fetch/illustrationComments'
import * as IllustrationFromFollowingCreators from './fetch/illustrationFromFollowingCreators'
import * as IllustrationRanking from './fetch/illustrationRanking'
import * as RecommendedIllustrations from './fetch/recommendedIllustrations'
import * as RelatedIllustrations from './fetch/relatedIllustrations'
import * as SearchForIllustration from './fetch/searchForIllustration'
import * as TrendingTags from './fetch/trendingTags'
import * as User from './fetch/user'
import * as UserBookmarkIllustrations from './fetch/userBookmarkIllustrations'
import * as UserBookmarkTags from './fetch/userBookmarkTags'
import * as UserIllustrations from './fetch/userIllustrations'



/**
 * Methods to fetch information (ranking, illutration info, etc.)
 */
export namespace fetch {
    export const bookmark = Bookmark.main;
    export const followers = Followers.main;
    export const followingUsers = FollowingUsers.main;
    export const illustration = Illustration.main;
    export const illustrationComments = IllustrationComments.main;
    export const illustrationFromFollowingCreators = IllustrationFromFollowingCreators.main;
    export const illustrationRanking = IllustrationRanking.main;
    export const recommendedIllustrations = RecommendedIllustrations.main;
    export const relatedIllustrations = RelatedIllustrations.main;
    export const searchForIllustration = SearchForIllustration.main;
    export const trendingTags = TrendingTags.main;
    export const user = User.main;
    export const userBookmarkIllustrations = UserBookmarkIllustrations.main;
    export const userBookmarkTags = UserBookmarkTags.main;
    export const userIllustrations = UserIllustrations.main;
}
