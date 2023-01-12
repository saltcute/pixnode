import Bookmark from './fetch/bookmark'
import Followers from './fetch/followers'
import FollowingUsers from './fetch/followingUsers'
import Illustration from './fetch/illustration'
import IllustrationComments from './fetch/illustrationComments'
import IllustrationFromFollowingCreators from './fetch/illustrationFromFollowingCreators'
import IllustrationRanking from './fetch/illustrationRanking'
import RecommendedIllustrations from './fetch/recommendedIllustrations'
import RelatedIllustrations from './fetch/relatedIllustrations'
import SearchForIllustration from './fetch/searchForIllustration'
import TrendingTags from './fetch/trendingTags'
import User from './fetch/user'
import UserBookmarkIllustrations from './fetch/userBookmarkIllustrations'
import UserBookmarkTags from './fetch/userBookmarkTags'
import UserIllustrations from './fetch/userIllustrations'
import SearchForUser from './fetch/searchForUser'



/**
 * Methods to fetch information (ranking, illutration info, etc.)
 */
export namespace fetch {
    export const bookmark = Bookmark;
    export const followers = Followers;
    export const followingUsers = FollowingUsers;
    export const illustration = Illustration;
    export const illustrationComments = IllustrationComments;
    export const illustrationFromFollowingCreators = IllustrationFromFollowingCreators;
    export const illustrationRanking = IllustrationRanking;
    export const recommendedIllustrations = RecommendedIllustrations;
    export const relatedIllustrations = RelatedIllustrations;
    export const searchForIllustration = SearchForIllustration;
    export const trendingTags = TrendingTags;
    export const user = User;
    export const userBookmarkIllustrations = UserBookmarkIllustrations;
    export const userBookmarkTags = UserBookmarkTags;
    export const userIllustrations = UserIllustrations;
    export const searchForUser = SearchForUser;
}
